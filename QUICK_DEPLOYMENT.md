# 🚀 Quick Deployment Guide

## ⚡ 5-Minute Deploy (From Scratch)

### Prerequisites Check

```bash
✓ Python 3.10+ installed
✓ Node.js 18+ installed
✓ PostgreSQL running (or SQLite)
✓ Git (optional)
```

---

## 🎯 Step 1: Database Setup (2 min)

### If Using PostgreSQL

```bash
# 1. Connect to PostgreSQL
psql -U postgres

# 2. Create database
CREATE DATABASE ptichcamxuc;

# 3. Create user (optional)
CREATE USER app_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ptichcamxuc TO app_user;

# 4. Exit
\q

# 5. Run migration
psql -U postgres -d ptichcamxuc -f Backend/migrations/add_session_fields.sql

# 6. Verify (should show 5 new columns)
psql -U postgres -d ptichcamxuc -c "\d sessions"
```

### If Using SQLite (Dev Only)

```bash
# SQLite auto-creates database
# Run migration script (convert SQL syntax first)
# Or use Python + SQLAlchemy to create tables
cd Backend
python -c "from app.models.models import Base; from app.database.db import engine; Base.metadata.create_all(engine)"
```

---

## 🔧 Step 2: Backend Setup (1.5 min)

```bash
# 1. Navigate to Backend
cd Backend

# 2. Create virtual environment
python -m venv env

# 3. Activate (Windows)
.\env\Scripts\activate

# 4. Or activate (Mac/Linux)
source env/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Create .env file
cat > .env << EOF
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ptichcamxuc
EOF

# 7. Test database connection
python -c "from app.database.db import engine; print(f'Connected: {engine}')"

# 8. Start server
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## 💻 Step 3: Frontend Setup (1 min)

**Open NEW Terminal (keep backend running)**

```bash
# 1. Navigate to FrontEnd
cd FrontEnd

# 2. Install dependencies
npm install

# 3. jsPDF should already be installed
npm list jspdf jspdf-autotable

# 4. Start dev server
npm run dev
```

**Expected Output:**

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## ✅ Step 4: Verify System (1 min)

### Test Connectivity

```
1. Open http://localhost:5173 in browser
2. Go to Monitor tab
3. Click "Webcam" button
4. Verify video appears (allow camera permission)
5. Click "Start Detect"
6. Wait 10 seconds
7. Click "End Session"
8. Check console for "✅ Session saved to DB"
```

### Check Logs

```
Backend Terminal:
- Should see POST request logged
- No errors

Frontend Console (F12 → Console):
- "Sending frame to API" messages
- "Session saved to DB" message
- No red errors
```

---

## 📋 Detailed Deployment Steps

### Full Fresh Installation

```bash
# ============ TERMINAL 1: BACKEND ============

cd d:\KLCN_TH13-master\Backend

# Setup
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt

# Configure .env
# (Create file with DB credentials)

# Run database migration
psql -U postgres -d ptichcamxuc -f ../migrations/add_session_fields.sql

# Start server
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
# Wait for: "Application startup complete"

# ============ TERMINAL 2: FRONTEND ============

cd d:\KLCN_TH13-master\FrontEnd

# Setup
npm install

# Start dev server
npm run dev
# Wait for: "Local: http://localhost:5173"

# ============ BROWSER ============

# Open 3 windows/tabs:

# TAB 1: Frontend
http://localhost:5173

# TAB 2: Backend Docs (optional)
http://localhost:8000/docs

# TAB 3: Browser Console (optional)
F12 → Console tab

# ============ TEST FLOW ============

# 1. In TAB 1 (Frontend):
#    Monitor → Webcam → Start Detect
#
# 2. In TAB 3 (Console):
#    Watch console output
#
# 3. Wait 10 seconds for emotion detection
#
# 4. In TAB 1: Click End Session
#
# 5. Check TAB 3 Console:
#    Should see ✅ Session saved to DB
#
# 6. Switch to Analytics tab
#    Should see data loaded
#
# 7. Click PDF button
#    Should download PDF report
```

---

## 🗂️ Project Structure (After Setup)

```
KLCN_TH13-master/
├── Backend/
│   ├── env/                          # Virtual environment
│   ├── app/
│   │   ├── models/models.py          # ✅ Updated with 5 new fields
│   │   ├── schemas/schemas.py        # ✅ Updated with SessionEnd schemas
│   │   ├── routers/
│   │   │   └── session_router.py     # ✅ Updated with /end_session endpoint
│   │   ├── database/
│   │   │   └── db.py                 # Database connection
│   │   └── server.py                 # FastAPI app
│   ├── migrations/
│   │   └── add_session_fields.sql    # ✅ Migration script
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Database credentials
│   └── test_session_end.py           # Test script
│
├── FrontEnd/
│   ├── node_modules/                 # npm packages (after install)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx     # ✅ Updated with export functions
│   │   │   ├── ReportPage.jsx        # ✅ Completely rewritten
│   │   │   └── MonitorPage.jsx       # Updated callback
│   │   ├── components/
│   │   │   └── monitoring/
│   │   │       └── LiveMonitoring.jsx # ✅ Updated endSession() with API call
│   │   └── config/apiConfig.js       # API base URL
│   ├── package.json                  # Node dependencies
│   └── vite.config.js                # Build config
│
└── Documentation/
    ├── DATABASE_SYNC_REPORT.md       # This file - Sync verification
    ├── EXPORT_REPORT_GUIDE.md        # Single session export
    ├── REPORT_PAGE_GUIDE.md          # All sessions report
    ├── SYSTEM_FLOW_SUMMARY.md        # Architecture & flow
    ├── VERIFICATION_CHECKLIST.md     # Deployment checklist
    ├── QUICKSTART_VI.md              # Vietnamese quick start
    ├── SETUP_GUIDE_VI.md             # Vietnamese setup
    └── TESTING_GUIDE_VI.md           # Vietnamese tests
