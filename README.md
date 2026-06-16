# ♻️ E-Waste Salvage Inventory Management System

A full-stack web application designed for e-waste recycling centers, repair shops, and salvage businesses to manage electronic waste efficiently. This system tracks the complete lifecycle of a device—from the moment it is received, through dismantling, component grading, inventory tracking, and final sale or disposal.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and modern UI libraries like Tailwind CSS v4, Redux Toolkit, and Recharts.

![Dashboard Preview](https://via.placeholder.com/1000x500.png?text=E-Waste+Management+Dashboard)

## ✨ Features

- **📊 Advanced Dashboard:** Real-time analytics, monthly revenue charts, and condition distribution pies.
- **📱 Device Management:** Log incoming devices (laptops, phones, etc.), assign barcodes, and track their dismantling status.
- **⚙️ Component Extraction:** Dismantle devices and log individual components (RAM, CPU, Batteries) along with their graded conditions (Working, Repairable, Scrap).
- **📦 Inventory System:** Real-time stock tracking with one-click "Stock In" and "Stock Out" modal workflows.
- **💸 Sales & Disposals:** Track the monetary value recovered from components, or log unrecoverable components for responsible disposal.
- **🔐 Role-Based Access Control:** Secure JWT authentication supporting `admin`, `technician`, and `inventory_manager` roles.
- **🎨 Modern Aesthetics:** Premium dark-mode interface featuring glassmorphism, fluid animations, and responsive grids.

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Redux Toolkit, React Router, Recharts, React Hot Toast.
- **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), bcryptjs.
- **Database:** MongoDB.

---

## 🛠️ Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port `27017`)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/SaiAdarsh619/E-WasteInvt.git
cd E-WasteInvt
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure the environment:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ewaste_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

**Seed the Database (Optional but Recommended):**
To populate the database with default users and sample data for testing, run:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal tab, navigate to the frontend directory, and start the app:
```bash
cd frontend
npm install
npm run dev
```

The application should now be running at `http://localhost:5173`.

---

## 🔑 Demo Credentials

If you ran the database seeder (`npm run seed`), you can log in immediately using the following test accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ewaste.com` | `password123` |
| **Technician** | `tech@ewaste.com` | `password123` |
| **Inventory Manager** | `manager@ewaste.com` | `password123` |

---

## 📂 Project Structure

```text
E-WasteInvt/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API route logic
│   ├── middleware/      # Auth & Error handling
│   ├── models/          # Mongoose DB Schemas
│   ├── routes/          # Express API routes
│   ├── utils/           # Seeder script & utilities
│   └── server.js        # Backend entry point
│
└── frontend/
    ├── src/
    │   ├── app/         # Redux store
    │   ├── components/  # Global UI components (Sidebar, Layout, Modals)
    │   ├── features/    # Redux slices and Pages per domain (devices, inventory, etc.)
    │   ├── index.css    # Global Tailwind styles
    │   └── App.jsx      # React Router configuration
    └── vite.config.js   # Vite configuration
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/SaiAdarsh619/E-WasteInvt/issues).

## 📝 License
This project is licensed under the MIT License.
