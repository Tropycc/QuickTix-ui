import { useParams, useNavigate, Link } from "react-router-dom";
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
        console.log("Listing data:", data);
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [id]);

  if (!listing) return <p className="loading-text">Loading listing...</p>;

  const imageUrl = listing.PhotoFileName
    ? `https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`
    : "";

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            QuickTix
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={listing.Title}
                  className="card-img-top details-img"
                />
              )}
              <div className="card-body">
                <h1 className="card-title mb-3">{listing.Title}</h1>
                <p className="card-text mb-3" style={{ fontSize: '1.1rem' }}>
                  {listing.Description}
                </p>
                <p className="card-text">
                  <strong>Category:</strong> {listing.Category}
                </p>
                <p className="card-text">
                  <strong>Location:</strong> {listing.Location}
                </p>
                <p className="card-text">
                  <strong>Date:</strong> {new Date(listing.ListingDate).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/purchase/${listing.ListingID}`)}
                    className="btn btn-primary me-2"
                  >
                    Buy Tickets
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;