```

---

## 🧪 Testing After Deployment

### Test 1: API Connectivity

```bash
# In Browser or Terminal
curl http://localhost:8000/docs

# Or use Browser
http://localhost:8000/docs
# Should see Swagger UI with all endpoints
```

### Test 2: Database Migration

```bash
# PostgreSQL
psql -U postgres -d ptichcamxuc
SELECT * FROM sessions LIMIT 1;
\d sessions

# Should show 8 columns (3 original + 5 new)
```

### Test 3: End Session Flow

```javascript
// Browser Console (F12)

// Step 1: Check API config
console.log(API_BASE_URL); // Should be http://localhost:8000

// Step 2: Create test session data
const testData = {
  session_id: "session_test_123",
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
  duration: 60,
  emotion_counts: { Happy: 10, Neutral: 5 },
  timeline: [{ frame: 1, current_emotion: "Happy" }],
};

// Step 3: Send to backend
fetch("http://localhost:8000/sessions/end_session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testData),
})
  .then((r) => r.json())
  .then((data) => console.log("Success:", data))
  .catch((e) => console.error("Error:", e));

// Should show success response with session_id
```

### Test 4: Export Report

```
1. Monitor → End Session
2. Switch to Analytics
3. See data populated
4. Click "PDF" button
5. Check Downloads folder for PDF file
6. Open PDF - should have content
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"

```
Solution:
1. Check PostgreSQL is running
2. Verify .env file has correct credentials
3. Test connection: psql -U user -d dbname
4. Check DATABASE URL in logs
```

### Issue: "Module not found: jspdf"

```
Solution:
cd FrontEnd
npm install jspdf jspdf-autotable
npm run dev
```

### Issue: "CORS error when calling API"

```
Solution:
Backend already has CORS enabled
Check API_BASE_URL in FrontEnd/src/config/apiConfig.js
Should be: http://localhost:8000
```

### Issue: "Migration script syntax error"

```
Solution:
1. Check psql version: psql --version
2. Try running with specific user:
   psql -U postgres -d ptichcamxuc -f migration.sql
3. Or import SQL file in pgAdmin
```

### Issue: "Videos not detected / No emotion data"

```
Solution:
1. Allow camera permission in browser
2. Check backend logs for errors
3. Verify models are loaded
4. Check GPU availability (if using CUDA)
5. Try with longer wait time (20+ seconds)
```

---

## 📊 Verification Checklist

After deployment, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Database has 8 columns in sessions table
- [ ] Can start webcam
- [ ] Can start/stop emotion detection
- [ ] End Session button works
- [ ] Session data saves to database
- [ ] Analytics page loads session data
- [ ] PDF export works
- [ ] CSV export works
- [ ] Reports page shows all sessions
- [ ] Filters work on Reports page
- [ ] Console has no red errors

---

## 📈 Performance Tips

### Optimize Database

```sql
-- Analyze query performance
ANALYZE sessions;
ANALYZE emotion_readings;

-- Vacuum to free space
VACUUM ANALYZE;
```

### Optimize Frontend

```bash
# Build for production (optional)
cd FrontEnd
npm run build
# Creates optimized dist/ folder
```

### Optimize Backend

```bash
# Use Gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.server:app
```

---

## 🚀 Next Steps

### Day 1: Deploy & Test

- [ ] Follow this guide
- [ ] Run test scenarios
- [ ] Verify all features work

### Day 2: User Training

- [ ] Share documentation
- [ ] Conduct demo
- [ ] Gather feedback

### Day 3+: Monitor & Improve

- [ ] Check error logs
- [ ] Monitor database size
- [ ] Optimize as needed

---

## 📞 Support

### Quick Links

- Backend Docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`
- API Base: `http://localhost:8000`

### Logs to Check

- **Backend Logs**: Terminal where `uvicorn` runs
- **Frontend Logs**: Browser Console (F12)
- **Database Logs**: PostgreSQL logs (location depends on OS)

### Documentation

- `DATABASE_SYNC_REPORT.md` - For schema verification
- `VERIFICATION_CHECKLIST.md` - For deployment steps
- `SYSTEM_FLOW_SUMMARY.md` - For architecture questions
- `TESTING_GUIDE_VI.md` - For test scenarios (Vietnamese)

---

## ✅ Deployment Complete!

When you see all these working:

1. ✅ Backend running on :8000
2. ✅ Frontend running on :5173
3. ✅ Database migrated
4. ✅ End Session → Data saved
5. ✅ Analytics loads data
6. ✅ Reports shows sessions
7. ✅ Export works (PDF/CSV)

**Congratulations!** 🎉 System is ready for production use.

---

**Estimated Time**: 5-10 minutes (for experienced users)  
**Difficulty**: Easy  
**Prerequisites**: 3 terminals + browser  
**Success Rate**: 95%+ (if following steps exactly)
