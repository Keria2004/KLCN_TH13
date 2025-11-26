#!/usr/bin/env python3
"""
Test script for Session End workflow
Test: Create session -> Collect emotion data -> End session -> Verify DB save
"""

import requests
import json
from datetime import datetime, timedelta

API_BASE_URL = "http://localhost:8000"

def test_end_session_workflow():
    """Test complete session end workflow"""
    
    print("=" * 60)
    print("🧪 TEST: Session End Workflow")
    print("=" * 60)
    
    # Simulate session data from frontend
    session_start_time = datetime.now() - timedelta(minutes=5)
    session_end_time = datetime.now()
    
    session_data = {
        "session_id": f"session_{int(session_start_time.timestamp() * 1000)}",
        "start_time": session_start_time.isoformat(),
        "end_time": session_end_time.isoformat(),
        "duration": int((session_end_time - session_start_time).total_seconds()),
        "emotion_counts": {
            "Happy": 15,
            "Neutral": 10,
            "Sad": 3,
            "Angry": 2,
            "Surprise": 1,
            "Disgust": 0,
            "Fear": 0
        },
        "timeline": [
            {
                "frame": 1,
                "timestamp": (session_start_time).isoformat(),
                "current_emotion": "Happy",
                "positive_rate": 85,
                "faces": 1,
                "emotion_distribution": {"Happy": 85, "Neutral": 10, "Sad": 5}
            },
            {
                "frame": 2,
                "timestamp": (session_start_time + timedelta(seconds=0.3)).isoformat(),
                "current_emotion": "Neutral",
                "positive_rate": 50,
                "faces": 1,
                "emotion_distribution": {"Happy": 40, "Neutral": 60}
            },
            {
                "frame": 3,
                "timestamp": (session_start_time + timedelta(seconds=0.6)).isoformat(),
                "current_emotion": "Happy",
                "positive_rate": 90,
                "faces": 1,
                "emotion_distribution": {"Happy": 90, "Neutral": 10}
            },
        ]
    }
    
    print("\n📤 Sending session end request...")
    print(f"Session ID: {session_data['session_id']}")
    print(f"Duration: {session_data['duration']}s")
    print(f"Total frames: {len(session_data['timeline'])}")
    print(f"Emotion counts: {session_data['emotion_counts']}")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/sessions/end_session",
            json=session_data,
            timeout=10
        )
        
        print(f"\n📨 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Session end successful!")
            print(f"   - Session ID: {result.get('session_id')}")
            print(f"   - Total frames: {result.get('total_frames')}")
            print(f"   - Emotion summary: {result.get('emotion_summary')}")
            print(f"   - Ended at: {result.get('ended_at')}")
            
            # Get session details to verify
            session_id = result.get('session_id')
            print(f"\n🔍 Verifying session {session_id} in database...")
            
            verify_response = requests.get(
                f"{API_BASE_URL}/sessions/{session_id}",
                timeout=10
            )
            
            if verify_response.status_code == 200:
                session_info = verify_response.json()
                print("✅ Session verification successful!")
                print(f"   - Status: {session_info.get('status')}")
                print(f"   - Created at: {session_info.get('created_at')}")
                print(f"   - Ended at: {session_info.get('ended_at')}")
                print(f"   - Duration: {session_info.get('duration_seconds')}s")
                print(f"   - Total frames: {session_info.get('total_frames')}")
                print(f"   - Emotion summary: {session_info.get('emotion_summary')}")
                
                return True
            else:
                print(f"❌ Verification failed: {verify_response.status_code}")
                print(f"   Response: {verify_response.text}")
                return False
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Cannot reach backend")
        print(f"   Make sure backend is running at {API_BASE_URL}")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_emotion_readings():
    """Test if emotion readings were saved"""
    print("\n" + "=" * 60)
    print("🧪 TEST: Verify Emotion Readings in Database")
    print("=" * 60)
    
    # Get a recent session
    try:
        response = requests.get(
            f"{API_BASE_URL}/sessions/recent_classes",
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            sessions = result.get("data", [])
            
            if sessions:
                latest_session = sessions[0]
                session_id = latest_session.get("id")
                
                print(f"\n📊 Latest session: {session_id}")
                print(f"   Subject: {latest_session.get('subject')}")
                
                # Get emotion readings for this session
                readings_response = requests.get(
                    f"{API_BASE_URL}/readings/{session_id}",
                    timeout=10
                )
                
                if readings_response.status_code == 200:
                    readings = readings_response.json()
                    print(f"   Emotion readings: {len(readings)}")
                    
                    for i, reading in enumerate(readings[:5]):  # Show first 5
                        print(f"     [{i+1}] {reading.get('emotion')} - {reading.get('timestamp')}")
                    
                    if len(readings) > 5:
                        print(f"     ... and {len(readings) - 5} more")
                    
                    return True
                else:
                    print(f"   ⚠️ Could not fetch readings: {readings_response.status_code}")
                    return False
            else:
                print("⚠️ No sessions found")
                return False
        else:
            print(f"❌ Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


if __name__ == "__main__":
    print("\n🚀 Starting Session End Workflow Tests\n")
    
    # Run tests
    test1_passed = test_end_session_workflow()
    test2_passed = test_emotion_readings()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    print(f"Test 1 (End Session): {'✅ PASSED' if test1_passed else '❌ FAILED'}")
    print(f"Test 2 (Emotion Readings): {'✅ PASSED' if test2_passed else '❌ FAILED'}")
    
    if test1_passed and test2_passed:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️ Some tests failed - check errors above")
