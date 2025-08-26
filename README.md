# 📦 Parcel Track Agent  

A web application for managing and tracking parcels efficiently. It provides authentication (login/register), parcel management, analytics, and agent features with a clean UI.  

---

## 🚀 Features  
- **User Authentication**  
  - Register new users (Customer / Agent / Admin roles).  
  - Secure login with JWT authentication.  

- **Parcel Management**  
  - Customers can create new parcel orders.  
  - Agents can update parcel status (In Transit, Delivered, etc.).  
  - Admins can view and manage all parcels.  

- **Analytics Dashboard**  
  - View delivery statistics and agent performance.  

- **Responsive UI**  
  - Built with React + Tailwind for a smooth, mobile-friendly experience.  

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone Repository  
```bash
git clone https://github.com/your-username/parcel-track-agent.git
cd parcel-track-agent
```

### 2️⃣ Install Dependencies  

#### Backend (Server)  
```bash
cd server
npm install
```

#### Frontend (Client)  
```bash
cd ..
npm install
```

---

### 3️⃣ Environment Variables  

#### Backend (`/server/.env`)  
Create a `.env` file in the `server` folder with:  
```
PORT=5000
JWT_SECRET=your-secret-key
```

#### Frontend (`/.env`)  
Create a `.env` file in project root with:  
```
VITE_API_URL=http://localhost:5000
```

---

### 4️⃣ Run the Application  

#### Start Backend  
```bash
cd server
npm start
```

#### Start Frontend  
In another terminal:  
```bash
npm run dev
```

Then open:  
👉 `http://localhost:5173`  

---

## 🔑 Usage Guide  

### User Roles  
- **Customer** → Register, login, create parcels, track status.  
- **Agent** → Update delivery progress of parcels.  
- **Admin** → Manage users, parcels, and view analytics.  

### Navigation  
- **Login/Register** → Access app with your credentials.  
- **Dashboard** → View parcel list and actions available to your role.  
- **Analytics** → View delivery stats and performance charts.  

---

## 📂 Project Structure  

```
parcel-track-agent/
├── server/          # Backend (Node.js + Express + JWT)
│   ├── routes/      # API endpoints (auth, parcels, agents, analytics)
│   ├── data/        # Mock/DB data handling
│   └── server.js    # Main server file
│
├── src/             # Frontend (React + Vite + Tailwind)
│   ├── pages/       # Page components (Login, Register, Dashboard, etc.)
│   ├── components/  # Reusable UI components
│   └── lib/         # API client (Axios setup)
│
├── public/          # Static assets
└── README.md        # Documentation
```

---

## ✅ Testing the Features  

1. **Register a user** → Create account as Customer or Agent.  
2. **Login** → Authenticate and get access to dashboard.  
3. **Create Parcel (Customer)** → Fill details and submit.  
4. **Update Parcel (Agent)** → Change parcel status.  
5. **View Analytics (Admin)** → See summary of deliveries.  

---

## 🤝 Contribution  
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.  

---

## 📧 Contact  
For any queries, feel free to reach out.  
