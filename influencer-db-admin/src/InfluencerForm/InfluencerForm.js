import React, { useState } from "react";
import "./InfluencerForm.css";
import { useNavigate } from "react-router-dom"; // Import navigate
import API_BASE_URL from "../apiconfig";

const InfluencerForm = () => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // 'success' or 'error'
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
    PostLinksofAVCPastProjects: "",
    SharedDrivePath: "",
    OtherBrandsWorkedWith: [],
    ContentSampleLinks: []
    

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value.split(",") });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setImageError("Invalid file format. Please upload JPEG, PNG, or jpg.");
        setFormData({ ...formData, Photo: "" });
      } else {
        setImageError("");
        setFormData({ ...formData, Photo: file });
      }
    }
  };

  const showPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => {
      setPopupMessage("");
      if (type === "success") {
        navigate("/home");
      }
    }, 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => {
          formDataToSend.append(`${key}[${index}]`, item);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/influencerForm`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        showPopup("Influencer data submitted successfully!", "success");
      } else {
        showPopup("Failed to submit data.", "error");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      showPopup("An error occurred while submitting the form.", "error");
    }
  };

  return (
    <div className="form-container">
      <h2>Influencer Data Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Photo:</label>
        <input type="file" name="Photo" onChange={handleFileChange} />
        {imageError && <p className="error-message">{imageError}</p>}
        <label>Legal Name:</label>
        <p>Indicate the real name of the influencer here as it would appear in the contract and vendor form</p>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} />

        <label>Username:</label>
        <p>If the influencer has different usernames per platform, just input the one most used here</p>
        <input type="text" name="Username" value={formData.Username} onChange={handleChange} />

        <label>GeoLocation:</label>
        <p>Indicate only the current location of the influencer, both city (if known) and country</p>
        <input type="text" name="GeoLocation" value={formData.GeoLocation} onChange={handleChange} />

        <label>Ethnicity:</label>
        <p>Indicate all ethnicities of the influencer</p>
        <input type="text" name="Ethnicity" value={formData.Ethnicity} onChange={handleChange} />

        <label>Religion:</label>
        <p>Optional only for non- religion-specific briefs</p>
        <input type="text" name="Religion" value={formData.Religion} onChange={handleChange} />

        <label>Language:</label>
        <p>Include English and indicate all other languages used by the influencer in their content</p>
        <input type="text" name="Language" value={formData.Language} onChange={handleChange} />

        <label>Follower Size & Tier:</label>
        <p> Indicate the biggest follower size the influencer currently has; provide the exact number</p>
        <input type="text" name="FollowerSizeAndTier" value={formData.FollowerSizeAndTier} onChange={handleChange} />

        <label>Engagement Rate:</label>
        <p>Indicate the highest engagement rate the influencer currently has</p>
        <input type="text" name="EngagementRate" value={formData.EngagementRate} onChange={handleChange} />

        <label>Follower Data:</label>
        <p>Indicate the % split of their female and male followers for one platform (preferably Instagram) and the top age range</p>
        <textarea name="FollowerData" value={formData.FollowerData} onChange={handleChange} />

        <label>Profile Description:</label>
        <p>Provide a 1–2-line profile summary or description for the influencer</p>
        <textarea name="ProfileDescription" value={formData.ProfileDescription} onChange={handleChange} />

        <label>Social Media Links (comma-separated):</label>
        <p>Include all available social media links of the influencer, including their website if applicable</p>
        <input type="text" name="SocialMediaPlatformLinks" onChange={(e) => handleArrayChange(e, "SocialMediaPlatformLinks")} />

        <label>Cost Range:</label>
        <p>Indicate the minimum amount they charge for any type of organic posting or engagement, including the currency</p>
        <input type="text" name="CostRange" value={formData.CostRange} onChange={handleChange} />

        <label>Content Niches:</label>
        <p>Include at least three content niches eg. beauty, fashion, and travel</p>
        <input type="text" name="ContentNiche" value={formData.ContentNiche} onChange={handleChange} />

        <label>Agency or Handler Name:</label>
        <p>Indicate the agency name if the influencer is managed by an agency; if otherwise, leave blank</p>
        <input type="text" name="AgencyorHandlerName" value={formData.AgencyorHandlerName} onChange={handleChange} />

        <label>Email Address:</label>
        <p>Include all email addresses to contact the influencer eg. direct email and manager’s</p>
        <input type="email" name="EmailAddress" value={formData.EmailAddress} onChange={handleChange} />

        <label>Phone Number:</label>
        <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} />

        <label>Internal Notes (comma-separated):</label>
        <p>Indicate any internal remarks here</p>
        <input type="text" name="InternalNotes" onChange={(e) => handleArrayChange(e, "InternalNotes")} />

        <label>CampaignNumber:</label>
        <input type="text" name="CampaignNumber" value={formData.CampaignNumber} onChange={handleChange} />

        <label>NameofPastProjects (comma-separated):</label>
        <p>Indicate the campaign number/s of the past confirmed projects of the influencer</p>
        <input type="text" name="NameofPastProjects" onChange={(e) => handleArrayChange(e, "NameofPastProjects")} />

        <label>AVCBookedRate:</label>
        <input type="text" name="AVCBookedRate" value={formData.AVCBookedRate} onChange={handleChange} />

        <label>DeliverablesforPastProjects:</label>
        <input type="text" name="DeliverablesforPastProjects" value={formData.DeliverablesforPastProjects} onChange={handleChange} />

        <label>MonthofAVCPastProjects:</label>
        <input type="text" name="MonthofAVCPastProjects" value={formData.MonthofAVCPastProjects} onChange={handleChange} />

        <label>YearofAVCPastProjects:</label>
        <input type="text" name="YearofAVCPastProjects" value={formData.YearofAVCPastProjects} onChange={handleChange} />

        <label>PostLinksofAVCPastProjects:</label>
        <input type="text" name="PostLinksofAVCPastProjects" value={formData.PostLinksofAVCPastProjects} onChange={handleChange} />

        <label>SharedDrivePath:</label>
        <p>Indicate the Sharedrive live to the influencer performance data here and POE files here; if multiple, please indicate all</p>
        <input type="text" name="SharedDrivePath" value={formData.SharedDrivePath} onChange={handleChange} />

        <label>OtherBrandsWorkedWith: (comma-separated):</label>
        <input type="text" name="OtherBrandsWorkedWith" onChange={(e) => handleArrayChange(e, "OtherBrandsWorkedWith")} />

        <label>ContentSampleLinks: (comma-separated):</label>
        <p>Include at least 3 links of sample content of the influencer, showcasing their content topics and niches</p>
        <input type="text" name="ContentSampleLinks" onChange={(e) => handleArrayChange(e, "ContentSampleLinks")} />

        <button type="submit">Submit</button>
      </form>


      {popupMessage && (
        <div className={`popup-box ${popupType}`}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default InfluencerForm;
