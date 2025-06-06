# 🗳️ Voting App with Email Verification

A full-stack voting system built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and JWT. Includes secure user registration, login, email verification, and vote tracking.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes (Pages Router)
- **Database**: PostgreSQL (hosted on Render or Railway)
- **ORM**: Prisma
- **Auth**: JWT (stored in httpOnly cookies)
- **Email**: Nodemailer (SMTP with Gmail)

## 🔐 Features

- ✅ User registration with email verification
- ✅ Secure login with JWT
- ✅ Password reset via email
- ✅ Protected routes (`/vote`, `/results`)
- ✅ Real-time vote tracking and results
- ✅ Password visibility toggle
- ✅ Mobile-friendly responsive navigation

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/register` | Register new user (email + password) |
| `/login` | Login with JWT |
| `/forgot-password` | Request password reset email |
| `/reset-password` | Reset password using token |
| `/vote` | Vote for a political party (requires login) |
| `/results` | View voting results, sorted by votes |

## ⚙️ Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="yoursecretkey"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
BASE_URL="http://localhost:3000" # or your deployed URL
```

## 🧪 Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 📦 Deployment

This app is deployed to **Vercel**.

> ⚠️ If using Vercel, make sure to add `"postinstall": "prisma generate"` in `package.json` to avoid Prisma client issues during build.

## 🛠️ TODO

- [ ] Add admin dashboard
- [ ] Add vote confirmation animation
- [ ] Display results with charts
- [ ] Add support for vote editing or canceling

## 📸 Screenshots

> Coming soon...

---

Made with ❤️ by [Denys Koval](https://github.com/KovalDenys1)
