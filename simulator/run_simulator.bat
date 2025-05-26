@echo off
set VENV_DIR=.venv

:: Verifica se a pasta do ambiente virtual existe
if not exist %VENV_DIR% (
    echo [INFO] Criando ambiente virtual...
    python -m venv %VENV_DIR%
)

:: Ativa o ambiente virtual
call %VENV_DIR%\Scripts\activate.bat

:: Instala dependências se necessário
echo [INFO] Instalando dependências (paho-mqtt)...
pip install --quiet paho-mqtt

:: Executa o script Python
echo [INFO] A iniciar simulador ESP32...
python esp32_sim.py

:: Desativa o ambiente virtual ao terminar
deactivate
