#!/usr/bin/env python3
"""
Smart Classroom - Emotion Monitoring System
Build and Setup Script
"""

import subprocess
import sys
import os
from pathlib import Path

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def run_command(cmd, cwd=None, shell=False):
    """Run a command and handle errors"""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            shell=shell,
            capture_output=False,
            text=True
        )
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return False

def setup_backend():
    """Setup Backend environment"""
    print_header("Setting up Backend")
    
    backend_path = Path("Backend")
    if not backend_path.exists():
        print("❌ Backend folder not found!")
        return False
    
    # Create virtual environment
    print("📦 Creating virtual environment...")
    if not run_command([sys.executable, "-m", "venv", "env"], cwd=backend_path):
        print("❌ Failed to create virtual environment")
        return False
    
    # Detect OS and activate script
    if sys.platform == "win32":
        activate_cmd = "env\\Scripts\\activate.bat"
        pip_path = "env\\Scripts\\pip"
    else:
        activate_cmd = "source env/bin/activate"
        pip_path = "env/bin/pip"
    
    # Install requirements
    print("📥 Installing Python packages...")
    if not run_command([pip_path, "install", "-r", "requirements.txt"], cwd=backend_path):
        print("❌ Failed to install dependencies")
        return False
    
    print("✅ Backend setup complete!")
    print(f"\n📝 To activate backend environment:")
    print(f"   cd Backend")
    print(f"   {activate_cmd}")
    print(f"\n🚀 To start backend server:")
    print(f"   uvicorn app.server:app --reload --host 0.0.0.0 --port 8000")
    
    return True

def setup_frontend():
    """Setup Frontend environment"""
    print_header("Setting up Frontend")
    
    frontend_path = Path("FrontEnd")
    if not frontend_path.exists():
        print("❌ FrontEnd folder not found!")
        return False
    
    # Check if npm is installed
    try:
        subprocess.run(["npm", "--version"], capture_output=True, check=True)
    except:
        print("❌ npm is not installed. Please install Node.js first!")
        return False
    
    # Install dependencies
    print("📥 Installing Node packages...")
    if not run_command(["npm", "install"], cwd=frontend_path):
        print("❌ Failed to install dependencies")
        return False
    
    print("✅ Frontend setup complete!")
    print(f"\n🚀 To start frontend dev server:")
    print(f"   cd FrontEnd")
    print(f"   npm run dev")
    
    return True

def verify_models():
    """Verify Deep Learning models exist"""
    print_header("Verifying Deep Learning Models")
    
    model_dir = Path("DeepLearning/models")
    required_models = [
        "face_detection.pt",
        "fer_YOLOv1.pt",
        "fer2013_mini_XCEPTION.102-0.66.hdf5"
    ]
    
    all_exist = True
    for model in required_models:
        model_path = model_dir / model
        if model_path.exists():
            print(f"✅ {model} - Found")
        else:
            print(f"❌ {model} - Missing")
            all_exist = False
    
    if not all_exist:
        print("\n⚠️  Some models are missing. Download them from the project repository.")
    else:
        print("\n✅ All models verified!")
    
    return all_exist

def print_usage():
    """Print usage information"""
    print_header("Smart Classroom - Setup Complete!")
    
    print("""
📚 QUICK START GUIDE

1. Start Backend Server (Terminal 1):
   ────────────────────────────────
   cd Backend
   .\env\Scripts\activate              # Windows
   source env/bin/activate              # Linux/Mac
   uvicorn app.server:app --reload --host 0.0.0.0 --port 8000

2. Start Frontend Dev Server (Terminal 2):
   ────────────────────────────────────
   cd FrontEnd
   npm run dev

3. Open Browser:
   ───────────────
   Navigate to: http://localhost:5173

4. API Documentation:
   ──────────────────
   Swagger UI: http://localhost:8000/docs
   ReDoc:      http://localhost:8000/redoc

📝 DEFAULT CREDENTIALS (for demo):
   ──────────────────────────────
   Any username/password will work (demo mode)

🔗 API BASE URL:
   ──────────────
   http://localhost:8000

💡 TIPS:
   ─────
   - Keep both servers running
   - Check browser console (F12) for errors
   - Check terminal for backend logs
   - Camera requires HTTPS or localhost
   - Supported video formats: MP4, AVI, MOV

📖 Full documentation: see SETUP_GUIDE.md
    """)

def main():
    """Main setup process"""
    print("\n" + "="*60)
    print("  Smart Classroom - Emotion Monitoring System")
    print("  Setup & Build Script")
    print("="*60)
    
    print("\nChoose setup option:")
    print("1. Full setup (Backend + Frontend)")
    print("2. Backend only")
    print("3. Frontend only")
    print("4. Verify models only")
    print("0. Exit")
    
    choice = input("\nEnter choice (0-4): ").strip()
    
    if choice == "0":
        print("👋 Goodbye!")
        return
    
    success = True
    
    if choice in ["1", "2"]:
        success = setup_backend() and success
    
    if choice in ["1", "3"]:
        success = setup_frontend() and success
    
    if choice in ["1", "4"]:
        verify_models()
    
    if success:
        print_usage()
    else:
        print("\n❌ Setup encountered some errors. Please check above for details.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Setup cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
