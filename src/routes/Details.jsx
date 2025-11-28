// src/routes/Details.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL + `/${id}`;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        console.log("Listing data:", data); // Debug log
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [id]);

  if (!listing) return <p>Loading listing...</p>;

  const imageUrl = listing.PhotoFileName
    ? `https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`
    : "";

  return (
    <div>
      <h1>{listing.Title}</h1>
      {imageUrl && <img src={imageUrl} alt={listing.Title} />}
      <p>{listing.Description}</p>
      <p>{listing.Location}</p>
      <p>{new Date(listing.ListingDate).toLocaleDateString()}</p>
      <button onClick={() => navigate(`/purchase/${listing.ListingID}`)}>
        Buy Tickets
      </button>
      <button onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>
        Go Back
      </button>
    </div>
  );
}

export default Details;