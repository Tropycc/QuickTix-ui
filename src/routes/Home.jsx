import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListingCard from "../ListingCard.jsx";

function Home() {
  const [listings, setListings] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok) {
          setListings(data);
        } else {
          console.error("Failed to fetch listings:", data);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  if (listings.length === 0) return <p>Loading listings...</p>;

  return (
    <div>
      <h1>Upcoming Events</h1>
      <div className="masonry-grid">
        {listings.map((listing) => (
          <div key={listing.ListingID} className="masonry-grid-item">
            <Link to={`/details/${listing.ListingID}`}>
              <img
                src={`https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`}
                alt={listing.Title}
                className="w-100"
              />
            </Link>
            <h3>{listing.Title}</h3>
            <p>{listing.Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;