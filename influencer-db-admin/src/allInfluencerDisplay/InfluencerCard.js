import React, { useState, useEffect } from "react";
import "./InfluencerCard.css";
import { useNavigate } from 'react-router-dom';
import InfluencerDetails from "../influencerDetails/InfluencerDetails";

const InfluencerCard = () => {
  const navigate = useNavigate();
  const [influencers, setInfluencers] = useState([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nameSearch, setNameSearch] = useState('');
  const [GeoLocationSearch, setUsernameSearch] = useState('');

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/allInfluencer");
        if (!response.ok) throw new Error("Failed to fetch influencers");
        const data = await response.json();
        setInfluencers(data);
        setFilteredInfluencers(data); // initially all
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  useEffect(() => {
    const filtered = influencers.filter((influencer) =>
      influencer.Name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      influencer.GeoLocation.toLowerCase().includes(GeoLocationSearch.toLowerCase())
    );
    setFilteredInfluencers(filtered);
  }, [nameSearch, GeoLocationSearch, influencers]);

  if (loading) return <p className="loading-message">Loading influencers...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <div className="header">
        <button className="add-btn" onClick={() => navigate('/InfluencerForm')}>
          + Add Influencer
        </button>
      </div>

      {/* Search Fields */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by Geolocation"
          value={GeoLocationSearch}
          onChange={(e) => setUsernameSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="influencer-grid">
        {filteredInfluencers.map((influencer, index) => (
          <div
            key={index}
            className="influencer-card"
            onClick={() => navigate('/influencerDetails', { state: { influencer } })}
          >
            <img
              src={`data:image/png;base64,${influencer.Photo}`}
              alt="Influencer"
              className="influencer-img"
            />
            <div className="influencer-info">
              <h2>{influencer.Name}</h2>
              <p>@{influencer.Username}</p>
              <p className="location">{influencer.GeoLocation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerCard;
