import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const router = express.Router();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests only from your frontend
    credentials: true, // Required for cookies to be sent
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Coupon Schema
const couponSchema = new mongoose.Schema({
  code: String,
  claimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});
const Coupon = mongoose.model("Coupon", couponSchema);

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    jwt.verify(token, "secretKey");
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Distribute Coupon
app.post("/claim", async (req, res) => {
  const userIP =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const userCookie = req.cookies.claimed;

  if (userCookie)
    return res
      .status(403)
      .json({ message: "Coupon already claimed from this browser" });

  const existingClaim = await Coupon.findOne({ claimedBy: userIP });
  if (existingClaim)
    return res
      .status(403)
      .json({ message: "Coupon already claimed from this IP" });

  const coupon = await Coupon.findOneAndUpdate(
    { claimed: false },
    { claimed: true, claimedBy: userIP },
    { new: true, sort: { createdAt: 1 } } // Picks the oldest unclaimed coupon
  );
  if (!coupon) return res.status(404).json({ message: "No coupons available" });

  res.cookie("claimed", true, { maxAge: 86400000, httpOnly: true });
  res.json({ message: "Coupon claimed successfully", code: coupon.code });
});

const ADMIN_PASSWORD = "admin123"; // Replace with an environment variable in production

app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, "secretKey", { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid password" });
});

// Protect Admin Routes
app.get("/admin/coupons", async (req, res) => {
  const coupons = await Coupon.find(); // Fetch all coupons, including claimed ones
  res.json(coupons);
});

// Fetch User Claim History (Admin Only)
app.get("/admin/claims", authenticateAdmin, async (req, res) => {
  const claims = await Coupon.find({ claimed: true }).select(
    "code claimedBy createdAt"
  );
  res.json(claims);
});

app.post("/admin/coupons", authenticateAdmin, async (req, res) => {
  const { code } = req.body;
  const newCoupon = new Coupon({ code, active: true });
  await newCoupon.save();
  res.json({ message: "Coupon added" });
});

// Update coupon code
app.put("/admin/coupons/:id", authenticateAdmin, async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { code },
    { new: true }
  );
  res.json(coupon);
});

// Toggle coupon availability
app.patch("/admin/coupons/:id/toggle", authenticateAdmin, async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });

  coupon.active = !coupon.active;
  await coupon.save();
  res.json({ message: "Coupon status updated", active: coupon.active });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
