
<?php
// Set content type to JSON
header("Content-Type: application/json");

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the requested API route
$route = isset($_GET['route']) ? $_GET['route'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Get request body for POST/PUT requests
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Route the API request
// This is a very simplified example - you'll need to build out your actual API endpoints
try {
    if (strpos($route, 'auth/') === 0) {
        // Auth routes
        if ($route === 'auth/register' && $method === 'POST') {
            // Process registration
            // In a real app, validate and store user data in a database
            echo json_encode([
                "success" => true,
                "token" => "sample_token_" . rand(1000, 9999),
                "data" => [
                    "id" => rand(1, 1000),
                    "email" => $data['email'],
                    "firstName" => $data['firstName'],
                    "lastName" => $data['lastName'],
                    "isVerified" => false,
                    "countryCode" => $data['countryCode'] ?? '',
                    "phone" => $data['phone'] ?? '',
                    "role" => "user",
                    "walletBalance" => 0,
                    "demoBalance" => 10000
                ]
            ]);
        } elseif ($route === 'auth/login' && $method === 'POST') {
            // Process login
            echo json_encode([
                "success" => true,
                "token" => "sample_token_" . rand(1000, 9999),
                "data" => [
                    "id" => rand(1, 1000),
                    "email" => $data['email'],
                    "firstName" => "Demo",
                    "lastName" => "User",
                    "isVerified" => true,
                    "countryCode" => "US",
                    "phone" => "1234567890",
                    "role" => "user",
                    "walletBalance" => 1000,
                    "demoBalance" => 10000
                ]
            ]);
        } else {
            throw new Exception("Invalid auth endpoint");
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
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
