import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch listings
        const listingsResponse = await fetch(apiUrl);
        const listingsData = await listingsResponse.json();
        if (listingsResponse.ok) {
          setListings(listingsData);
          setFilteredListings(listingsData);
        } else {
          console.error("Failed to fetch listings:", listingsData);
        }

        // Fetch categories
        const categoriesResponse = await fetch(`${apiUrl}/categories`);
        const categoriesData = await categoriesResponse.json();
        if (categoriesResponse.ok) {
          setCategories(categoriesData);
        } else {
          console.error("Failed to fetch categories:", categoriesData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Filter listings based on search and category
  useEffect(() => {
    let filtered = listings;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (listing) => listing.CategoryName === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.Location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [searchTerm, selectedCategory, listings]);

  if (listings.length === 0) return <p className="loading-text">Loading listings...</p>;

  // Build category list: "All" + categories from database
  const categoryList = ["All", ...categories.map((cat) => cat.Name)];

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
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categoryList.map((category) => (
                    <li key={category}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(category);
                        }}
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="d-flex">
              <input
                className="form-control"
                type="search"
                placeholder="Search events..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container text-center">
        <h1 className="mb-4">
          {selectedCategory === "All" ? "Upcoming Events" : `${selectedCategory} Events`}
        </h1>
        {filteredListings.length === 0 ? (
          <p>No events found matching your search.</p>
        ) : (
          <div className="row justify-content-center">
            {filteredListings.map((listing) => (
              <div key={listing.ListingID} className="col-md-4 col-lg-3 mb-3">
                <div className="card">
                  <img
                    src={`https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`}
                    alt={listing.Title}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{listing.Title}</h5>
                    <p className="card-text">{listing.Description}</p>
                    <p className="card-text">
                      <small className="text-muted">{listing.Location}</small>
                      <br />
                      <small className="text-muted">
                        {new Date(listing.ListingDate).toLocaleDateString()}
                      </small>
                    </p>
                    <Link
                      to={`/details/${listing.ListingID}`}
                      className="btn btn-primary mt-auto"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;