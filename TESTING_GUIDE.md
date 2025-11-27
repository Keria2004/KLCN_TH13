# 🧪 Testing Guide - Hướng Dẫn Test Hệ Thống

## 📋 Mục Lục

1. [Setup Test Environment](#setup-test-environment)
2. [Test Cases - Webcam](#test-cases---webcam)
3. [Test Cases - Video Upload](#test-cases---video-upload)
4. [Test Cases - Analytics & Export](#test-cases---analytics--export)
5. [Test Cases - Reports](#test-cases---reports)
6. [Test Cases - Database](#test-cases---database)
7. [Troubleshooting](#troubleshooting)

---

## Setup Test Environment

### Requirements

```
✓ Backend chạy: http://localhost:8000
✓ Frontend chạy: http://localhost:5173
✓ Database đã migration
✓ Browser: Chrome/Firefox (latest)
✓ Camera hoặc video file sẵn sàng
```

### Pre-test Checklist

- [ ] Backend running (check http://localhost:8000/docs)
- [ ] Frontend running (check http://localhost:5173)
- [ ] Database connected (no errors in backend logs)
- [ ] Browser console open (F12)
- [ ] Camera permission allowed

---

## Test Cases - Webcam

### Test 1.1: Start Webcam

**Objective**: Xác minh webcam có thể khởi động

**Steps**:

1. Open http://localhost:5173
2. Go to "Monitor" tab
3. Click "Webcam" button

**Expected Result**:

- ✅ Camera preview appears
- ✅ Live video feeds
- ✅ No permission errors
- ✅ Console shows no errors

**Pass/Fail**: ****\_\_\_****

---

### Test 1.2: Start/Stop Detect (Webcam)

**Objective**: Kiểm tra xem emotion detection có hoạt động không

**Steps**:

1. Webcam đã chạy (Test 1.1 passed)
2. Click "Start Detect" button
3. Wait 10 seconds
4. Observe emotion display
5. Click "Stop Detect"

**Expected Result**:

- ✅ "Start Detect" → "Stop Detect" button changes
- ✅ Emotion label updates (Happy, Sad, etc.)
- ✅ Positive rate % displays (0-100%)
- ✅ Face count shows (1, 2, etc.)
- ✅ Console: "Sending frame to API" messages
- ✅ Console: "API Response" messages
- ✅ No red errors in console
- ✅ Stop Detect button works

**Performance**:

- Response time: ****\_**** ms
- Frames processed: ****\_****

**Pass/Fail**: ****\_\_\_****

---

### Test 1.3: Emotion Recognition Accuracy

**Objective**: Kiểm tra độ chính xác nhận diện cảm xúc

**Steps**:

1. Start Detect
2. Show different emotions to camera (smile, sad face, etc.)
3. Observe emotion label changes
4. Wait 20 seconds total

**Expected Result**:

- ✅ Happy emotion detected when smiling
- ✅ Neutral detected for normal face
- ✅ Emotion changes smoothly (not jerky)
- ✅ Positive rate correlates with happiness

**Accuracy Rate**: ****\_****%

**Pass/Fail**: ****\_\_\_****

---

### Test 1.4: End Session (Webcam)

**Objective**: Save session to database

**Steps**:

1. After Test 1.2, click "End Session" button
2. Check alert message
3. Check browser console

**Expected Result**:

- ✅ Alert shows: "Buổi học đã kết thúc"
- ✅ Alert shows frame count
- ✅ Alert shows "Dữ liệu đã lưu vào CSDL"
- ✅ Console shows: "Sending end_session to backend..."
- ✅ Console shows: "✅ Session saved to DB"
- ✅ No error messages
- ✅ Automatically switches to Analytics tab

**Backend Log Check**:

- POST request to /sessions/end_session: ✅ / ❌
- Response status: ****\_****

**Pass/Fail**: ****\_\_\_****

---

## Test Cases - Video Upload

### Test 2.1: Upload Video File

**Objective**: Kiểm tra upload video

**Steps**:

1. Go to "Monitor" tab
2. Click "Upload Video" button
3. Select a video file (MP4, AVI, WebM)
4. Video should load

**Expected Result**:

- ✅ File browser opens
- ✅ Video file selects
- ✅ Video preview appears
- ✅ Duration displays (e.g., "45s / 150s")
- ✅ No loading errors
- ✅ Play controls appear

**Video Info**:

- Filename: **********\_**********
- Duration: **\_** seconds
- Format: **********\_**********

**Pass/Fail**: ****\_\_\_****

---

### Test 2.2: Detect Emotions in Video

**Objective**: Xem emotion detection hoạt động với video

**Steps**:

1. Video uploaded (Test 2.1 passed)
2. Click "Start Detect"
3. Wait for video to process (15-30 seconds)
4. Observe emotion updates
5. Wait for video to end OR click "Stop Detect"

**Expected Result**:

- ✅ "Start Detect" changes to "Stop Detect"
- ✅ Emotions detected and displayed
- ✅ Positive rate updates
- ✅ Face count shows
- ✅ Timeline builds up with frames
- ✅ Chart updates in real-time
- ✅ No console errors

**Frames Detected**: ****\_****

**Pass/Fail**: ****\_\_\_****

---

### Test 2.3: End Session (Video)

**Objective**: Save video analysis session

**Steps**:

1. After Test 2.2, click "End Session"
2. Check alert and console

**Expected Result**:

- ✅ Alert shows session ended
- ✅ Shows total frames analyzed
- ✅ Console shows backend save success
- ✅ Switches to Analytics

**Frames Saved**: ****\_****

**Pass/Fail**: ****\_\_\_****

---

## Test Cases - Analytics & Export

### Test 3.1: Load Session in Analytics

**Objective**: Xem dữ liệu session trong Analytics

**Steps**:

1. After ending session (Test 1.4 or 2.3)
2. Should auto-switch to Analytics tab
3. See session data loaded

**Expected Result**:

- ✅ Session list shows recent sessions
- ✅ Emotion distribution chart displays
- ✅ Emotion over time chart displays
- ✅ Stats cards show (engagement, positive, etc.)
- ✅ No loading errors

**Pass/Fail**: ****\_\_\_****

---

### Test 3.2: Export as PDF

**Objective**: Generate PDF report

**Steps**:

1. Session loaded in Analytics (Test 3.1)
2. Click "📄 PDF" button
3. Wait for download
4. Open PDF file

**Expected Result**:

- ✅ PDF downloaded
- ✅ Filename format: "Class*Analytics*[id]\_[date].pdf"
- ✅ PDF opens successfully
- ✅ Contains session info
- ✅ Contains emotion statistics
- ✅ Contains performance metrics
- ✅ Contains teaching insights
- ✅ Professional formatting

**PDF Check**:

- File size: ****\_**** KB
- Has header: ✅ / ❌
- Has charts/tables: ✅ / ❌
- Readable: ✅ / ❌

**Pass/Fail**: ****\_\_\_****

---

### Test 3.3: Export as CSV

**Objective**: Generate CSV for Excel

**Steps**:

1. Session loaded in Analytics
2. Click "📊 CSV" button
3. Wait for download
4. Open in Excel/spreadsheet

**Expected Result**:

- ✅ CSV downloaded
- ✅ Filename: "Class*Analytics*[id]\_[date].csv"
- ✅ Excel opens file
- ✅ Data properly formatted
- ✅ Contains all emotion counts
- ✅ Contains session info
- ✅ Readable in spreadsheet

**CSV Check**:

- Headers present: ✅ / ❌
- Data rows: ****\_****
- Comma-separated: ✅ / ❌
- Opens in Excel: ✅ / ❌

**Pass/Fail**: ****\_\_\_****

---

### Test 3.4: Export as JSON

**Objective**: Export JSON for developers

**Steps**:

1. Session loaded in Analytics
2. Click "🔧 JSON" button
3. Wait for download
4. Check file content

**Expected Result**:

- ✅ JSON downloaded
- ✅ Filename: "Class*Analytics*[id]\_[date].json"
- ✅ Valid JSON format (no syntax errors)
- ✅ Contains session info
- ✅ Contains emotions object
- ✅ Contains metrics object

**JSON Check**:

- Valid JSON: ✅ / ❌
- Has session data: ✅ / ❌
- Has emotions: ✅ / ❌
- Has metrics: ✅ / ❌

**Pass/Fail**: ****\_\_\_****

---

## Test Cases - Reports

### Test 4.1: Load All Sessions

**Objective**: Reports page loads all sessions

**Steps**:

1. Go to "Reports" tab
2. Wait for sessions to load
3. Observe session list

**Expected Result**:

- ✅ Sessions list displays
- ✅ Shows date, subject, teacher
- ✅ Shows dominant emotion badges
- ✅ Shows positive rate %
- ✅ Shows frame count
- ✅ Shows duration
- ✅ Status badge (active/closed)
- ✅ No loading errors

**Sessions Count**: ****\_****

**Pass/Fail**: ****\_\_\_****

---

### Test 4.2: Filter by Subject

**Objective**: Test subject filter

**Steps**:

1. Reports page loaded (Test 4.1)
2. Click "Subject" dropdown
3. Select a subject
4. Observe table updates

**Expected Result**:

- ✅ Dropdown shows subjects
- ✅ Table filters by subject
- ✅ Only selected subject shown
- ✅ Results count updates
- ✅ All other data intact

**Results**: ****\_**** sessions

**Pass/Fail**: ****\_\_\_****

---

### Test 4.3: Filter by Status

**Objective**: Test status filter

**Steps**:

1. Reports page loaded
2. Click "Status" dropdown
3. Select "closed"
4. Observe table updates

**Expected Result**:

- ✅ Dropdown shows options (active/closed)
- ✅ Table filters by status
- ✅ Only selected status shown
- ✅ Results count updates

**Results**: ****\_**** sessions

**Pass/Fail**: ****\_\_\_****

---

### Test 4.4: Combine Filters

**Objective**: Test multiple filters together

**Steps**:

1. Subject: Select "Math"
2. Status: Select "closed"
3. Observe combined filter

**Expected Result**:

- ✅ Both filters apply
- ✅ Shows only Math closed sessions
- ✅ Results count accurate
- ✅ All filters independent

**Results**: ****\_**** sessions

**Pass/Fail**: ****\_\_\_****

---

### Test 4.5: Export All as PDF

**Objective**: Export all sessions as PDF

**Steps**:

1. Reports page loaded
2. Click "Export PDF" button
3. Wait for download
4. Open PDF

**Expected Result**:

- ✅ PDF downloaded
- ✅ Contains all sessions table
- ✅ Contains summary statistics
- ✅ Contains emotion distribution
- ✅ Professional formatting
- ✅ Page numbers
- ✅ Readable

**PDF Check**:

- Sessions in table: ****\_****
- Has summary: ✅ / ❌
- Has stats: ✅ / ❌
- Pages: ****\_****

**Pass/Fail**: ****\_\_\_****

---

### Test 4.6: Export All as CSV

**Objective**: Export all sessions as CSV

**Steps**:

1. Reports page loaded
2. Click "Export CSV" button
3. Wait for download
4. Open in Excel

**Expected Result**:

- ✅ CSV downloaded
- ✅ Contains all sessions
- ✅ Proper formatting
- ✅ Opens in Excel
- ✅ Sortable columns

**CSV Check**:

- Total rows: ****\_****
- Columns present: ✅ / ❌
- Data quality: **********\_**********

**Pass/Fail**: ****\_\_\_****

---

### Test 4.7: Summary Statistics

**Objective**: Check summary cards accuracy

**Steps**:

1. Reports page loaded
2. Scroll to bottom
3. Observe summary cards

**Expected Result**:

- ✅ "Total Sessions" card shows count
- ✅ "Avg Positive" shows percentage
- ✅ "Total Frames" shows number
- ✅ "Total Duration" shows hours
- ✅ Numbers are accurate

**Statistics**:

- Total Sessions: ****\_****
- Avg Positive: ****\_****%
- Total Frames: ****\_****
- Total Duration: ****\_**** hours

**Pass/Fail**: ****\_\_\_****

---

## Test Cases - Database

### Test 5.1: Session Data Saved

**Objective**: Verify session data in database

**Steps**:

```sql
-- Connect to PostgreSQL
psql -U postgres -d ptichcamxuc

-- Check latest session
SELECT id, subject, status, created_at, ended_at,
       duration_seconds, total_frames, emotion_summary
FROM sessions
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result**:

- ✅ Latest session appears
- ✅ status = 'closed' (if ended)
- ✅ ended_at has timestamp
- ✅ duration_seconds has value
- ✅ total_frames has value
- ✅ emotion_summary has JSON

**Data Check**:

- ID: ****\_****
- Subject: **********\_**********
- Frames: ****\_****
- Duration: ****\_**** seconds
- Emotion count: ****\_****

**Pass/Fail**: ****\_\_\_****

---

### Test 5.2: Emotion Readings Saved

**Objective**: Check emotion_readings table

**Steps**:

```sql
-- List recent readings
SELECT id, emotion, face_count, timestamp
FROM emotion_readings
WHERE session_id = [latest_session_id]
ORDER BY timestamp
LIMIT 10;

-- Count total readings
SELECT COUNT(*) as total_readings
FROM emotion_readings
WHERE session_id = [latest_session_id];
```

**Expected Result**:

- ✅ Readings exist for session
- ✅ Each row has emotion, face_count
- ✅ Timestamps in order
- ✅ Total count matches total_frames

**Readings Check**:

- Total readings: ****\_****
- Emotions present: **********\_**********
- First timestamp: **********\_**********
- Last timestamp: **********\_**********

**Pass/Fail**: ****\_\_\_****

---

### Test 5.3: Emotion Summary JSON

**Objective**: Verify emotion_summary format

**Steps**:

```sql
-- Get emotion summary
SELECT emotion_summary
FROM sessions
WHERE id = [session_id];

-- Should return: {"Happy": 15, "Neutral": 10, "Sad": 3, ...}
```

**Expected Result**:

- ✅ Valid JSON format
- ✅ All 7 emotions present
- ✅ Counts are integers
- ✅ Sum matches total_frames (approx)

**JSON Format**:

```json
{
  "Happy": _____,
  "Neutral": _____,
  "Sad": _____,
  "Angry": _____,
  "Surprise": _____,
  "Disgust": _____,
  "Fear": _____
}
```

**Pass/Fail**: ****\_\_\_****

---

### Test 5.4: API Response Check

**Objective**: Verify API response after end_session

**Steps**:

1. In browser console (F12):

```javascript
// Simulate end session
const testData = {
  session_id: "session_test_001",
  start_time: new Date(Date.now() - 60000).toISOString(),
  end_time: new Date().toISOString(),
  duration: 60,
  emotion_counts: { Happy: 10, Neutral: 5, Sad: 2 },
  timeline: [{ frame: 1, current_emotion: "Happy" }],
};

fetch("http://localhost:8000/sessions/end_session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testData),
})
  .then((r) => r.json())
  .then((data) => console.log("Response:", data))
  .catch((e) => console.error("Error:", e));
```

**Expected Result**:

- ✅ API returns 200 status
- ✅ Response has: status, message, session_id
- ✅ Response has: total_frames, emotion_summary, ended_at
- ✅ No errors

**API Response Check**:

- Status: ****\_****
- Session ID: ****\_****
- Frames: ****\_****
- Message: **********\_**********

**Pass/Fail**: ****\_\_\_****

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Network Error" when loading sessions

```
❌ Problem: Backend not running or not accessible
✅ Solution:
  1. Check backend running: http://localhost:8000/docs
  2. Check API_BASE_URL in FrontEnd/src/config/apiConfig.js
  3. Restart backend: uvicorn app.server:app --reload
  4. Clear browser cache: Ctrl+Shift+Delete
```

#### Issue: "Emotion not detected" / blank values

```
❌ Problem: Camera permission or model issue
✅ Solution:
  1. Allow camera permission in browser
  2. Check backend logs for model loading errors
  3. Verify camera works in other apps
  4. Try longer detect time (20+ seconds)
```

#### Issue: "Session not saved to database"

```
❌ Problem: Database connection or migration issue
✅ Solution:
  1. Check DB migration ran: psql ... \d sessions
  2. Verify all 5 new columns exist
  3. Check .env file database credentials
  4. Restart backend after migration
  5. Check backend logs for SQL errors
```

#### Issue: "PDF export fails"

```
❌ Problem: jsPDF not installed or memory issue
✅ Solution:
  1. Check jsPDF installed: npm list jspdf
  2. Reinstall: npm install jspdf jspdf-autotable
  3. Restart frontend: npm run dev
  4. Check browser console for errors
```

#### Issue: "CSV opens with wrong format"

```
❌ Problem: Excel encoding issue
✅ Solution:
  1. Open Excel → Data → From Text
  2. Select CSV file
  3. Choose UTF-8 encoding
  4. Finish import
```

---

## Test Summary Template

### Overall Results

```
Date: ___________________
Tester: ___________________
System: ___________________

Total Tests: 20
Passed: _________
Failed: _________
Skipped: _________

Pass Rate: _________%

Critical Issues: _________
Minor Issues: _________
```

### Issues Found

```
Issue #1: _____________________
  Severity: [Critical] [High] [Medium] [Low]
  Steps to Reproduce: _____________________
  Expected: _____________________
  Actual: _____________________
  Solution: _____________________

Issue #2: _____________________
  ...
```

### Sign-off

```
Test Lead: _____________________
Date: _____________________
Status: [Ready for Production] [Needs Fixes] [Hold]
```

---

## 🎯 Quick Test Checklist

**5-Minute Quick Test:**

- [ ] Test 1.1: Start Webcam
- [ ] Test 1.2: Start/Stop Detect
- [ ] Test 1.4: End Session
- [ ] Test 3.2: Export PDF
- [ ] Test 4.1: Load Sessions

**30-Minute Full Test:**

- [ ] All Webcam tests (1.1-1.4)
- [ ] All Video tests (2.1-2.3)
- [ ] All Analytics tests (3.1-3.4)
- [ ] All Reports tests (4.1-4.7)
- [ ] Database verification (5.1-5.2)

**Database Deep Dive:**

- [ ] All Database tests (5.1-5.4)
- [ ] Manual SQL verification
- [ ] Data integrity checks
- [ ] Performance metrics

---

**Last Updated**: November 27, 2024  
**Version**: 2.0  
**Status**: Ready for Testing
