<?php
// Read scores from the JSON file
$scoreFile = __DIR__ . '/php/scores/scores.json';
$scores = [];

if (file_exists($scoreFile)) {
    $scores = json_decode(file_get_contents($scoreFile), true) ?? [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HCF Hunter - Leaderboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
    <style>
        .leaderboard-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .leaderboard-table th, 
        .leaderboard-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .leaderboard-table th {
            background-color: #4a90e2;
            color: white;
            font-weight: bold;
        }
        
        .leaderboard-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .leaderboard-table tr:hover {
            background-color: #e8f4fd;
        }
        
        .medal {
            font-weight: bold;
        }
        
        .gold { color: gold; }
        .silver { color: silver; }
        .bronze { color: #cd7f32; } /* bronze color */
        
        .back-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .back-button:hover {
            background-color: #357abd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="leaderboard-container">
        <h1>🏆 HCF Hunter Leaderboard</h1>
        
        <?php if (empty($scores)): ?>
            <p>No scores yet. Be the first to play and set a high score!</p>
        <?php else: ?>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($scores as $index => $score): ?>
                        <tr>
                            <td>
                                <?php if ($index === 0): ?>
                                    <span class="medal gold">🥇</span>
                                <?php elseif ($index === 1): ?>
                                    <span class="medal silver">🥈</span>
                                <?php elseif ($index === 2): ?>
                                    <span class="medal bronze">🥉</span>
                                <?php else: ?>
                                    <?= $index + 1 ?>
                                <?php endif; ?>
                            </td>
                            <td><?= htmlspecialchars($score['name']) ?></td>
                            <td><?= $score['level'] ?></td>
                            <td><?= number_format($score['score']) ?></td>
                            <td><?= date('M j, Y', strtotime($score['timestamp'])) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
        
        <a href="index.html" class="back-button">← Back to Game</a>
    </div>
</body>
</html>
