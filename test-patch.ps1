$body = @{
    title = "Updated Course Title"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/course/1" -Method Patch -Body $body -ContentType "application/json"
$response | ConvertTo-Json
