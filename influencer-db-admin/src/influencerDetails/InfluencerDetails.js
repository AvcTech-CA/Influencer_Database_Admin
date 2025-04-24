// InfluencerDetails.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./influencerDetails.css";
import API_BASE_URL from "../apiconfig";

const InfluencerDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const influencer = state?.influencer;

  if (!influencer) {
    return (
      <div className="container">
        <h2>Influencer Not Found</h2>
        <p>No influencer data available. Please go back and select one.</p>
        <button className="add-btn" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="add-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="details-card">
  <img
    src={`data:image/png;base64,${influencer.Photo}`}
    alt="Influencer"
    className="details-img"
  />
  <div className="details-info">
    <h2>{influencer.Name}</h2>
    <p><strong>Username:</strong> @{influencer.Username}</p>
    <p><strong>Location:</strong> {influencer.GeoLocation}</p>
    <p><strong>Ethnicity:</strong> {influencer.Ethnicity}</p>
    <p><strong>Religion:</strong> {influencer.Religion}</p>
    <p><strong>Language:</strong> {influencer.Language}</p>
    <p><strong>FollowerSizeAndTier:</strong> {influencer.FollowerSizeAndTier}</p>
    <p><strong>EngagementRate:</strong> {influencer.EngagementRate}</p>
    <p><strong>FollowerData:</strong> {influencer.FollowerData}</p>
    <p><strong>ProfileDescription:</strong> {influencer.ProfileDescription}</p>
    <p><strong>SocialMediaPlatformLinks:</strong> {influencer.SocialMediaPlatformLinks}</p>
    <p><strong>CostRange:</strong> {influencer.CostRange}</p>
    <p><strong>ContentNiche:</strong> {influencer.ContentNiche}</p>
    <p><strong>AgencyorHandlerName:</strong> {influencer.AgencyorHandlerName}</p>
    <p><strong>EmailAddress:</strong> {influencer.EmailAddress}</p>
    <p><strong>HomeAddress:</strong> {influencer.HomeAddress}</p>
    <p><strong>PhoneNumber:</strong> {influencer.PhoneNumber}</p>
    <p><strong>InternalNotes:</strong> {influencer.InternalNotes}</p>
    <p><strong>CampaignNumber:</strong> {influencer.CampaignNumber}</p>
    <p><strong>NameofPastProjects:</strong> {influencer.NameofPastProjects}</p>
    <p><strong>AVCBookedRate:</strong> {influencer.AVCBookedRate}</p>
    <p><strong>DeliverablesforPastProjects:</strong> {influencer.DeliverablesforPastProjects}</p>
    <p><strong>MonthofAVCPastProjects:</strong> {influencer.MonthofAVCPastProjects}</p>
    <p><strong>YearofAVCPastProjects:</strong> {influencer.YearofAVCPastProjects}</p>
    <p><strong>PostLinksofAVCPastProjects:</strong> {influencer.PostLinksofAVCPastProjects}</p>
    <p><strong>SharedDrivePath:</strong> {influencer.SharedDrivePath}</p>
    <p><strong>OtherBrandsWorkedWith:</strong> {influencer.OtherBrandsWorkedWith}</p>
    <p><strong>ContentSampleLinks:</strong> {influencer.ContentSampleLinks}</p>
  </div>
</div>
    </div>
  );
};

export default InfluencerDetails;
