import React, { useState, useEffect } from "react";
import "./InfluencerCard.css";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../apiconfig";

const InfluencerCard = () => {
  const navigate = useNavigate();

  const [influencers, setInfluencers] = useState([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [nameSearch, setNameSearch] = useState('');
  const [geoLocationSearch, setGeoLocationSearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
  const [contentNicheSearch, setContentNicheSearch] = useState('');
  const [religionSearch, setReligionSearch] = useState('');

  const [followerSizes, setFollowerSizes] = useState([]);
  const [selectedFollowerSize, setSelectedFollowerSize] = useState('');

  const [engagementRates, setEngagementRates] = useState([]);
  const [selectedEngagementRate, setSelectedEngagementRate] = useState('');

  const [filterCosts, setFilterCosts] = useState([]);
  const [selectedFilterCost, setSelectedFilterCost] = useState('');

  // Fetch influencers
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/allInfluencer`);
        if (!response.ok) throw new Error("Failed to fetch influencers");
        const data = await response.json();
        setInfluencers(data);
        setFilteredInfluencers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  // Fetch dropdown filter values
  useEffect(() => {
    const fetchFollowerSizes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/followersizes`);
        if (!response.ok) throw new Error("Failed to fetch follower sizes");
        const data = await response.json();
        setFollowerSizes(data);
      } catch (error) {
        console.error("Error fetching follower sizes:", error.message);
      }
    };

    const fetchEngagementRates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/engagementRates`);
        if (!response.ok) throw new Error("Failed to fetch engagement rates");
        const data = await response.json();
        setEngagementRates(data);
      } catch (error) {
        console.error("Error fetching engagement rates:", error.message);
      }
    };

    const fetchFilterCosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/filtercosts`);
        if (!response.ok) throw new Error("Failed to fetch filter costs");
        const data = await response.json();
        setFilterCosts(data);
      } catch (error) {
        console.error("Error fetching filter costs:", error.message);
      }
    };

    fetchFollowerSizes();
    fetchEngagementRates();
    fetchFilterCosts();
  }, []);

  // Filtering Logic
  useEffect(() => {
    const filtered = influencers.filter((influencer) => {
      const nameMatch = influencer.Name?.toLowerCase().includes(nameSearch.toLowerCase());
      const geoMatch = influencer.GeoLocation?.toLowerCase().includes(geoLocationSearch.toLowerCase());
      const languageMatch = influencer.Language?.toLowerCase().includes(languageSearch.toLowerCase());
      const nicheMatch = influencer.ContentNiche?.toLowerCase().includes(contentNicheSearch.toLowerCase());
      const religionMatch = influencer.Religion?.toLowerCase().includes(religionSearch.toLowerCase());
      const followerSizeMatch = selectedFollowerSize === '' || influencer.FollowerSize === selectedFollowerSize;
      const engagementRateMatch = selectedEngagementRate === '' || influencer.EngagementRate === selectedEngagementRate;
      const costMatch = selectedFilterCost === '' || influencer.Cost === selectedFilterCost;

      return (
        nameMatch &&
        geoMatch &&
        languageMatch &&
        nicheMatch &&
        religionMatch &&
        followerSizeMatch &&
        engagementRateMatch &&
        costMatch
      );
    });

    setFilteredInfluencers(filtered);
  }, [
    nameSearch,
    geoLocationSearch,
    languageSearch,
    contentNicheSearch,
    religionSearch,
    selectedFollowerSize,
    selectedEngagementRate,
    selectedFilterCost,
    influencers
  ]);

  if (loading) return <p className="loading-message">Loading influencers...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <div className="header">
        <button className="add-btn" onClick={() => navigate('/InfluencerForm')}>
          + Add Influencer
        </button>
      </div>

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
          value={geoLocationSearch}
          onChange={(e) => setGeoLocationSearch(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by Language"
          value={languageSearch}
          onChange={(e) => setLanguageSearch(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by Content Niche"
          value={contentNicheSearch}
          onChange={(e) => setContentNicheSearch(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by Religion"
          value={religionSearch}
          onChange={(e) => setReligionSearch(e.target.value)}
          className="search-input"
        />

        {/* Dropdown Filters */}
        <select
          value={selectedFollowerSize}
          onChange={(e) => setSelectedFollowerSize(e.target.value)}
          className="search-input"
        >
          <option value="">All Follower Sizes</option>
          {followerSizes.map((size) => (
            <option key={size._id} value={size.type}>
              {size.type}
            </option>
          ))}
        </select>

        <select
          value={selectedEngagementRate}
          onChange={(e) => setSelectedEngagementRate(e.target.value)}
          className="search-input"
        >
          <option value="">All Engagement Rates</option>
          {engagementRates.map((rate) => (
            <option key={rate._id} value={rate.rate}>
              {rate.rate}
            </option>
          ))}
        </select>

        <select
          value={selectedFilterCost}
          onChange={(e) => setSelectedFilterCost(e.target.value)}
          className="search-input"
        >
          <option value="">All Costs</option>
          {filterCosts.map((cost) => (
            <option key={cost._id} value={cost.cost}>
              {cost.cost}
            </option>
          ))}
        </select>
      </div>

      {/* Influencer Cards */}
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
              <p className="language">{influencer.Language}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerCard;
