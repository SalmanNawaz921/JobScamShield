# JobScamShield 🛡️

JobScamShield is an AI-powered web application designed to detect and prevent fake job postings. It uses advanced NLP and machine learning techniques to analyze job descriptions and flag potentially fraudulent listings. Built with the **Next.js** framework and integrated with **Firebase**, **OpenAI**, and **custom APIs**, the platform also includes admin controls, 2FA, user authentication, and real-time messaging.

## 🌐 Live Demo

[🔗 Visit JobScamShield on Netlify](https://jobscamshield.netlify.app/) *(replace with actual link if different)*

---

## 🚀 Features

- 🔍 **Fake Job Detection** using OpenAI-based classifier
- 🔐 **Authentication with Firebase** (Email, 2FA)
- 🛠 **Admin Panel** to manage users and logs
- 📬 **Email Notifications** via SMTP
- 💬 **Chat System** for user-bot interaction
- 🧠 **AI Modal Integration** with external API
- 🛡️ **Security Middleware** and token-based auth
- ⚡ **Optimized for Vercel/Netlify Deployments**

---

## 📁 Project Structure

```

src/
├── app/                   # App directory (Next.js 13+ routing)
├── assets/                # Assets e.g Logo
├── components/            # Reusable UI components
├── context/               # Context
├── hooks/                 # Hooks
├── lib/                   # Helper libraries and services
├── middleware.js          # Route protection logic
├── pages/                 # Legacy pages directory
├── sections/              # Static assets
├── services/              # Services
└── styles/                # Global and module CSS

````

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Next.js 15
- **Backend**: Next.js API Routes, Firebase Functions
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth + JWT
- **AI Integration**: OpenAI, Modal API
- **Hosting**: Netlify
- **Email**: Nodemailer

---

## 🧪 Run Locally (Test Environment)

### Clone the Repository

```bash
git clone https://github.com/SalmanNawaz921/JobScamShield.git
cd JobScamShield
````

### Install Dependencies

```bash
npm install
```

### Create `.env.test`

```bash
cp .env.test .env.local
```

### Start Development Server

```bash
npm run dev
```

---

## 📄 Environment Variables

Create a file named `.env.test` and paste the following:

```
# API Base URL for Tests
NEXT_PUBLIC_API_LINK=http://localhost:3000/api

# Firebase Configuration (Mock/Test Keys)
NEXT_PUBLIC_FIREBASE_API_KEY=FAKE_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fake-auth-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fake-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fake-storage-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-FAKE123456

# SMTP Config (Mock)
SMTP_EMAIL=test@example.com
SMTP_PASSWORD=testpassword123

# JWT Configuration
JWT_SECRET=testingsecretkey
JWT_EXPIRATION=1h

# Modal API
MODAL_API_URL=https://mock-modal-api.com
MODAL_API_KEY=mock-modal-api-key

# OpenAI Key (Mock)
NEXT_PUBLIC_OPENAI_API_KEY=sk-test-1234567890abcdef

# Frontend URL (Mock)
FRONTEND_URL=http://localhost:3000

```

> ⚠️ **Important**: Never commit `.env.*` files to your repository. Use `.gitignore` to exclude them.

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 📬 Contact

For inquiries or suggestions, reach out to [Salman Nawaz](https://github.com/SalmanNawaz921).

---

