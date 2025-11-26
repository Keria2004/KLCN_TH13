# 🧪 Testing Guide - Live Monitoring & Real-time Emotion Detection

## ✅ Pre-requisites

- [x] Backend running: `http://localhost:8000`
- [x] Frontend running: `http://localhost:5173`
- [x] Webcam/Camera available
- [x] Test video file ready

---

## 🎬 Test Cases

### Test 1: Webcam Real-time Monitoring

**Purpose:** Verify webcam stream and real-time emotion detection

**Steps:**

1. Open `http://localhost:5173`
2. Login with any credentials
3. Click "Giám sát" (Monitor)
4. Make sure you're on "Live Monitoring" tab
5. Click "🎥 Start Webcam"
6. Show emotions to camera (smile, angry, neutral, etc.)
7. Check if emotions update in real-time

**Expected Results:**

- ✅ Webcam video displays in player
- ✅ "Current Emotion" updates every 500ms
- ✅ "Positive Rate" changes based on expressions
- ✅ "Faces Detected" shows correct count
- ✅ "Emotion Distribution" chart updates

**Pass/Fail:** \_\_\_

---

### Test 2: Video File Upload

**Purpose:** Verify video file can be uploaded and played

**Steps:**

1. Click "📹 Upload Video" button
2. Select a test video (MP4 recommended)
3. Video should auto-play
4. Check video player shows video content
5. Check timer shows: "0:00 / X:XX"

**Expected Results:**

- ✅ File dialog opens
- ✅ Video plays in the same player
- ✅ Duration displays correctly
- ✅ Video progress updates

**Pass/Fail:** \_\_\_

---

### Test 3: Real-time Analysis During Video

**Purpose:** Verify emotion detection works while video is playing

**Steps:**

1. Upload a video
2. Watch video play
3. Observe emotion updates
4. Check faces are detected throughout

**Expected Results:**

- ✅ Emotion updates every 300ms during video
- ✅ Positive rate changes with frames
- ✅ Face count updates
- ✅ Emotion distribution changes

**Pass/Fail:** \_\_\_

---

### Test 4: Timeline Data Collection

**Purpose:** Verify data is collected during streaming

**Steps:**

1. Start webcam or upload video
2. Let it run for ~30 seconds
3. Check if "Export [N] frames to Analytics" button appears
4. Verify N > 0

**Expected Results:**

- ✅ Export button appears after first frame
- ✅ Frame count increases over time
- ✅ Button shows correct frame count

**Pass/Fail:** \_\_\_

---

### Test 5: Export to Analytics

**Purpose:** Verify timeline can be exported to analytics

**Steps:**

1. Complete webcam or video analysis
2. Click "📊 Export [N] frames to Analytics"
3. Should see alert: "Exported X frames to Analytics!"
4. Should auto-switch to "Analytics" tab
5. Check analytics displays correctly

**Expected Results:**

- ✅ Alert shows with correct count
- ✅ Tab automatically switches
- ✅ Analytics page loads with data
- ✅ Charts display with data

**Pass/Fail:** \_\_\_

---

### Test 6: Analytics Dashboard

**Purpose:** Verify analytics displays correctly

**Steps:**

1. Export data from webcam/video
2. Check all components render:
   - [ ] Summary stats (3 cards)
   - [ ] Teaching insights box
   - [ ] Bar chart
   - [ ] Pie chart
   - [ ] Line chart
3. Check data accuracy

**Expected Results:**

- ✅ All components display
- ✅ Charts have correct data
- ✅ Numbers match timeline
- ✅ Insights make sense

**Pass/Fail:** \_\_\_

---

### Test 7: Stop Streaming

**Purpose:** Verify streaming can be stopped cleanly

**Steps:**

1. Start webcam/video
2. Let it run for ~5 seconds
3. Click "Stop" button
4. Check if stream stops
5. Check if export button still visible

**Expected Results:**

- ✅ Stream stops immediately
- ✅ Video player freezes
- ✅ No more emotion updates
- ✅ Export button remains clickable

**Pass/Fail:** \_\_\_

---

### Test 8: Video Formats

**Purpose:** Verify different video formats work

**Test each format:**

