<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['name']) || !isset($data['level']) || !isset($data['score'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$name = trim($data['name']);
$level = (int)$data['level'];
$score = (int)$data['score'];

if (empty($name) || $level < 1 || $score < 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input values']);
    exit();
}

// Create scores directory if it doesn't exist
$scoresDir = __DIR__ . '/scores';
if (!file_exists($scoresDir)) {
    if (!mkdir($scoresDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create scores directory']);
        exit();
    }
}

// Save the score to a file
$scoreData = [
    'name' => $name,
    'level' => $level,
    'score' => $score,
    'timestamp' => date('Y-m-d H:i:s')
];

$scoreFile = $scoresDir . '/scores.json';
$scores = [];

// Read existing scores if the file exists
if (file_exists($scoreFile)) {
    $scores = json_decode(file_get_contents($scoreFile), true) ?? [];
}

// Add the new score
$scores[] = $scoreData;

// Sort scores by score (descending)
usort($scores, function($a, $b) {
    return $b['score'] - $a['score'];
});

// Keep only top 100 scores
$scores = array_slice($scores, 0, 100);

// Save back to file
if (file_put_contents($scoreFile, json_encode($scores, JSON_PRETTY_PRINT)) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save score']);
    exit();
}

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Score saved successfully',
    'position' => array_search($scoreData, $scores) + 1,
    'totalScores' => count($scores)
]);
?>
