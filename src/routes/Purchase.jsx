import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function Purchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState("");
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      buyerName: "",
      buyerEmail: "",
      quantity: 1,
      creditCardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + `/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [id]);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BuyerName: formData.buyerName,
          BuyerEmail: formData.buyerEmail,
          Quantity: formData.quantity,
          ListingId: id,
          CreditCardNumber: formData.creditCardNumber.replace(/\s/g, ""),
          ExpirationDate: formData.expirationDate.replace(/\//g, ""),
          CVV: formData.cvv,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPurchaseData({
          buyerName: formData.buyerName,
          buyerEmail: formData.buyerEmail,
          quantity: formData.quantity,
          listingTitle: listing.Title,
          creditCardNumber: `**** **** **** ${formData.creditCardNumber.slice(-4)}`,
          expirationDate: formData.expirationDate,
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

  if (!listing) return <p className="loading-text">Loading listing...</p>;

  const imageUrl = listing.PhotoFileName
    ? `https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`
    : "";

  if (purchaseConfirmed && purchaseData) {
    return (
      <div className="app-container">
        <nav className="navbar navbar-expand-lg mb-3">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">QuickTix</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <svg className="text-success" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                  </div>
                  <h1 className="card-title mb-4">Purchase Confirmed!</h1>
                  <div className="text-start">
                    <h5 className="mb-3">Order Details:</h5>
                    <div className="mb-2"><strong>Event:</strong> {purchaseData.listingTitle}</div>
                    <div className="mb-2"><strong>Name:</strong> {purchaseData.buyerName}</div>
                    <div className="mb-2"><strong>Email:</strong> {purchaseData.buyerEmail}</div>
                    <div className="mb-2"><strong>Quantity:</strong> {purchaseData.quantity} ticket(s)</div>
                    <div className="mb-2"><strong>Card:</strong> {purchaseData.creditCardNumber}</div>
                    <div className="mb-4"><strong>Expiration:</strong> {purchaseData.expirationDate}</div>
                  </div>
                  <p className="text-muted mb-4">A confirmation email has been sent to {purchaseData.buyerEmail}</p>
                  <button onClick={() => navigate("/")} className="btn btn-primary btn-lg">Go Home</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar navbar-expand-lg mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">QuickTix</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card">
              {imageUrl && <img src={imageUrl} alt={listing.Title} className="card-img-top purchase-img" />}
              <div className="card-body">
                <h1 className="card-title mb-4">Buy Tickets for {listing.Title}</h1>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.buyerName ? "is-invalid" : ""}`}
                      {...register("buyerName", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                    />
                    {errors.buyerName && <div className="invalid-feedback">{errors.buyerName.message}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className={`form-control ${errors.buyerEmail ? "is-invalid" : ""}`}
                      {...register("buyerEmail", {
                        required: "Email is required",
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                      })}
                    />
                    {errors.buyerEmail && <div className="invalid-feedback">{errors.buyerEmail.message}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Quantity:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: { value: 1, message: "Quantity must be at least 1" },
                        max: { value: 10, message: "Maximum 10 tickets per purchase" },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
                  </div>

                  <hr className="my-4" />
                  <h5 className="mb-3">Payment Information</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Credit Card Number:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.creditCardNumber ? "is-invalid" : ""}`}
                      placeholder="1234 5678 9012 3456"
                      {...register("creditCardNumber", {
                        required: "Credit card number is required",
                        pattern: { value: /^[\d\s]{13,19}$/, message: "Invalid card number" },
                        validate: (value) => {
                          const cleaned = value.replace(/\s/g, "");
                          return (cleaned.length >= 13 && cleaned.length <= 16) || "Card must be 13-16 digits";
                        },
                      })}
                      onInput={(e) => {
                        const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
                        const parts = v.match(/.{1,4}/g) || [];
                        e.target.value = parts.join(" ").substring(0, 19);
                      }}
                    />
                    {errors.creditCardNumber && <div className="invalid-feedback">{errors.creditCardNumber.message}</div>}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expiration Date:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.expirationDate ? "is-invalid" : ""}`}
                        placeholder="MM/YY"
                        {...register("expirationDate", {
                          required: "Expiration date is required",
                          pattern: { value: /^\d{2}\/\d{2}$/, message: "Format must be MM/YY" },
                          validate: (value) => {
                            const month = parseInt(value.slice(0, 2));
                            return (month >= 1 && month <= 12) || "Invalid month";
                          },
                        })}
                        onInput={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          if (v.length >= 2) {
                            e.target.value = v.slice(0, 2) + "/" + v.slice(2, 4);
                          } else {
                            e.target.value = v;
                          }
                        }}
                      />
                      {errors.expirationDate && <div className="invalid-feedback">{errors.expirationDate.message}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CVV:</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                        placeholder="123"
                        {...register("cvv", {
                          required: "CVV is required",
                          pattern: { value: /^\d{3,4}$/, message: "CVV must be 3-4 digits" },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
                        }}
                      />
                      {errors.cvv && <div className="invalid-feedback">{errors.cvv.message}</div>}
                    </div>
                  </div>
                  
                  <button type="submit" className="btn btn-primary me-2">Submit Purchase</button>
                  <button type="button" onClick={() => navigate(-1)} className="btn btn-outline-secondary">Go Back</button>
                </form>
                
                {message && (
                  <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
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