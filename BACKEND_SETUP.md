
# Complete Backend Setup Guide for Quantis FX

## Prerequisites
1. **XAMPP** - Download and install from https://www.apachefriends.org/
2. **phpMyAdmin** - Comes with XAMPP for database management

## Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Ensure both services show "Running" status

## Step 2: Create Database
1. Open your browser and go to `http://localhost/phpmyadmin`
2. Click "New" in the left sidebar
3. Create a database named `quantisfx`
4. Click "Create"

## Step 3: Import Database Schema
1. Select the `quantisfx` database
2. Click the "SQL" tab
3. Copy and paste the contents of `public/api/database.sql`
4. Click "Go" to execute the SQL

## Step 4: Configure Database Connection
The database configuration is already set in `public/api/config.php`:
```php
$host = 'localhost';
$dbname = 'quantisfx';
$username = 'root';
$password = ''; // Default XAMPP password is empty
```

## Step 5: Deploy Backend Files
1. Copy the entire `public/api/` folder to your XAMPP `htdocs` directory
2. The path should be: `C:\xampp\htdocs\quantisfx\api\` (Windows) or `/Applications/XAMPP/htdocs/quantisfx/api/` (Mac)

## Step 6: Test API Endpoints
Open your browser and test these URLs:

### Test Database Connection:
`http://localhost/quantisfx/api/index.php?route=admin/stats`

### Test Registration:
```bash
curl -X POST http://localhost/quantisfx/api/index.php?route=auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "countryCode": "+1"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost/quantisfx/api/index.php?route=auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Step 7: Frontend Configuration
Update your frontend API base URL in `src/services/api.ts`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost/quantisfx/api',
  // ... rest of config
});
```

## Admin Panel Access
1. Register a regular user first
2. Go to phpMyAdmin → quantisfx database → users table
3. Find your user and change the `role` field from `user` to `admin`
4. Now you can access the admin panel at `/admin`

## Database Tables Created:
- **users** - Store user information
- **transactions** - Store transaction history
- **verification_codes** - Store email verification codes

## API Endpoints Available:

### Authentication:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify-email` - Verify email with code
- `GET /auth/me` - Get current user info

### Admin (requires admin role):
- `GET /admin/users` - Get all users
- `POST /admin/users/verify` - Verify a user
- `GET /admin/stats` - Get system statistics

### Trading (requires authentication):
- `GET /trading/balance` - Get user balance
- `POST /trading/deposit` - Make a deposit

## Troubleshooting:

### If you get "Connection failed" error:
1. Make sure MySQL is running in XAMPP
2. Check if the database `quantisfx` exists
3. Verify the database credentials in `config.php`

### If you get "Route not found" error:
1. Check if the API files are in the correct path
2. Make sure Apache is running in XAMPP
3. Verify the URL format

### If CORS errors occur:
The API already includes CORS headers, but if you still get errors:
1. Make sure the frontend is making requests to the correct backend URL
2. Check browser console for specific error messages

## Security Notes:
- This is a development setup - use proper security measures for production
- Change JWT secret key in production
- Use environment variables for sensitive data
- Implement rate limiting for production use
