# 🎟️ Coupon Distribution System

A **MERN stack** web application for distributing coupons in a **round-robin** manner, with an **admin panel** to manage coupons and prevent abuse.

🚀 **Live Demo:**

- **Frontend:** [https://coupon-distribution-no9c6xhk8-lakshays-projects-8b61cb8d.vercel.app/](https://coupon-distribution-no9c6xhk8-lakshays-projects-8b61cb8d.vercel.app/)
- **Backend:** [https://coupon-distribution-1-d5to.onrender.com](https://coupon-distribution-1-d5to.onrender.com)

---

## 📌 **Features**

✅ **User Side:**

- Claim coupons in a **round-robin** manner.
- View remaining active coupons.
- Get notified when no coupons are available.

✅ **Admin Side:**

- **Login securely** to access the admin panel.
- **Add, Edit, Disable, or Delete** coupons.
- **View claim history** with timestamps and IP addresses.
- Prevent abuse by deactivating coupons anytime.

✅ **Security & Optimization:**

- **IP-based abuse prevention** (users cannot claim multiple times).
- **CORS enabled** for smooth frontend-backend communication.
- **Fully Responsive UI** with Tailwind CSS.

---

## 🚀 **Tech Stack**

### **Frontend (React)**

- React.js + React Router
- Axios (for API requests)
- Tailwind CSS (for styling)
- React Toastify (for notifications)

### **Backend (Node.js + Express)**

- Express.js (server)
- MongoDB (database)
- Mongoose (ODM)
- CORS
- JSON Web Token (JWT) for authentication

---

## ⚡ **Setup & Installation**

### **1️⃣ Clone the Repository**

```sh
git https://github.com/lakshay-2411/coupon-distribution.git
cd coupon-distribution
```

### **2️⃣ Backend Setup**

```sh
cd backend
npm install
```

**Configure Environment Variables**

Create a .env file inside backend/ and add:

```sh
PORT=PORT_NUMBER
MONGO_URI=your-mongodb-connection-string
```

**Run Backend**

```sh
npm run dev
```

### **3️⃣ Frontend Setup**

```sh
cd frontend
npm install
```

**Run Frontend**

```sh
npm run dev
```

### **🎯 How to Use**

#### **User Side (Claim Coupons)**

- Open Frontend URL
- Click on "Claim Now"
- If coupons are available, you'll receive a unique coupon code.
- If no coupons are available, a message will notify you

#### **Admin Side (Manage Coupons)**

1. Go to Admin Login Page:
   👉 https://coupon-distribution-no9c6xhk8-lakshays-projects-8b61cb8d.vercel.app/admin
2. Enter the Admin Password and login.
3. Admin Dashboard Features:
   - Add a New Coupon
   - Edit an Existing Coupon
   - Enable/Disable Coupons
   - View User Claim History
4. Click Logout to exit the admin panel.
