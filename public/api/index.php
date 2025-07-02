
<?php
// Set appropriate headers for CORS - MUST be at the top before ANY output
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Now set content type to JSON (after CORS headers)
header("Content-Type: application/json");

// Include database configuration
require_once 'config.php';

// Get the requested API route
$route = isset($_GET['route']) ? $_GET['route'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body for POST/PUT requests
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Helper function to generate JWT token (simple version)
function generateToken($userId) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(['user_id' => $userId, 'exp' => time() + (7 * 24 * 60 * 60)]);
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'your-secret-key', true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

// Helper function to validate JWT token
function validateToken($token) {
    if (!$token) return false;
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

// Helper function to get current user from token
function getCurrentUser($pdo) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);
    
    $payload = validateToken($token);
    if (!$payload) return null;
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$payload['user_id']]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Helper function to generate verification code
function generateVerificationCode() {
    return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

// Route the API request
try {
    if (strpos($route, 'auth/') === 0) {
        // Auth routes
        if ($route === 'auth/register' && $method === 'POST') {
            // Validate required fields
            if (!isset($data['firstName'], $data['lastName'], $data['email'], $data['password'])) {
                throw new Exception("Missing required fields");
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email format");
            }

            // Validate password strength
            if (strlen($data['password']) < 6) {
                throw new Exception("Password must be at least 6 characters long");
            }

            // Check if user already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            if ($stmt->fetch()) {
                throw new Exception("User already exists with this email");
            }

            // Hash password
            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

            // Insert new user
            $stmt = $pdo->prepare("
                INSERT INTO users (first_name, last_name, email, phone, country_code, password_hash, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $data['firstName'],
                $data['lastName'],
                $data['email'],
                $data['phone'] ?? '',
                $data['countryCode'] ?? '',
                $passwordHash
            ]);

            $userId = $pdo->lastInsertId();

            // Generate verification code
            $verificationCode = generateVerificationCode();
            $expiresAt = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 minutes

            $stmt = $pdo->prepare("
                INSERT INTO verification_codes (user_id, code, type, expires_at) 
                VALUES (?, ?, 'email', ?)
            ");
            $stmt->execute([$userId, $verificationCode, $expiresAt]);

            // Generate token
            $token = generateToken($userId);

            // Log the verification code for development
            error_log("Verification code for {$data['email']}: {$verificationCode}");

            echo json_encode([
                "success" => true,
                "token" => $token,
                "data" => [
                    "id" => $userId,
                    "email" => $data['email'],
                    "firstName" => $data['firstName'],
                    "lastName" => $data['lastName'],
                    "isVerified" => false,
                    "countryCode" => $data['countryCode'] ?? '',
                    "phone" => $data['phone'] ?? '',
                    "role" => "user",
                    "walletBalance" => 0,
                    "demoBalance" => 10000,
                    "verificationCode" => $verificationCode // Remove in production
                ]
            ]);

        } elseif ($route === 'auth/login' && $method === 'POST') {
            // Validate required fields
            if (!isset($data['email'], $data['password'])) {
                throw new Exception("Missing email or password");
            }

            // Find user by email
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($data['password'], $user['password_hash'])) {
                throw new Exception("Invalid credentials");
            }

            // Update last login time
            $stmt = $pdo->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);

            // Generate token
            $token = generateToken($user['id']);

            echo json_encode([
                "success" => true,
                "token" => $token,
                "data" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "isVerified" => (bool)$user['is_verified'],
                    "countryCode" => $user['country_code'],
                    "phone" => $user['phone'],
                    "role" => $user['role'],
                    "walletBalance" => (float)$user['wallet_balance'],
                    "demoBalance" => (float)$user['demo_balance']
                ]
            ]);

        } elseif ($route === 'auth/verify-email' && $method === 'POST') {
            // Verify email with code
            if (!isset($data['userId'], $data['code'])) {
                throw new Exception("Missing userId or code");
            }

            $stmt = $pdo->prepare("
                SELECT * FROM verification_codes 
                WHERE user_id = ? AND code = ? AND type = 'email' AND is_used = FALSE AND expires_at > NOW()
            ");
            $stmt->execute([$data['userId'], $data['code']]);
            $verificationCode = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$verificationCode) {
                throw new Exception("Invalid or expired verification code");
            }

            // Mark code as used
            $stmt = $pdo->prepare("UPDATE verification_codes SET is_used = TRUE WHERE id = ?");
            $stmt->execute([$verificationCode['id']]);

            // Update user as verified
            $stmt = $pdo->prepare("UPDATE users SET is_verified = TRUE, account_status = 'active' WHERE id = ?");
            $stmt->execute([$data['userId']]);

            echo json_encode([
                "success" => true,
                "message" => "Email verified successfully"
            ]);

        } elseif ($route === 'auth/me' && $method === 'GET') {
            // Get current user
            $user = getCurrentUser($pdo);
            if (!$user) {
                throw new Exception("Invalid or expired token");
            }

            echo json_encode([
                "success" => true,
                "data" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "isVerified" => (bool)$user['is_verified'],
                    "countryCode" => $user['country_code'],
                    "phone" => $user['phone'],
                    "role" => $user['role'],
                    "walletBalance" => (float)$user['wallet_balance'],
                    "demoBalance" => (float)$user['demo_balance']
                ]
            ]);

        } else {
            throw new Exception("Invalid auth endpoint");
        }
    } elseif (strpos($route, 'admin/') === 0) {
        // Admin routes - require admin authentication
        $user = getCurrentUser($pdo);
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            throw new Exception("Admin access required");
        }

        if ($route === 'admin/users' && $method === 'GET') {
            // Get all users (admin only)
            $stmt = $pdo->prepare("
                SELECT id, first_name, last_name, email, phone, country_code, 
                       is_verified, role, wallet_balance, demo_balance, 
                       account_status, created_at 
                FROM users 
                ORDER BY created_at DESC
            ");
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "data" => $users
            ]);

        } elseif ($route === 'admin/users/verify' && $method === 'POST') {
            // Verify user (admin only)
            if (!isset($data['userId'])) {
                throw new Exception("Missing userId");
            }

            $stmt = $pdo->prepare("UPDATE users SET is_verified = TRUE, account_status = 'active' WHERE id = ?");
            $stmt->execute([$data['userId']]);

            echo json_encode([
                "success" => true,
                "message" => "User verified successfully"
            ]);

        } elseif ($route === 'admin/stats' && $method === 'GET') {
            // Get admin statistics
            $stmt = $pdo->prepare("
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified_users,
                    SUM(wallet_balance) as total_balance,
                    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as new_today
                FROM users
            ");
            $stmt->execute();
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "data" => $stats
            ]);

        } else {
            throw new Exception("Invalid admin endpoint");
        }
    } elseif (strpos($route, 'trading/') === 0) {
        // Trading routes - require authentication
        $user = getCurrentUser($pdo);
        if (!$user) {
            http_response_code(401);
            throw new Exception("Authentication required");
        }

        if ($route === 'trading/balance' && $method === 'GET') {
            echo json_encode([
                "success" => true,
                "data" => [
                    "walletBalance" => (float)$user['wallet_balance'],
                    "demoBalance" => (float)$user['demo_balance']
                ]
            ]);
        } elseif ($route === 'trading/deposit' && $method === 'POST') {
            $amount = $data['amount'] ?? 0;
            if ($amount <= 0) {
                throw new Exception("Invalid deposit amount");
            }

            // Update user balance
            $stmt = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
            $stmt->execute([$amount, $user['id']]);

            // Record transaction
            $stmt = $pdo->prepare("
                INSERT INTO transactions (user_id, type, amount, status, reference, created_at) 
                VALUES (?, 'deposit', ?, 'completed', ?, NOW())
            ");
            $reference = 'DEP_' . time() . '_' . rand(1000, 9999);
            $stmt->execute([$user['id'], $amount, $reference]);

            echo json_encode([
                "success" => true,
                "message" => "Deposit successful",
                "data" => [
                    "walletBalance" => (float)$user['wallet_balance'] + $amount,
                    "transactionId" => $reference
                ]
            ]);
        } else {
            throw new Exception("Invalid trading endpoint");
        }
    } else {
        throw new Exception("Route not found");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
