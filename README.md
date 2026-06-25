# 🚀 TaskFlow - Full Stack Task Management Application

TaskFlow is a modern full-stack task management platform built with **Next.js, Express.js, Prisma ORM, MySQL, Redis, Cloudinary, and TypeScript**. It enables users to securely manage their personal tasks with authentication, email verification, password recovery, profile management, pagination, caching, and a clean responsive UI.

---

## 🌐 Live Demo

**Frontend:** Coming Soon

**Backend API:** Coming Soon

---

## 📸 Screenshots

> Add screenshots after deployment.

- Login Page
- Signup Page
- Home Dashboard
- Create Task
- Edit Task
- Profile
- Dark Mode
- Mobile View

---

# ✨ Features

## 🔐 Authentication

- User Signup
- User Login
- Logout
- JWT Authentication
- HTTP Only Cookies
- Protected Routes
- Account Verification using OTP
- Forgot Password
- Reset Password using OTP
- Change Password

---

## 👤 Profile

- View Profile
- Edit Profile
- Upload Avatar
- Cloudinary Image Upload
- Bio
- Phone Number

---

## ✅ Task Management

- Create Task
- Edit Task
- Delete Task
- Mark Task Complete
- Mark Task Incomplete
- Task Priority
- Task Deadline
- Relative Updated Time
- Pagination
- Search Tasks
- Filter by Priority
- Filter by Status

---

## ⚡ Performance

- Redis Caching
- Cache Invalidation
- Optimized Database Queries
- Prisma ORM
- Pagination Support

---

## 🎨 UI

- Responsive Design
- Light Mode
- Dark Mode
- Modern Dashboard
- Custom Loaders
- Error Pages
- Empty States
- Clean User Experience

---

# 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Context API
- Fetch API
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- Redis

### Authentication

- JWT
- Bcrypt
- HTTP Only Cookies

### Services

- Cloudinary
- Nodemailer
- Redis Cloud
- Railway MySQL

---

# 📂 Project Structure

```
TaskFlow
│
├── Frontend
│   ├── app
│   ├── Components
│   ├── AllContexts
│   ├── utils
│   └── middleware
│
├── Backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── config
│   ├── prisma
│   ├── utils
│   └── redis
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/taskflow.git
```

```
cd taskflow
```

---

## Backend

```
cd Backend
npm install
```

Create a `.env` file.

```
DATABASE_URL=

SECRET_KEY=

REDIS_URL=

EMAIL=

EMAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

FRONTEND_URL=

PORT=7000
```

Generate Prisma Client

```
npx prisma generate
```

Run Migrations

```
npx prisma migrate deploy
```

Start Server

```
npm run dev
```

---

## Frontend

```
cd Frontend
npm install
```

Create a `.env.local`

```
NEXT_PUBLIC_BASEURL=

NEXT_PUBLIC_CLOUD_NAME=
```

Run Frontend

```
npm run dev
```

---

# 📦 API Features

### Authentication

```
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/verifylogin/:id
POST /auth/sendotp/:email
POST /auth/verifyaccount/:email
POST /auth/forgotpassword
PATCH /auth/resetpassword
PATCH /auth/changepassword
PUT /auth/updateprofile
```

### Tasks

```
GET /task/getalltasks/:page
POST /task/createtask
PATCH /task/updatetask/:taskId
DELETE /task/deletetask/:taskId
```

---

# 🗄 Database

## User

- Name
- Email
- Password
- Avatar
- Bio
- Phone Number
- Verified Status

## Task

- Title
- Description
- Priority
- Deadline
- Status
- Created By
- Created At
- Updated At

---

# 🚀 Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Railway MySQL

### Redis

- Redis Cloud

### Image Storage

- Cloudinary

---

# 📚 What I Learned

During this project I gained practical experience with:

- Next.js App Router
- Prisma ORM
- MySQL
- Redis Caching
- Authentication using JWT
- Cookie-based Sessions
- Cloudinary Integration
- Nodemailer
- Pagination
- Protected Routes
- Context API
- TypeScript
- Tailwind CSS
- Full Stack Deployment

---

# 👨‍💻 Author

**Vishal Tiwari**

GitHub: https://github.com/Vishal05it

LinkedIn:www.linkedin.com/in/vishal-tiwari-17684822a

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
