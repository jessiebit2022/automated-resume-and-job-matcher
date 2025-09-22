#!/bin/bash

# Automated Resume Parser & Job Matcher - Startup Script
# Author: Jessie Borras
# Website: jessiedev.xyz

echo "🚀 Starting Automated Resume Parser & Job Matcher..."
echo "=================================================="

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js (v16 or higher) from https://nodejs.org/"
    exit 1
fi

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python: $PYTHON_VERSION${NC}"
elif command_exists python; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓ Python: $PYTHON_VERSION${NC}"
    alias python3=python
else
    echo -e "${RED}✗ Python is not installed${NC}"
    echo "Please install Python (v3.8 or higher) from https://python.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Setting up project dependencies...${NC}"

# Setup Frontend
echo -e "${YELLOW}Setting up React frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
cd ..

# Setup API
echo -e "${YELLOW}Setting up Express API...${NC}"
cd api
if [ ! -d "node_modules" ]; then
    echo "Installing API dependencies..."
    npm install
fi
cd ..

# Setup Python Backend
echo -e "${YELLOW}Setting up Python backend...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm 2>/dev/null || echo "spaCy model download failed - will retry during runtime"

cd ..

echo ""
echo -e "${BLUE}Checking ports...${NC}"

# Check if ports are available
if port_in_use 3000; then
    echo -e "${YELLOW}⚠ Port 3000 is already in use (Frontend)${NC}"
fi

if port_in_use 8000; then
    echo -e "${YELLOW}⚠ Port 8000 is already in use (API)${NC}"
fi

if port_in_use 5000; then
    echo -e "${YELLOW}⚠ Port 5000 is already in use (Python Backend)${NC}"
fi

echo ""
echo -e "${GREEN}Starting all services...${NC}"
echo "================================"

# Create log directory
mkdir -p logs

# Start Python Backend
echo -e "${YELLOW}Starting Python Backend (Port 5000)...${NC}"
cd backend
source venv/bin/activate || . venv/Scripts/activate
python main.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 3

# Start Express API
echo -e "${YELLOW}Starting Express API (Port 8000)...${NC}"
cd api
npm start > ../logs/api.log 2>&1 &
API_PID=$!
cd ..
sleep 2

# Start React Frontend
echo -e "${YELLOW}Starting React Frontend (Port 3000)...${NC}"
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo "======================================"
echo ""
echo -e "${BLUE}Service URLs:${NC}"
echo "• Frontend:      http://localhost:3000"
echo "• API:          http://localhost:8000"
echo "• Python Backend: http://localhost:5000"
echo ""
echo -e "${BLUE}Health Checks:${NC}"
echo "• API Health:   http://localhost:8000/health"
echo "• Backend Health: http://localhost:5000/health"
echo ""
echo -e "${YELLOW}Process IDs:${NC}"
echo "• Backend PID:  $BACKEND_PID"
echo "• API PID:      $API_PID"  
echo "• Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "• Backend:      tail -f logs/backend.log"
echo "• API:          tail -f logs/api.log"
echo "• Frontend:     tail -f logs/frontend.log"
echo ""
echo -e "${RED}To stop all services, run:${NC}"
echo "kill $BACKEND_PID $API_PID $FRONTEND_PID"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"