import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(
      "https://coupon-distribution-1-d5to.onrender.com/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Enter Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
