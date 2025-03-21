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
      const response = await axios.get("http://localhost:5000/admin/coupons");

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
        "http://localhost:5000/claim",
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">Claim Your Coupon</h1>

        {claimedCoupon ? (
          <p className="mt-4 font-bold text-green-500">
            Your Coupon Code: {claimedCoupon}
          </p>
        ) : (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={claimCoupon}
          >
            Claim Now
          </button>
        )}

        <p className="mt-2 text-gray-500">
          {availableCoupons.length} active coupons left
        </p>
      </div>
    </div>
  );
}
