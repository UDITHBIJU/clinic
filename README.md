
---

**Live URL**: [https://clinic-1-qxtx.onrender.com/](https://clinic-1-qxtx.onrender.com/)

---

## Features

- User authentication using OTP (email-based)
- Secure JWT access/refresh token flow (access token in frontend, refresh token in HTTP-only cookie)
- Redis used for:
  - OTP storage (5-minute expiry)
  - Refresh token storage (7-day expiry)
- Protected routes using access tokens
---

## API Endpoints

### Auth Routes

**POST** `/auth/request-otp` - Send OTP to email during signup

**POST** `/auth/verify-otp` - Verify OTP and create user

**POST** `/auth/user/login` - Login with email & password

**POST** `/auth/doctor/login` - Login with email & password

**POST** `/auth/logout` - Logout and clear refresh token

**POST** `/auth/refresh` - Get new access token using refresh token

**POST** `/doctor/leave` - Doctor leave registretation

**GET** `/user/appointments` - Get user registered appointments

**POST** `/user/appointments/book` - Book appoinment

**Test Doctor Login**
username: dr_smith, email: dr.smith@example.com, password: password

username: dr_jones, email: dr.jones@example.com, password: password

username: dr_williams, email: dr.williams@example.com, password: password

username: udith, email: udithbiju2@gmail.com, password: password


## Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=

# Database
MONGO_URI=

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=
REDIS_PORT=19657
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password_here

# Email Configuration (SendGrid)
SENDER_EMAIL=your_sender_email@example.com
SENDGRID_API_KEY=your_sendgrid_api_key_here


```
Create a `.env` file in the frontend directory with the following variables:

VITE_API_URL=http://localhost:3000

---
