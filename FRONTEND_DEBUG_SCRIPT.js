/**
 * 🧪 Frontend Debug Script
 * Paste này vào browser console để debug
 */

// ============================================
// 1. CHECK API CONFIG
// ============================================
console.group("🔧 API Configuration");
console.log("API_BASE_URL:", API_BASE_URL || "NOT DEFINED");
console.log("Full Frame Endpoint:", `${API_BASE_URL}/monitoring/frame`);
console.groupEnd();

// ============================================
// 2. CHECK REFS STATE
// ============================================
console.group("📋 Check State When Pressing 'Start Detect'");
console.log("Instructions:");
console.log("1. Click 'Webcam' button first");
console.log("2. Open this console");
console.log("3. Click 'Start Detect' button");
console.log("4. Immediately run this: checkState()");
console.groupEnd();

window.checkState = () => {
  const state = {
    timestamp: new Date().toISOString(),
    checks: {
      videoElement: {
        exists: !!document.querySelector("video"),
        srcObject: !!document.querySelector("video")?.srcObject,
        src: document.querySelector("video")?.src ? "Yes" : "No",
        readyState: document.querySelector("video")?.readyState,
      },
      canvasElement: {
        exists: !!document.querySelector("canvas"),
        width: document.querySelector("canvas")?.width,
        height: document.querySelector("canvas")?.height,
      },
      networkRequests: "Check Network tab for POST to /monitoring/frame",
    },
  };

  console.group("✅ State Check");
  console.table(state.checks);
  console.groupEnd();

  return state;
};

// ============================================
// 3. TEST CANVAS CAPTURE
// ============================================
window.testCanvasCapture = () => {
  const video = document.querySelector("video");
  const canvas = document.createElement("canvas");

  if (!video) {
    console.error("❌ Video element not found");
    return;
  }

  if (video.videoWidth === 0) {
    console.error("❌ Video not loaded yet. Dimensions: 0x0");
    console.log("   Wait for video to load and try again");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(
    (blob) => {
      console.group("✅ Canvas Capture Test");
      console.log("Canvas size:", `${canvas.width}x${canvas.height}`);
      console.log("Blob size:", blob.size, "bytes");
      console.log("Blob type:", blob.type);
      console.log("Test passed! Canvas capture works.");
      console.groupEnd();
    },
    "image/jpeg",
    0.95
  );
};

// ============================================
// 4. TEST API REQUEST
// ============================================
window.testAPIRequest = async () => {
  const video = document.querySelector("video");
  const canvas = document.createElement("canvas");

  if (!video || video.videoWidth === 0) {
    console.error("❌ Video not ready");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(
    async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        console.group("🌐 API Request Test");
        console.log("URL:", `${API_BASE_URL}/monitoring/frame`);
        console.log("Method: POST");
        console.log("Payload size:", blob.size, "bytes");
        console.log("Sending request...");

        const response = await axios.post(
          `${API_BASE_URL}/monitoring/frame`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000,
          }
        );

        console.log("✅ Response received:");
        console.table(response.data);
        console.log("Full response:", response.data);
        console.groupEnd();
      } catch (error) {
        console.group("❌ API Request Failed");
        console.error("Error type:", error.code || error.name);
        console.error("Message:", error.message);
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.groupEnd();
      }
    },
    "image/jpeg",
    0.95
  );
};

// ============================================
// 5. MONITOR API CALLS
// ============================================
window.monitorAPICalls = () => {
  const originalFetch = window.fetch;
  const originalAxios = window.axios?.post;

  window.fetch = function (...args) {
    if (args[0].includes("/monitoring/frame")) {
      console.log("📤 FETCH to /monitoring/frame", args);
    }
    return originalFetch.apply(this, args);
  };

  if (window.axios) {
    window.axios.post = function (...args) {
      if (args[0].includes("/monitoring/frame")) {
        console.log("📤 AXIOS POST to /monitoring/frame");
        console.log("   URL:", args[0]);
        console.log("   Data size:", args[1]?.size || "N/A");
      }
      return originalAxios.apply(this, args);
    };
  }

  console.log("✅ Monitoring activated. Check console for API calls.");
};

// ============================================
// 6. STEP-BY-STEP GUIDE
// ============================================
console.group("📖 Step-by-Step Debug Guide");
console.log(`
1️⃣  Click 'Webcam' button
    → Video should display
    
2️⃣  Run: checkState()
    → Check if video is loaded
    
3️⃣  Run: testCanvasCapture()
    → Check if canvas capture works
    
4️⃣  Open Network tab (F12 → Network)
    
5️⃣  Click 'Start Detect'
    
6️⃣  Check Network tab for POST to /monitoring/frame
    → Should see request within 1 second
    → Response should be JSON with emotion data
    
7️⃣  If no request, run: testAPIRequest()
    → Manually test API call
    
8️⃣  Check console for error messages
    → "Analysis error:", "Connection refused", etc.

💡 Common Issues:
   - Backend not running → see "Connection refused"
   - Canvas not ready → see dimensions 0x0
   - API endpoint wrong → see 404 error
   - Permission denied → see mediaDevices error
`);
console.groupEnd();

// ============================================
// 7. QUICK FIXES
// ============================================
window.quickDiagnostic = () => {
  console.clear();

  console.group("🔍 Quick Diagnostic");

  // Check API_BASE_URL
  const apiUrl = API_BASE_URL;
  console.log("API URL:", apiUrl);
  console.log("Is localhost?", apiUrl.includes("localhost"));

  // Check video
  const video = document.querySelector("video");
  console.log("\n📹 Video Element:");
  console.log("  Exists:", !!video);
  console.log("  Playing:", video?.paused === false);
  console.log("  Size:", video?.videoWidth, "x", video?.videoHeight);

  // Check canvas
  const canvas = document.querySelector("canvas");
  console.log("\n🎨 Canvas Element:");
  console.log("  Exists:", !!canvas);
  console.log("  Size:", canvas?.width, "x", canvas?.height);

  // Check buttons
  const buttons = {
    webcam: !!document.querySelector('button:contains("Webcam")'),
    startDetect: !!document.querySelector('button:contains("Start Detect")'),
  };
  console.log("\n🔘 Buttons:", buttons);

  console.groupEnd();

  console.log("\n💡 Next: Run testAPIRequest() to manually test API call");
};

// ============================================
// Print initial info
// ============================================
console.log(
  "%c🧪 Frontend Debug Tools Loaded",
  "font-size: 16px; color: green; font-weight: bold;"
);
console.log("Available commands:");
console.log("  - checkState()");
console.log("  - testCanvasCapture()");
console.log("  - testAPIRequest()");
console.log("  - monitorAPICalls()");
console.log("  - quickDiagnostic()");
