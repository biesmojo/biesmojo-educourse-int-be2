$body = @{
    title = "Intro to APIs"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/course" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json
