import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CouponClaim() {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [claimedCoupon, setClaimedCoupon] = useState(null);

  // Fetch available coupons from backend
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "https://coupon-distribution-1-d5to.onrender.com/admin/coupons"
      );

      // Filter only active and unclaimed coupons
      const available = response.data.filter(
        (coupon) => !coupon.claimed && coupon.active
      );
      setAvailableCoupons(available);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Claim Coupon
  const claimCoupon = async () => {
    try {
      if (availableCoupons.length === 0) {
        toast.warn("No active coupons available at the moment");
        return;
      }

      const response = await axios.post(
        "https://coupon-distribution-1-d5to.onrender.com/claim",
        {},
        { withCredentials: true }
      );

      setClaimedCoupon(response.data.code);
      toast.success(response.data.message);
      fetchCoupons(); // Refresh coupon list after claiming
    } catch (error) {
      toast.error(error.response?.data.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 text-white">
      <ToastContainer position="top-center" autoClose={1000} />

      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl text-center w-96">
        <h1 className="text-3xl font-bold mb-4">🎉 Claim Your Coupon 🎉</h1>

        {claimedCoupon ? (
          <p className="mt-6 text-2xl font-bold text-green-600 bg-gray-100 p-4 rounded-lg shadow-md border border-green-400 animate-pulse">
            ✅ Your Coupon Code:{" "}
            <span className="text-red-500">{claimedCoupon}</span>
          </p>
        ) : (
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition duration-300"
            onClick={claimCoupon}
          >
            🎁 Claim Now
          </button>
        )}

        <p className="mt-4 text-gray-600">
          {availableCoupons.length} active coupons left 🏆
        </p>
      </div>
    </div>
  );
}
