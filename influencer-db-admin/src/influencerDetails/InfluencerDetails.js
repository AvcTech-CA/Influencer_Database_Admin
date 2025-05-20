import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./influencerDetails.css";
import htmlDocx from "html-docx-js/dist/html-docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InfluencerDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef();
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

  const exportToWord = () => {
    const content = contentRef.current.innerHTML;
    const converted = htmlDocx.asBlob(`<html><body>${content}</body></html>`);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = `${influencer.Name}-Details.docx`;
    link.click();
  };

  const exportToPDF = () => {
    html2canvas(contentRef.current).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${influencer.Name}-Details.pdf`);
    });
  };

  return (
    <div className="container">
      <button className="add-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="export-buttons">
        <button className="add-btn" onClick={exportToWord}>Export to Word</button>
        <button className="add-btn" onClick={exportToPDF}>Export to PDF</button>
      </div>

      <div className="details-card" ref={contentRef}>
        <img
          src={`data:image/png;base64,${influencer.Photo}`}
          alt="Influencer"
          className="details-img"
        />
        <div className="details-info">
          <button>Add this Influencer</button>
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
          <p><strong>SocialMediaPlatformLinks:</strong>
            <ul>
              {Array.isArray(influencer.SocialMediaPlatformLinks) &&
                influencer.SocialMediaPlatformLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
            </ul>
          </p>
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
