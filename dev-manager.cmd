@echo off
chcp 65001 >nul
title SOS Voz Feminina - Gerenciador de Desenvolvimento

:menu
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                SOS Voz Feminina - Dev Manager                ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  [1] 🚀 Iniciar Tudo (Backend + Frontend)                   ║
echo ║  [2] 🔄 Reiniciar Tudo                                       ║
echo ║  [3] 🛑 Parar Tudo                                           ║
echo ║  [4] 📊 Status dos Serviços                                  ║
echo ║  [5] 🌐 Abrir no Navegador                                   ║
echo ║  [6] 📝 Logs do Backend                                      ║
echo ║  [0] ❌ Sair                                                 ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

set /p choice="Escolha uma opção (0-6): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto restart_all
if "%choice%"=="3" goto stop_all
if "%choice%"=="4" goto status
if "%choice%"=="5" goto open_browser
if "%choice%"=="6" goto backend_logs
if "%choice%"=="0" goto exit
goto invalid

:start_all
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 INICIANDO TUDO                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Parando processos existentes...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Processos anteriores finalizados

echo.
echo [2/4] Iniciando Backend (porta 3000)...
start "SOS Backend" cmd /k "cd /d %~dp0backend && node server.js"
echo ✅ Backend iniciado
timeout /t 3 /nobreak >nul

echo.
echo [3/4] Iniciando Frontend (porta 8080)...
start "SOS Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo ✅ Frontend iniciado
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Verificando status...
call :check_status

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 TUDO INICIADO!                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📱 Frontend: http://localhost:8080
echo 🔧 Backend:  http://localhost:3000
echo.
pause
goto menu

:restart_all
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔄 REINICIANDO TUDO                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Parando todos os processos...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Processos finalizados
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Aguardando liberação de portas...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Reiniciando serviços...
goto start_all

:stop_all
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🛑 PARANDO TUDO                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Finalizando processos Node.js...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Processos Node.js finalizados
) else (
    echo ℹ️  Nenhum processo Node.js encontrado
)

echo.
echo [2/2] Finalizando janelas do terminal...
taskkill /f /fi "WINDOWTITLE eq SOS Backend*" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq SOS Frontend*" >nul 2>&1
echo ✅ Janelas do terminal finalizadas

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ TUDO PARADO!                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
pause
goto menu

:status
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📊 STATUS DOS SERVIÇOS                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

call :check_status

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📋 PROCESSOS ATIVOS                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

tasklist /fi "imagename eq node.exe" 2>nul | find /i "node.exe" >nul
if %errorlevel% == 0 (
    echo ✅ Processos Node.js encontrados:
    tasklist /fi "imagename eq node.exe"
) else (
    echo ❌ Nenhum processo Node.js ativo
)

echo.
pause
goto menu

:check_status
echo [Backend - Porta 3000]
netstat -an | findstr :3000 >nul
if %errorlevel% == 0 (
    echo ✅ Backend: RODANDO
) else (
    echo ❌ Backend: PARADO
)

echo.
echo [Frontend - Porta 8080]
netstat -an | findstr :8080 >nul
if %errorlevel% == 0 (
    echo ✅ Frontend: RODANDO
) else (
    echo ❌ Frontend: PARADO
)
goto :eof

:open_browser
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🌐 ABRINDO NAVEGADOR                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo Abrindo http://localhost:8080...
start http://localhost:8080
echo ✅ Navegador aberto

echo.
pause
goto menu

:backend_logs
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📝 LOGS DO BACKEND                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo Abrindo janela de logs do backend...
start "SOS Backend Logs" cmd /k "cd /d %~dp0backend && echo === LOGS DO BACKEND === && echo Pressione Ctrl+C para sair && echo. && node server.js"
echo ✅ Janela de logs aberta

echo.
pause
goto menu

:invalid
cls
echo.
echo ❌ Opção inválida! Escolha entre 0-6.
echo.
pause
goto menu

:exit
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    👋 ATÉ LOGO!                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Obrigado por usar o SOS Voz Feminina Dev Manager!
echo.
timeout /t 2 /nobreak >nul
exit
