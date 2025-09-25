# Script de prueba para el módulo Técnico - OPTICOREAPI

$baseUrl = "http://localhost:3001/api/tecnicos"

Write-Host "`n=== Listar todos los técnicos ===`n"
Invoke-RestMethod -Uri $baseUrl -Method Get

Write-Host "`n=== Crear un nuevo técnico ===`n"
$nuevoTecnico = @{
    nombre = "Juan Pérez"
    telefono = "5551234567"
    mercado = "Estado de México"  # Usa "Estado de Mexico" si hay problemas de acento
} 
$responseCreate = Invoke-RestMethod -Uri $baseUrl -Method Post -Body ($nuevoTecnico | ConvertTo-Json -Compress) -ContentType "application/json"
$responseCreate | Format-List

# Guardamos el ID del técnico recién creado
$idTecnico = $responseCreate._id

Write-Host "`n=== Actualizar tickets del técnico ===`n"
$updateTickets = @{
    incremento = 1
}
Invoke-RestMethod -Uri "$baseUrl/$idTecnico/ticket" -Method Patch -Body ($updateTickets | ConvertTo-Json -Compress) -ContentType "application/json"

Write-Host "`n=== Verificar cambios del técnico ===`n"
Invoke-RestMethod -Uri "$baseUrl/$idTecnico" -Method Get | Format-List

Write-Host "`n=== Eliminar el técnico creado ===`n"
Invoke-RestMethod -Uri "$baseUrl/$idTecnico" -Method Delete

Write-Host "`n=== Listar técnicos finales ===`n"
Invoke-RestMethod -Uri $baseUrl -Method Get
