#!/usr/bin/env python3
"""
🧪 Test Script - Kiểm tra Backend AI Pipeline
Gửi request tới API và xem response
"""

import requests
import cv2
import numpy as np
import json
import time
from pathlib import Path

API_URL = "http://localhost:8000"
FRAME_ENDPOINT = f"{API_URL}/monitoring/frame"
HEALTH_ENDPOINT = f"{API_URL}/monitoring/health"

# ANSI colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

def print_status(msg, status="INFO"):
    """Print formatted status message"""
    if status == "OK":
        print(f"{GREEN}✅ {msg}{RESET}")
    elif status == "ERROR":
        print(f"{RED}❌ {msg}{RESET}")
    elif status == "WARN":
        print(f"{YELLOW}⚠️  {msg}{RESET}")
    elif status == "INFO":
        print(f"{BLUE}ℹ️  {msg}{RESET}")

def test_health():
    """Test if backend is running"""
    print(f"\n{BLUE}{'='*50}{RESET}")
    print(f"{BLUE}1️⃣  Testing Backend Health{RESET}")
    print(f"{BLUE}{'='*50}{RESET}")
    
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
        print_status(f"Health Check: {response.json()}", "OK")
        return True
    except requests.ConnectionError:
        print_status(f"Cannot connect to {API_URL}", "ERROR")
        print_status("Start backend: cd Backend && uvicorn app.server:app --reload", "WARN")
        return False
    except Exception as e:
        print_status(f"Health check failed: {e}", "ERROR")
        return False

def create_test_frame(width=640, height=480):
    """Create a test frame with colored regions"""
    frame = np.ones((height, width, 3), dtype=np.uint8) * 255
    
    # Add some patterns
    frame[100:300, 100:300] = [0, 255, 0]  # Green rectangle
    frame[100:200, 350:450] = [255, 0, 0]  # Blue rectangle
    
    # Add text
    cv2.putText(frame, "Test Frame", (250, 240), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
    
    return frame

def test_frame_analysis():
    """Test single frame analysis"""
    print(f"\n{BLUE}{'='*50}{RESET}")
    print(f"{BLUE}2️⃣  Testing Frame Analysis{RESET}")
    print(f"{BLUE}{'='*50}{RESET}")
    
    # Create test frame
    frame = create_test_frame()
    print_status(f"Created test frame: {frame.shape}", "INFO")
    
    # Encode to JPG
    success, buffer = cv2.imencode('.jpg', frame)
    if not success:
        print_status("Failed to encode frame", "ERROR")
        return
    
    # Send to API
    files = {"file": ("frame.jpg", buffer.tobytes(), "image/jpeg")}
    
    print_status(f"Sending to {FRAME_ENDPOINT}", "INFO")
    
    try:
        start_time = time.time()
        response = requests.post(FRAME_ENDPOINT, files=files, timeout=30)
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print_status(f"API Response received in {elapsed:.2f}s", "OK")
            
            # Print results
            print(f"\n{BLUE}📊 Analysis Results:{RESET}")
            print(f"  Current Emotion: {result.get('current_emotion', 'N/A')}")
            print(f"  Positive Rate: {result.get('positive_rate', 0)}%")
            print(f"  Faces Detected: {len(result.get('faces', []))}")
            print(f"  Emotion Distribution: {json.dumps(result.get('emotion_distribution', {}), indent=4)}")
            
            return result
        else:
            print_status(f"API returned status {response.status_code}", "ERROR")
            print(f"  Response: {response.text}")
            return None
            
    except requests.Timeout:
        print_status("Request timeout (30s)", "ERROR")
        print_status("Backend might be processing the frame", "WARN")
    except Exception as e:
        print_status(f"Request failed: {e}", "ERROR")
        return None

def test_from_camera():
    """Test from webcam frames"""
    print(f"\n{BLUE}{'='*50}{RESET}")
    print(f"{BLUE}3️⃣  Testing From Webcam (3 frames){RESET}")
    print(f"{BLUE}{'='*50}{RESET}")
    
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print_status("Cannot open webcam", "ERROR")
            return
        
        print_status("Webcam opened successfully", "OK")
        
        for i in range(3):
            ret, frame = cap.read()
            if not ret:
                print_status("Failed to read frame from webcam", "ERROR")
                break
            
            # Encode frame
            success, buffer = cv2.imencode('.jpg', frame)
            if not success:
                continue
            
            # Send to API
            files = {"file": ("frame.jpg", buffer.tobytes(), "image/jpeg")}
            
            try:
                print_status(f"Frame {i+1}/3: Sending to API...", "INFO")
                start_time = time.time()
                response = requests.post(FRAME_ENDPOINT, files=files, timeout=15)
                elapsed = time.time() - start_time
                
                if response.status_code == 200:
                    result = response.json()
                    print_status(
                        f"Frame {i+1}: {result.get('current_emotion', 'N/A')} "
                        f"({result.get('positive_rate', 0)}%) - {elapsed:.2f}s", 
                        "OK"
                    )
                else:
                    print_status(f"Frame {i+1}: Status {response.status_code}", "ERROR")
                    
            except Exception as e:
                print_status(f"Frame {i+1}: Error - {e}", "ERROR")
            
            time.sleep(0.5)
        
        cap.release()
        
    except Exception as e:
        print_status(f"Webcam test failed: {e}", "ERROR")

def print_summary():
    """Print test summary"""
    print(f"\n{BLUE}{'='*50}{RESET}")
    print(f"{BLUE}📝 Test Summary{RESET}")
    print(f"{BLUE}{'='*50}{RESET}")
    
    print(f"""
{YELLOW}Backend Status:{RESET}
  - URL: {API_URL}
  - Health: {HEALTH_ENDPOINT}
  - Frame Analysis: {FRAME_ENDPOINT}

{YELLOW}What to check:{RESET}
  ✓ Backend is running
  ✓ Models are loaded
  ✓ API responds within 5-10 seconds
  ✓ Emotion detection works

{YELLOW}If tests fail:{RESET}
  1. Start backend: cd Backend && python -m uvicorn app.server:app --reload
  2. Check if models exist: ls DeepLearning/models/
  3. Check Python dependencies: pip install -r Backend/requirements.txt
  4. Check backend logs for errors

{YELLOW}Next step:{RESET}
  Once all tests pass, try the frontend:
  - npm run dev
  - Upload video or use webcam
  - Click "Start Detect"
  - Watch Network tab in DevTools
    """)

def main():
    """Run all tests"""
    print(f"\n{BLUE}🧪 Backend AI Pipeline Test Script{RESET}")
    
    # Test 1: Health
    if not test_health():
        print("\n" + "="*50)
        print("Cannot proceed without backend. Exiting.")
        return
    
    # Test 2: Frame analysis
    test_frame_analysis()
    
    # Test 3: Webcam (optional)
    try:
        test_from_camera()
    except KeyboardInterrupt:
        print_status("Webcam test cancelled", "INFO")
    
    # Summary
    print_summary()

if __name__ == "__main__":
    main()
