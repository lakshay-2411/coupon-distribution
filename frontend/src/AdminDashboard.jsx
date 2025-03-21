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
    const res = await fetch(
      "https://coupon-distribution-1-d5to.onrender.com/admin/coupons",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setCoupons(data);
  };

  // Fetch User Claim History
  const fetchClaimHistory = async () => {
    const token = localStorage.getItem("adminToken"); // Get the token
    const res = await fetch(
      "https://coupon-distribution-1-d5to.onrender.com/admin/claims",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setClaimHistory(data);
  };

  // Add a Coupon to MongoDB
  const addCoupon = async () => {
    await fetch(
      "https://coupon-distribution-1-d5to.onrender.com/admin/coupons",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: newCoupon }),
      }
    );
    setNewCoupon("");
    fetchCoupons();
  };

  // Toggle Coupon Availability
  const toggleCoupon = async (id) => {
    await fetch(
      `https://coupon-distribution-1-d5to.onrender.com/admin/coupons/${id}/toggle`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchCoupons();
  };

  // Start Editing Coupon
  const startEditing = (coupon) => {
    setEditCouponId(coupon._id);
    setEditCouponCode(coupon.code);
  };

  // Update Coupon in MongoDB
  const updateCoupon = async (id) => {
    await fetch(
      `https://coupon-distribution-1-d5to.onrender.com/admin/coupons/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: editCouponCode }),
      }
    );
    setEditCouponId(null);
    fetchCoupons();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Admin Dashboard
        </h2>

        {/* Add Coupon Section */}
        <div className="bg-gray-200 p-4 rounded-lg mb-6 shadow">
          <h3 className="text-xl font-semibold mb-2">Add New Coupon</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="border p-2 flex-1 rounded-l-lg outline-none"
              value={newCoupon}
              onChange={(e) => setNewCoupon(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600"
              onClick={addCoupon}
            >
              Add Coupon
            </button>
          </div>
        </div>

        {/* Coupons List */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Coupons (Available & Claimed)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3">Coupon Code</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="text-center">
                    <td className="p-3">
                      {editCouponId === coupon._id ? (
                        <input
                          type="text"
                          className="border p-2 w-full"
                          value={editCouponCode}
                          onChange={(e) => setEditCouponCode(e.target.value)}
                        />
                      ) : (
                        coupon.code
                      )}
                    </td>
                    <td className="p-3">
                      {coupon.claimed
                        ? "Claimed"
                        : coupon.active
                        ? "Active"
                        : "Disabled"}
                    </td>
                    <td className="p-3">
                      {editCouponId === coupon._id ? (
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                          onClick={() => updateCoupon(coupon._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            className={`px-3 py-1 rounded-lg text-white ${
                              coupon.active
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => toggleCoupon(coupon._id)}
                          >
                            {coupon.active ? "Disable" : "Enable"}
                          </button>
                          {!coupon.claimed && (
                            <button
                              className="bg-gray-500 text-white px-3 py-1 rounded-lg ml-2 hover:bg-gray-600"
                              onClick={() => startEditing(coupon)}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim History Section */}
        <div className="bg-gray-200 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">User Claim History</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="p-3">Coupon</th>
                  <th className="p-3">Claimed By</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claimHistory.map((claim, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-3">{claim.code}</td>
                    <td className="p-3">{claim.claimedBy}</td>
                    <td className="p-3">
                      {new Date(claim.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
