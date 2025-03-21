import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const [claimHistory, setClaimHistory] = useState([]);
  const [editCouponId, setEditCouponId] = useState(null);
  const [editCouponCode, setEditCouponCode] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchCoupons();
    fetchClaimHistory();
  }, []);

  // Fetch ALL Coupons (Both Available & Claimed)
  const fetchCoupons = async () => {
    const res = await fetch("http://localhost:5000/admin/coupons", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCoupons(data);
  };

  // Fetch User Claim History
  const fetchClaimHistory = async () => {
    const token = localStorage.getItem("adminToken"); // Get the token
    const res = await fetch("http://localhost:5000/admin/claims", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setClaimHistory(data);
  };

  // Add a Coupon to MongoDB
  const addCoupon = async () => {
    await fetch("http://localhost:5000/admin/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: newCoupon }),
    });
    setNewCoupon("");
    fetchCoupons();
  };

  // Toggle Coupon Availability
  const toggleCoupon = async (id) => {
    await fetch(`http://localhost:5000/admin/coupons/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCoupons();
  };

  // Start Editing Coupon
  const startEditing = (coupon) => {
    setEditCouponId(coupon._id);
    setEditCouponCode(coupon.code);
  };

  // Update Coupon in MongoDB
  const updateCoupon = async (id) => {
    await fetch(`http://localhost:5000/admin/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: editCouponCode }),
    });
    setEditCouponId(null);
    fetchCoupons();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Add Coupon Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Coupon Code"
          className="border p-2 mr-2"
          value={newCoupon}
          onChange={(e) => setNewCoupon(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={addCoupon}
        >
          Add Coupon
        </button>
      </div>

      {/* List of ALL Coupons (Available & Claimed) */}
      <h3 className="text-xl font-semibold mt-4">
        Coupons (Available & Claimed)
      </h3>
      <ul>
        {coupons.map((coupon) => (
          <li key={coupon._id} className="flex justify-between border-b p-2">
            {editCouponId === coupon._id ? (
              <>
                <input
                  type="text"
                  className="border p-2"
                  value={editCouponCode}
                  onChange={(e) => setEditCouponCode(e.target.value)}
                />
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => updateCoupon(coupon._id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span>
                  {coupon.code} - {coupon.claimed ? "Claimed" : "Available"}
                  {coupon.claimedBy && (
                    <span> (Claimed by: {coupon.claimedBy})</span>
                  )}
                </span>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => toggleCoupon(coupon._id)}
                >
                  {coupon.active ? "Disable" : "Enable"}
                </button>
                {!coupon.claimed && (
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => startEditing(coupon)}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Claim History from Backend */}
      <h3 className="text-xl font-semibold mt-6">User Claim History</h3>
      <ul>
        {claimHistory.map((claim, index) => (
          <li key={index} className="border-b p-2">
            <span>
              Coupon: {claim.code} | IP: {claim.claimedBy} | Date:{" "}
              {new Date(claim.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
