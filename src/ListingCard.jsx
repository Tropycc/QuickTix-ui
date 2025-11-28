import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const blobBaseUrl = "https://nscc0511519inet.blob.core.windows.net/uploads/";
  
  return (
    <div className="listing-card" style={{ marginBottom: "1rem", cursor: "pointer" }}>
      <img
        src={`${blobBaseUrl}${listing.PhotoFileName}`}
        alt={listing.Title}
        onClick={() => navigate(`/details/${listing.ListingId}`)}
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
      />
      <h3>{listing.Title}</h3>
      <p>{listing.Location}</p>
      <p>{new Date(listing.ListingDate).toLocaleDateString()}</p>
    </div>
  );
}