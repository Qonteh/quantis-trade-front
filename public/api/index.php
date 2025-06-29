
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
                INSERT INTO users (first_name, last_name, email, phone, country_code, password_hash) 
                VALUES (?, ?, ?, ?, ?, ?)
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

            // Send verification email (you'll need to implement this)
            // For now, we'll just log the code
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
            $stmt = $pdo->prepare("UPDATE users SET is_verified = TRUE WHERE id = ?");
            $stmt->execute([$data['userId']]);

            echo json_encode([
                "success" => true,
                "message" => "Email verified successfully"
            ]);

        } else {
            throw new Exception("Invalid auth endpoint");
        }
    } elseif (strpos($route, 'admin/') === 0) {
        // Admin routes
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

            $stmt = $pdo->prepare("UPDATE users SET is_verified = TRUE WHERE id = ?");
            $stmt->execute([$data['userId']]);

            echo json_encode([
                "success" => true,
                "message" => "User verified successfully"
            ]);

        } else {
            throw new Exception("Invalid admin endpoint");
        }
    } elseif (strpos($route, 'trading/') === 0) {
        // Trading routes
        if ($route === 'trading/balance' && $method === 'GET') {
            echo json_encode([
                "success" => true,
                "data" => [
                    "walletBalance" => 1000,
                    "demoBalance" => 10000
                ]
            ]);
        } elseif ($route === 'trading/deposit' && $method === 'POST') {
            echo json_encode([
                "success" => true,
                "message" => "Deposit successful",
                "data" => [
                    "walletBalance" => 1000 + ($data['amount'] ?? 0),
                    "transactionId" => "txn_" . rand(10000, 99999)
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
