import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Purchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL + `/${id}`;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  
      const cardNumber = creditCardNumber.replace(/\s/g, "");
      const expiration = expirationDate.replace(/\//g, "");

      const res = await fetch(import.meta.env.VITE_API_URL + "/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BuyerName: buyerName,
          BuyerEmail: buyerEmail,
          Quantity: quantity,
          ListingId: id,
          CreditCardNumber: cardNumber,
          ExpirationDate: expiration,
          CVV: cvv,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPurchaseData({
          buyerName,
          buyerEmail,
          quantity,
          listingTitle: listing.Title,
          creditCardNumber: `**** **** **** ${creditCardNumber.slice(-4)}`,
          expirationDate,
        });
        setPurchaseConfirmed(true);
      } else {
        setMessage(data.message || "Error making purchase.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error making purchase.");
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCreditCardNumber(formatted);
    }
  };

  const formatExpiration = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleExpirationChange = (e) => {
    const formatted = formatExpiration(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setExpirationDate(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  if (!listing) return <p className="loading-text">Loading listing...</p>;

  const imageUrl = listing.PhotoFileName
    ? `https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`
    : "";

  if (purchaseConfirmed && purchaseData) {
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
        {/* Confirmation Content */}
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <svg
                      className="text-success"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                  </div>
                  
                  <h1 className="card-title mb-4">Purchase Confirmed!</h1>
                  
                  <div className="text-start">
                    <h5 className="mb-3">Order Details:</h5>
                    <div className="mb-2">
                      <strong>Event:</strong> {purchaseData.listingTitle}
                    </div>
                    <div className="mb-2">
                      <strong>Name:</strong> {purchaseData.buyerName}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {purchaseData.buyerEmail}
                    </div>
                    <div className="mb-2">
                      <strong>Quantity:</strong> {purchaseData.quantity} ticket(s)
                    </div>
                    <div className="mb-2">
                      <strong>Card:</strong> {purchaseData.creditCardNumber}
                    </div>
                    <div className="mb-4">
                      <strong>Expiration:</strong> {purchaseData.expirationDate}
                    </div>
                  </div>
                  
                  <p className="text-muted mb-4">
                    A confirmation email has been sent to {purchaseData.buyerEmail}
                  </p>
                  
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-primary btn-lg"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Purchase Form Page
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
          <div className="col-lg-6">
            <div className="card">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={listing.Title}
                  className="card-img-top purchase-img"
                />
              )}
              <div className="card-body">
                <h1 className="card-title mb-4">
                  Buy Tickets for {listing.Title}
                </h1>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Quantity:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      required
                    />
                  </div>

                  <hr className="my-4" />
                  <h5 className="mb-3">Payment Information</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Credit Card Number:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={creditCardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expiration Date:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={expirationDate}
                        onChange={handleExpirationChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CVV:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="btn btn-primary me-2">
                    Submit Purchase
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary"
                  >
                    Go Back
                  </button>
                </form>
                
                {message && (
                  <div
                    className={`alert ${
                      message.includes('successful') ? 'alert-success' : 'alert-danger'
                    } mt-3`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchase;