import React, { useState, useEffect } from "react";
import "./InfluencerCard.css"; // Import external CSS

const InfluencerCard = () => {
  const [influencers, setInfluencers] = useState([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch influencers from API
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/allInfluencer");
        if (!response.ok) throw new Error("Failed to fetch influencers");
        const data = await response.json();
        console.log(data)
        setInfluencers(data); // Assuming the API returns an array of influencers
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading influencers...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="influencer-container">
      {influencers.map((influencer, index) => (
        <div
          key={index}
          className="influencer-card"
          onClick={() => setSelectedInfluencer(influencer)}
        >
          <img src={`data:image/png;base64,${influencer.Photo}`} alt="Influencer" />
          <div className="influencer-card-content">
            <h2 className="influencer-name">{influencer.Name}</h2>
            <p className="influencer-username">@{influencer.Username}</p>
            <p className="influencer-location">{influencer.GeoLocation}</p>
          </div>
        </div>
      ))}

      {/* Popup Modal */}
      {selectedInfluencer && (
        <div className="modal-overlay">
          <div className="modal-content">
          <img src={`data:image/png;base64,${selectedInfluencer.Photo}`} alt="Influencer" />
            <h2>{selectedInfluencer.Name}</h2>
            <p>@{selectedInfluencer.Username}</p>
            <p>{selectedInfluencer.GeoLocation}</p>
            <button className="close-btn" onClick={() => setSelectedInfluencer(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerCard;
