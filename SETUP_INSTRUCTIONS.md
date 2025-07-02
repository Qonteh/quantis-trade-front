
# Complete Authentication System Setup Guide

## 🚀 Quick Start - Follow These Steps Exactly

### Step 1: Backend Setup (XAMPP + Database)

1. **Install XAMPP**
   - Download from: https://www.apachefriends.org/
   - Install and start Apache + MySQL services

2. **Create Database**
   - Open: http://localhost/phpmyadmin
   - Create new database: `quantisfx`
   - Import the SQL schema from `public/api/database.sql`

3. **Deploy Backend Files**
   - Copy your `public/api/` folder to: `C:\xampp\htdocs\quantisfx\api\`
   - Your API will be available at: `http://localhost/quantisfx/api/`

### Step 2: Test Your Backend

Test these URLs in your browser:

**Test Database Connection:**
```
http://localhost/quantisfx/api/index.php?route=admin/stats
```

**Test Registration (using curl or Postman):**
```bash
curl -X POST http://localhost/quantisfx/api/index.php?route=auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User", 
    "email": "admin@quantis.com",
    "password": "admin123",
    "phone": "1234567890",
    "countryCode": "+1"
  }'
```

### Step 3: Create Admin User

1. Register a user using your frontend
2. Go to phpMyAdmin → quantisfx database → users table  
3. Find your user and change:
   - `role` from `user` to `admin`
   - `is_verified` from `0` to `1`

### Step 4: Frontend Configuration

Your frontend is now configured to connect to:
```
http://localhost/quantisfx/api
```

## 🎯 How to Access Everything

### Regular Users:
1. Go to `/register` - Register new account
2. Check verification code in PHP error logs or phpMyAdmin
3. Go to `/verify` - Enter verification code
4. Go to `/dashboard` - Access user dashboard

### Admin Access:
1. Create admin user (see Step 3 above)
2. Login normally
3. Go to `/admin` - Access admin dashboard
4. View all registered users and statistics

## 📊 Admin Panel Features

Your admin panel includes:
- **User Statistics**: Total users, verified users, balances
- **User Management**: View all users, verify users manually
- **Real-time Data**: Refresh button to get latest data
- **User Details**: Names, emails, phone numbers, verification status

## 🔧 Database Tables

Your system uses these tables:
- **users**: Store all user information
- **transactions**: Store transaction history  
- **verification_codes**: Store email verification codes

## 🚨 Troubleshooting

**If you get "Connection failed":**
- Make sure MySQL is running in XAMPP
- Check if database `quantisfx` exists
- Verify config.php has correct database settings

**If you get "Route not found":**
- Check API files are in correct path: `htdocs/quantisfx/api/`
- Make sure Apache is running
- Verify URL format includes `?route=`

**If login doesn't work:**
- Check browser console for errors
- Verify backend API is accessible
- Check if user exists in database

## 🔐 Security Features

✅ **Real Database Authentication**: No more demo tokens
✅ **Password Hashing**: Secure password storage  
✅ **JWT Tokens**: Secure session management
✅ **Email Verification**: Users must verify email
✅ **Admin Protection**: Admin routes properly protected
✅ **Input Validation**: Server-side validation

## 📱 What Works Now

- ✅ Real user registration with database storage
- ✅ Secure login with password verification
- ✅ Email verification system
- ✅ Protected routes (must be logged in + verified)
- ✅ Admin panel with user management
- ✅ Real-time user statistics
- ✅ Token-based authentication
- ✅ Automatic logout on token expiry

Your authentication system is now complete and secure! 🎉
