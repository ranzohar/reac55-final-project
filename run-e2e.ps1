# run-e2e.ps1
# Runs Cypress E2E tests against both backends in sequence.
# Assumes the REST API server is already running on port 3000.

$DEV_SERVER_PORT = 5173
$devServerProcess = $null
$overallExit = 0

function Wait-ForServer {
    Write-Host "Waiting for dev server on port $DEV_SERVER_PORT..."
    for ($i = 1; $i -le 30; $i++) {
        try {
            $null = Invoke-WebRequest -Uri "http://localhost:$DEV_SERVER_PORT" -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
            Write-Host "Dev server is up."
            return
        } catch {
            Start-Sleep -Seconds 1
        }
    }
    throw "ERROR: Dev server did not start within 30 seconds."
}

function Stop-DevServer {
    if ($null -ne $devServerProcess -and -not $devServerProcess.HasExited) {
        Write-Host "Stopping dev server (PID $($devServerProcess.Id))..."
        Stop-Process -Id $devServerProcess.Id -Force -ErrorAction SilentlyContinue
        $devServerProcess.WaitForExit(3000) | Out-Null
    }
    $script:devServerProcess = $null
}

try {
    # ── Round 1: Firebase ────────────────────────────────────────────────────
    Write-Host ""
    Write-Host "========================================="
    Write-Host " Round 1: Firebase backend"
    Write-Host "========================================="

    $devServerProcess = Start-Process -PassThru -NoNewWindow `
        -FilePath "cmd.exe" `
        -ArgumentList "/c", "npm", "run", "dev:firebase", "--", "--port", $DEV_SERVER_PORT

    Wait-ForServer

    Write-Host "Running Cypress (Firebase)..."
    npm run cy:run:firebase
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Firebase tests FAILED." -ForegroundColor Red
        $overallExit = 1
    } else {
        Write-Host "Firebase tests PASSED." -ForegroundColor Green
    }

    Stop-DevServer

    # ── Round 2: REST ────────────────────────────────────────────────────────
    Write-Host ""
    Write-Host "========================================="
    Write-Host " Round 2: REST backend"
    Write-Host "========================================="

    $devServerProcess = Start-Process -PassThru -NoNewWindow `
        -FilePath "cmd.exe" `
        -ArgumentList "/c", "npm", "run", "dev:rest", "--", "--port", $DEV_SERVER_PORT

    Wait-ForServer

    Write-Host "Running Cypress (REST)..."
    npm run cy:run:rest
    if ($LASTEXITCODE -ne 0) {
        Write-Host "REST tests FAILED." -ForegroundColor Red
        $overallExit = 1
    } else {
        Write-Host "REST tests PASSED." -ForegroundColor Green
    }

    Stop-DevServer

} finally {
    Stop-DevServer
}

# ── Summary ──────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================="
if ($overallExit -eq 0) {
    Write-Host " All E2E tests PASSED." -ForegroundColor Green
} else {
    Write-Host " One or more E2E test runs FAILED." -ForegroundColor Red
}
Write-Host "========================================="

exit $overallExit
