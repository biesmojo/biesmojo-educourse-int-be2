$response = Invoke-RestMethod -Uri "http://localhost:3000/course/1" -Method Delete
$response | ConvertTo-Json
