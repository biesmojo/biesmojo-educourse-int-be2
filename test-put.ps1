$body = @{
    title = "Data Analyst Pro"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/course/1" -Method Put -Body $body -ContentType "application/json"
$response | ConvertTo-Json
