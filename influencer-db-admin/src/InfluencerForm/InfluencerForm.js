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
    ContentSampleLinks: [],
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
        navigate("/influencer");
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
        <label>Name:</label>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} />

        <label>Username:</label>
        <input type="text" name="Username" value={formData.Username} onChange={handleChange} />

        <label>GeoLocation:</label>
        <input type="text" name="GeoLocation" value={formData.GeoLocation} onChange={handleChange} />

        <label>Ethnicity:</label>
        <input type="text" name="Ethnicity" value={formData.Ethnicity} onChange={handleChange} />

        <label>Religion:</label>
        <input type="text" name="Religion" value={formData.Religion} onChange={handleChange} />

        <label>Language:</label>
        <input type="text" name="Language" value={formData.Language} onChange={handleChange} />

        <label>Follower Size & Tier:</label>
        <input type="text" name="FollowerSizeAndTier" value={formData.FollowerSizeAndTier} onChange={handleChange} />

        <label>Engagement Rate:</label>
        <input type="text" name="EngagementRate" value={formData.EngagementRate} onChange={handleChange} />

        <label>Follower Data:</label>
        <textarea name="FollowerData" value={formData.FollowerData} onChange={handleChange} />

        <label>Profile Description:</label>
        <textarea name="ProfileDescription" value={formData.ProfileDescription} onChange={handleChange} />

        <label>Social Media Links (comma-separated):</label>
        <input type="text" name="SocialMediaPlatformLinks" onChange={(e) => handleArrayChange(e, "SocialMediaPlatformLinks")} />

        <label>Cost Range:</label>
        <input type="text" name="CostRange" value={formData.CostRange} onChange={handleChange} />

        <label>Content Niche:</label>
        <input type="text" name="ContentNiche" value={formData.ContentNiche} onChange={handleChange} />

        <label>Agency or Handler Name:</label>
        <input type="text" name="AgencyorHandlerName" value={formData.AgencyorHandlerName} onChange={handleChange} />

        <label>Email Address:</label>
        <input type="email" name="EmailAddress" value={formData.EmailAddress} onChange={handleChange} />

        <label>Phone Number:</label>
        <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} />

        <label>Internal Notes (comma-separated):</label>
        <input type="text" name="InternalNotes" onChange={(e) => handleArrayChange(e, "InternalNotes")} />

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
