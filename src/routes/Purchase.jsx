// src/routes/Purchase.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Purchase() {
  const { id } = useParams(); // listing id
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

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
      const res = await fetch(import.meta.env.VITE_API_URL + "/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BuyerName: buyerName,
          BuyerEmail: buyerEmail,
          Quantity: quantity,
          ListingId: id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Purchase successful!");
      } else {
        setMessage(data.message || "Error making purchase.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error making purchase.");
    }
  };

  if (!listing) return <p>Loading listing...</p>;

  const imageUrl = listing.PhotoFileName
    ? `https://nscc0511519inet.blob.core.windows.net/uploads/${listing.PhotoFileName}`
    : "";

  return (
    <div>
      <h1>Buy Tickets for {listing.Title}</h1>
      {imageUrl && <img src={imageUrl} alt={listing.Title} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity: </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <button type="submit">Submit Purchase</button>
      </form>
      <button onClick={() => navigate(-1)}>Go Back</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Purchase;