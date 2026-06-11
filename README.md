# FitZone AI 🏋️ — Smart Gym Marketing & Lead Generation Platform

> A full-stack MERN application for AI-powered gym digital marketing automation.

---

## 🚀 Features

- **AI Marketing Generator** — Captions, hashtags, ad copy via OpenAI
- **Local SEO Tools** — Keyword suggestions, meta title/description generator
- **Lead Management** — Capture, track, and manage gym leads
- **Analytics Dashboard** — Charts with Chart.js (Bar, Line, Pie, Doughnut)
- **JWT Authentication** — Secure login/register with bcrypt
- **Membership Plans** — ₹999 / ₹2,499 / ₹7,999 plans
- **Trainer Profiles** — Certified trainer cards
- **Testimonials Carousel** — Client success stories
- **Mobile Responsive** — Premium dark UI with Tailwind CSS

---

## 📁 Folder Structure

```
roshan project/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Navbar, Footer, Sidebar, etc.
│   │   ├── pages/             # Home, Login, Register, Dashboard, etc.
│   │   └── context/           # AuthContext
│   └── vite.config.js
│
└── server/                    # Node.js + Express backend
    ├── config/db.js           # MongoDB connection
    ├── models/                # Mongoose models
    ├── controllers/           # Business logic
    ├── routes/                # API routes
    ├── middleware/auth.js     # JWT middleware
    └── server.js
```

---

## ⚙️ Setup & Run

### 1. Start Backend

```bash
cd server
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔧 Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitzone
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_key_here  # Optional — uses mock data if not set
```
click : https://fitzone-six-eta.vercel.app

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/leads/create | Submit lead (public) |
| GET | /api/leads/all | Get all leads (protected) |
| PUT | /api/leads/:id | Update lead status |
| DELETE | /api/leads/:id | Delete lead |
| POST | /api/ai/caption | Generate Instagram caption |
| POST | /api/ai/hashtags | Generate hashtags |
| POST | /api/ai/adcopy | Generate ad copy |
| POST | /api/ai/blogideas | Generate blog ideas |
| POST | /api/ai/seokeywords | Generate SEO keywords |
| GET | /api/analytics | Get analytics data |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Chart.js + React Chart.js 2 |
| Icons | Lucide React |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | OpenAI GPT-3.5 |
| Notifications | react-hot-toast |

---

## 📱 Pages

- `/` — Landing page (Hero, Services, Pricing, Trainers, Testimonials, Contact)
- `/login` — Login page
- `/register` — Register page
- `/dashboard` — Stats + Charts + Recent leads
- `/dashboard/ai` — AI Content Generator
- `/dashboard/seo` — SEO Tools
- `/dashboard/analytics` — Full analytics
- `/dashboard/leads` — Lead management
- `/dashboard/settings` — Settings

---

## 👨‍💻 Developed By

**Luxman Kumar 
Built with ❤️ using MERN Stack + OpenAI

---

*Made for gym owners who want to grow smarter, not harder.* 💪
"# Fitzone-ai" 