| Format | File       | Result |
| ------ | ---------- | ------ |
| MP4    | video.mp4  | **\_** |
| AVI    | video.avi  | **\_** |
| MOV    | video.mov  | **\_** |
| WebM   | video.webm | **\_** |

**Expected Results:**

- ✅ All formats play
- ✅ Emotion detection works
- ✅ Timeline collects data

**Pass/Fail:** \_\_\_

---

### Test 9: Multiple Sessions

**Purpose:** Verify multiple sessions don't interfere

**Steps:**

1. Start webcam, let it run 10 seconds
2. Export to analytics
3. Go back to Live Monitoring
4. Start another webcam session, 10 seconds
5. Export to analytics again
6. Check second analytics has only second session data

**Expected Results:**

- ✅ Second export doesn't include first session
- ✅ Clear separation between sessions
- ✅ Old data doesn't mix with new

**Pass/Fail:** \_\_\_

---

### Test 10: Long Duration

**Purpose:** Verify system handles long videos

**Steps:**

1. Upload a video 5+ minutes long
2. Let it play for 2-3 minutes
3. Check performance
4. Check memory usage
5. Export data

**Expected Results:**

- ✅ No lag or freezing
- ✅ Consistent frame rate
- ✅ Export works with many frames
- ✅ Analytics loads quickly

**Pass/Fail:** \_\_\_

---

### Test 11: Edge Cases

#### A: Empty Video (0 seconds)

- Upload empty/corrupt video
- **Expected:** Error or graceful handling
- **Pass/Fail:** \_\_\_

#### B: Very Large File (>500MB)

- Try to upload large video
- **Expected:** File dialog limits or error
- **Pass/Fail:** \_\_\_

#### C: No Faces in Video

- Play video with no people
- **Expected:** Face count = 0, but analysis continues
- **Pass/Fail:** \_\_\_

#### D: Low Light Conditions

- Webcam in dark room
- **Expected:** Still detects emotions or warns
- **Pass/Fail:** \_\_\_

---

### Test 12: Backend Connectivity

#### A: Backend Offline

- Stop backend server
- Try to use Live Monitoring
- **Expected:** Error message displayed
- **Pass/Fail:** \_\_\_

#### B: Network Timeout

- Slow network simulation
- Try to export
- **Expected:** Timeout handling
- **Pass/Fail:** \_\_\_

---

## 📊 Performance Benchmarks

| Metric                    | Expected      | Actual |
| ------------------------- | ------------- | ------ |
| Frame analysis latency    | <100ms        | **\_** |
| Webcam FPS                | ~2fps (500ms) | **\_** |
| Video analysis FPS        | ~3fps (300ms) | **\_** |
| Memory usage (10min)      | <200MB        | **\_** |
| Export time (1000 frames) | <1s           | **\_** |
| Analytics load time       | <2s           | **\_** |

---

## 🐛 Issues Found

### Issue #1

- **Description:** ********\_\_\_********
- **Steps to Reproduce:** ********\_\_\_********
- **Expected:** ********\_\_\_********
- **Actual:** ********\_\_\_********
- **Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low
- **Status:** [ ] Open [ ] Fixed [ ] Closed

### Issue #2

- **Description:** ********\_\_\_********
- **Steps to Reproduce:** ********\_\_\_********
- **Expected:** ********\_\_\_********
- **Actual:** ********\_\_\_********
- **Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low
- **Status:** [ ] Open [ ] Fixed [ ] Closed

---

## ✅ Sign-off

| Role      | Name         | Date         | Signature    |
| --------- | ------------ | ------------ | ------------ |
| Tester    | ****\_\_**** | ****\_\_**** | ****\_\_**** |
| Developer | ****\_\_**** | ****\_\_**** | ****\_\_**** |
| QA Lead   | ****\_\_**** | ****\_\_**** | ****\_\_**** |

---

## 📝 Notes

```
[Space for additional notes, observations, or comments]




```

---

**Testing Date:** ****\_\_\_****  
**Tester Name:** ****\_\_\_****  
**Overall Status:** [ ] PASS [ ] FAIL [ ] CONDITIONAL PASS

---

## 🎉 Final Checklist

- [ ] All test cases completed
- [ ] Issues documented
- [ ] Performance acceptable
- [ ] Ready for production
- [ ] Sign-off obtained
