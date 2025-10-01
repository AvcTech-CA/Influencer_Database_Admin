import React, { useState } from "react";
import "./InfluencerForm.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiconfig";

const InfluencerForm = () => {
  const navigate = useNavigate();

  const [imageError, setImageError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // 'success' or 'error'
  const [isFetchingInsta, setIsFetchingInsta] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Photo: "",
    Name: "",
    Username: "",
    GeoLocation: "",
    Ethnicity: "",
    Religion: "",
    Language: "",
    FollowerSizeAndTier: "",
    EngagementRate: "",
    FollowerData: "",
    ProfileDescription: "",
    SocialMediaPlatformLinks: [],
    CostRange: "",
    ContentNiche: "",
    AgencyorHandlerName: "",
    EmailAddress: "",
    HomeAddress: "",
    PhoneNumber: "",
    InternalNotes: [],
    CampaignNumber: "",
    NameofPastProjects: [],
    AVCBookedRate: "",
    DeliverablesforPastProjects: [],
    MonthofAVCPastProjects: "",
    YearofAVCPastProjects: "",
    PostLinksofAVCPastProjects: [],
    SharedDrivePath: "",
    OtherBrandsWorkedWith: [],
    ContentSampleLinks: []
  });

  // ---------- helpers ----------
  const followerTier = (count) => {
    if (count == null || isNaN(count)) return "";
    if (count < 10000) return "Nano";
    if (count < 100000) return "Micro";
    if (count < 1000000) return "Macro";
    return "Mega";
  };
  const csv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
  const toArr = (v) =>
    Array.isArray(v)
      ? v
      : typeof v === "string"
      ? v.split(",").map((s) => s.trim()).filter(Boolean)
      : v
      ? [String(v)]
      : [];
  const uniq = (arr) =>
    Array.from(new Set((arr || []).map((s) => String(s).trim()))).filter(Boolean);

  // normalize before submit (trim, dedupe arrays; keep strings as-is)
  const normalizeForSubmit = (data) => {
    const arrays = [
      "SocialMediaPlatformLinks",
      "InternalNotes",
      "NameofPastProjects",
      "DeliverablesforPastProjects",
      "PostLinksofAVCPastProjects",
      "OtherBrandsWorkedWith",
      "ContentSampleLinks",
    ];
    const out = { ...data };

    arrays.forEach((k) => (out[k] = uniq(toArr(out[k]))));

    // trim common strings so backend schema casting is happy
    [
      "Name","Username","GeoLocation","Ethnicity","Religion","Language",
      "FollowerSizeAndTier","EngagementRate","FollowerData","ProfileDescription",
      "CostRange","ContentNiche","AgencyorHandlerName","EmailAddress","HomeAddress",
      "PhoneNumber","CampaignNumber","AVCBookedRate","MonthofAVCPastProjects",
      "YearofAVCPastProjects","SharedDrivePath"
    ].forEach((k) => {
      out[k] = typeof out[k] === "string" ? out[k].trim() : out[k] || "";
    });

    return out;
  };

  const showPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => setPopupMessage(""), 2200);
  };

  // ---------- generic handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: toArr(e.target.value) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setImageError("Invalid file format. Please upload JPEG, PNG, or JPG.");
      setFormData((prev) => ({ ...prev, Photo: "" }));
    } else {
      setImageError("");
      setFormData((prev) => ({ ...prev, Photo: file }));
    }
  };

  // ---------- Auto-fill from file ----------
  const handleAutofillFromFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAutoFillLoading(true);
      const fd = new FormData();
      fd.append("file", file);

      // Try preferred route then alias
      const urls = [
        `${API_BASE_URL}/admin/ai/extract`,
        `${API_BASE_URL}/ai/extract`,
      ];
      let res, errText = "";
      for (const url of urls) {
        res = await fetch(url, { method: "POST", body: fd });
        if (res.status === 404) { errText = await res.text(); continue; }
        break;
      }
      if (!res || !res.ok) {
        const msg = (res && (await res.text())) || errText || "Extraction failed";
        throw new Error(msg);
      }

      const { data } = await res.json();

      // Compute FollowerSizeAndTier if only a count was returned
      let followerSizeAndTier = data.FollowerSizeAndTier || "";
      if (!followerSizeAndTier && data.FollowerCount) {
        const n = Number(data.FollowerCount);
        if (!isNaN(n) && n > 0) followerSizeAndTier = `${n} (${followerTier(n)})`;
      }

      setFormData((prev) => ({
        ...prev,
        ...data,
        // make sure array-looking fields are arrays in state so inputs render correctly
        SocialMediaPlatformLinks: toArr(data.SocialMediaPlatformLinks ?? prev.SocialMediaPlatformLinks),
        InternalNotes: toArr(data.InternalNotes ?? prev.InternalNotes),
        NameofPastProjects: toArr(data.NameofPastProjects ?? prev.NameofPastProjects),
        DeliverablesforPastProjects: toArr(data.DeliverablesforPastProjects ?? prev.DeliverablesforPastProjects),
        PostLinksofAVCPastProjects: toArr(data.PostLinksofAVCPastProjects ?? prev.PostLinksofAVCPastProjects),
        OtherBrandsWorkedWith: toArr(data.OtherBrandsWorkedWith ?? prev.OtherBrandsWorkedWith),
        ContentSampleLinks: toArr(data.ContentSampleLinks ?? prev.ContentSampleLinks),
        FollowerSizeAndTier: followerSizeAndTier || prev.FollowerSizeAndTier,
      }));

      showPopup("Auto-filled from file ✔️", "success");
    } catch (err) {
      console.error("Autofill upload error:", err);
      showPopup(`Couldn’t auto-fill from file. ${err.message || ""}`, "error");
    } finally {
      setIsAutoFillLoading(false);
      e.target.value = ""; // allow choosing the same file again
    }
  };

  // ---------- Instagram helper (kept intact) ----------
  const autofillFromInstagram = async (username) => {
    if (!username) return;
    try {
      setIsFetchingInsta(true);
      const r = await fetch(
        `${API_BASE_URL}/admin/fetchInstagram/${encodeURIComponent(username)}`
      );
      if (!r.ok) throw new Error("Instagram fetch failed");
      const ig = await r.json();

      const followers = Number(ig?.followers ?? 0);
      const tier = followerTier(followers);
      const followerLabel = followers ? `${followers} (${tier})` : "";
      const name = ig?.full_name || formData.Name || "";
      const bio = ig?.biography || "";

      setFormData((prev) => ({
        ...prev,
        Name: prev.Name || name,
        FollowerSizeAndTier: followerLabel || prev.FollowerSizeAndTier
      }));

      setIsGeneratingAI(true);
      const a = await fetch(`${API_BASE_URL}/ai/describe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          bio,
          language: formData.Language,
          niches: formData.ContentNiche
        })
      });
      if (a.ok) {
        const { description } = await a.json();
        if (description) {
          setFormData((prev) => ({ ...prev, ProfileDescription: description }));
        }
      }
    } catch (e) {
      console.error("Auto-fill IG error:", e);
    } finally {
      setIsFetchingInsta(false);
      setIsGeneratingAI(false);
    }
  };

  const handleUsernameBlur = (e) => {
    const u = e.target.value?.trim();
    if (u) autofillFromInstagram(u);
  };

  // Prevent Enter from submitting form unless inside a textarea
  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      const tag = e.target.tagName?.toLowerCase();
      if (tag !== "textarea") e.preventDefault();
    }
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // merge any manual edits + auto-filled values, then normalize
      const normalized = normalizeForSubmit(formData);

      // Build FormData (arrays as key[index])
      const fd = new FormData();
      Object.entries(normalized).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, i) => fd.append(`${key}[${i}]`, item));
        } else {
          fd.append(key, value ?? "");
        }
      });

      // attach Photo if present and is a File
      if (formData.Photo && formData.Photo instanceof File) {
        fd.set("Photo", formData.Photo); // overwrite string if any
      }

      // Try preferred path, then alias
      const urls = [
        `${API_BASE_URL}/admin/influencerForm`,
        `${API_BASE_URL}/influencerForm`,
      ];
      let res, errText = "";
      for (const url of urls) {
        res = await fetch(url, { method: "POST", body: fd });
        if (res.status === 404) { errText = await res.text(); continue; }
        break;
      }

      if (!res || !res.ok) {
        const txt = (res && (await res.text())) || errText || "Submit failed";
        throw new Error(txt);
      }

      showPopup("Influencer data submitted successfully!", "success");
      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      console.error("Submit error:", error);
      showPopup(`Failed to submit data. ${error.message || ""}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- render ----------
  const busy = isAutoFillLoading || isFetchingInsta || isGeneratingAI || isSubmitting;

  return (
    <div className="form-container">
      <h2>Influencer Data Form</h2>

      {/* Auto-fill from file */}
      <div className="autofill-box">
        <label><strong>Auto-fill from file:</strong></label>
        <p>Upload any PDF / Word / Excel / PowerPoint / Image. We’ll extract and fill the fields automatically.</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
          onChange={handleAutofillFromFile}
          disabled={busy}
        />
        {isAutoFillLoading && <div className="inline-loader">Extracting with AI…</div>}
      </div>

      <form onSubmit={handleSubmit} onKeyDownCapture={handleFormKeyDown}>
        <label>Photo:</label>
        <input type="file" name="Photo" accept=".jpg,.jpeg,.png" onChange={handleFileChange} disabled={busy} />
        {imageError && <p className="error-message">{imageError}</p>}

        <label>Legal Name:</label>
        <p>Indicate the real name of the influencer here as it would appear in the contract and vendor form</p>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} disabled={busy} />

        <label>Username:</label>
        <p>If the influencer has different usernames per platform, just input the one most used here</p>
        <input
          type="text"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          onBlur={handleUsernameBlur}
          disabled={busy}
        />
        {(isFetchingInsta || isGeneratingAI) && (
          <div className="inline-loader">Auto-filling from Instagram & AI…</div>
        )}

        <label>GeoLocation:</label>
        <input type="text" name="GeoLocation" value={formData.GeoLocation} onChange={handleChange} disabled={busy} />

        <label>Ethnicity:</label>
        <input type="text" name="Ethnicity" value={formData.Ethnicity} onChange={handleChange} disabled={busy} />

        <label>Religion:</label>
        <input type="text" name="Religion" value={formData.Religion} onChange={handleChange} disabled={busy} />

        <label>Language:</label>
        <input type="text" name="Language" value={formData.Language} onChange={handleChange} disabled={busy} />

        <label>Follower Size &amp; Tier:</label>
        <input type="text" name="FollowerSizeAndTier" value={formData.FollowerSizeAndTier} onChange={handleChange} disabled={busy} />

        <label>Engagement Rate:</label>
        <input type="text" name="EngagementRate" value={formData.EngagementRate} onChange={handleChange} disabled={busy} />

        <label>Follower Data:</label>
        <textarea name="FollowerData" value={formData.FollowerData} onChange={handleChange} disabled={busy} />

        <label>Profile Description:</label>
        <textarea name="ProfileDescription" value={formData.ProfileDescription} onChange={handleChange} disabled={busy} />

        <label>Social Media Links (comma-separated):</label>
        <input
          type="text"
          name="SocialMediaPlatformLinks"
          value={csv(formData.SocialMediaPlatformLinks)}
          onChange={(e) => handleArrayChange(e, "SocialMediaPlatformLinks")}
          disabled={busy}
        />

        <label>Cost Range:</label>
        <input type="text" name="CostRange" value={formData.CostRange} onChange={handleChange} disabled={busy} />

        <label>Content Niches:</label>
        <input type="text" name="ContentNiche" value={formData.ContentNiche} onChange={handleChange} disabled={busy} />

        <label>Agency or Handler Name:</label>
        <input type="text" name="AgencyorHandlerName" value={formData.AgencyorHandlerName} onChange={handleChange} disabled={busy} />

        <label>Email Address:</label>
        <input type="email" name="EmailAddress" value={formData.EmailAddress} onChange={handleChange} disabled={busy} />

        <label>Phone Number:</label>
        <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} disabled={busy} />

        <label>Internal Notes (comma-separated):</label>
        <input
          type="text"
          name="InternalNotes"
          value={csv(formData.InternalNotes)}
          onChange={(e) => handleArrayChange(e, "InternalNotes")}
          disabled={busy}
        />

        <label>CampaignNumber:</label>
        <input type="text" name="CampaignNumber" value={formData.CampaignNumber} onChange={handleChange} disabled={busy} />

        <label>NameofPastProjects (comma-separated):</label>
        <input
          type="text"
          name="NameofPastProjects"
          value={csv(formData.NameofPastProjects)}
          onChange={(e) => handleArrayChange(e, "NameofPastProjects")}
          disabled={busy}
        />

        <label>AVCBookedRate:</label>
        <input type="text" name="AVCBookedRate" value={formData.AVCBookedRate} onChange={handleChange} disabled={busy} />

        <label>DeliverablesforPastProjects (comma-separated):</label>
        <input
          type="text"
          name="DeliverablesforPastProjects"
          value={csv(formData.DeliverablesforPastProjects)}
          onChange={(e) => handleArrayChange(e, "DeliverablesforPastProjects")}
          disabled={busy}
        />

        <label>MonthofAVCPastProjects:</label>
        <input type="text" name="MonthofAVCPastProjects" value={formData.MonthofAVCPastProjects} onChange={handleChange} disabled={busy} />

        <label>YearofAVCPastProjects:</label>
        <input type="text" name="YearofAVCPastProjects" value={formData.YearofAVCPastProjects} onChange={handleChange} disabled={busy} />

        <label>PostLinksofAVCPastProjects (comma-separated):</label>
        <input
          type="text"
          name="PostLinksofAVCPastProjects"
          value={csv(formData.PostLinksofAVCPastProjects)}
          onChange={(e) => handleArrayChange(e, "PostLinksofAVCPastProjects")}
          disabled={busy}
        />

        <label>SharedDrivePath:</label>
        <input type="text" name="SharedDrivePath" value={formData.SharedDrivePath} onChange={handleChange} disabled={busy} />

        <label>OtherBrandsWorkedWith (comma-separated):</label>
        <input
          type="text"
          name="OtherBrandsWorkedWith"
          value={csv(formData.OtherBrandsWorkedWith)}
          onChange={(e) => handleArrayChange(e, "OtherBrandsWorkedWith")}
          disabled={busy}
        />

        <label>ContentSampleLinks (comma-separated):</label>
        <input
          type="text"
          name="ContentSampleLinks"
          value={csv(formData.ContentSampleLinks)}
          onChange={(e) => handleArrayChange(e, "ContentSampleLinks")}
          disabled={busy}
        />

        <button type="submit" disabled={busy}>Submit</button>
      </form>

      {popupMessage && <div className={`popup-box ${popupType}`}>{popupMessage}</div>}
    </div>
  );
};

export default InfluencerForm;
