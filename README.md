# Recruitment Tracker

A modern, full-stack recruitment management system built with React, Node.js, Express, and PostgreSQL. It allows recruiters to manage candidate data, track statuses, and streamline hiring workflows.

## 🚀 Live Demo

👉 [https://recruitment-assessment.vercel.app](https://recruitment-assessment.vercel.app)

**Login with test credentials:**

- **Email:** `tester@test.com`
- **Password:** `Testing123!`

---

## 🧰 Tech Stack

**Frontend:**

- React + Vite
- Tailwind CSS
- Axios
- React Router
- React Toastify

**Backend:**

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Zod Validation

---

## 📦 Features

- 🔐 Secure authentication (JWT)
- 👤 Recruiter login & registration
- 📄 Candidate CRUD (create, update, delete)
- 🔍 Live search & filter by status
- 📊 Dashboard with real-time stats
- 🧠 Debounced search for performance
- 💅 Clean and responsive UI

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/recruitment-assessment.git
cd recruitment-assessment
```

### 2. Setup the backend

```bash
cd backend
npm install
```

- Create a `.env` file in `backend/` based on `.env.example`.
- Make sure your PostgreSQL database is running and credentials are correct.
- Run migrations (if applicable).
- Start the server:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
recruitment-assessment/
├── backend/
│   └── controllers, routes, models, middleware
├── frontend/
│   └── pages, components, context, services
```

---

## 🧪 Test Credentials

You can log in using the following test account:

- **Email:** `tester@test.com`
- **Password:** `Testing123!`

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

- [React](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Express](https://expressjs.com)
- [Zod](https://zod.dev)
- [PostgreSQL](https://www.postgresql.org)