# 📚 API Documentation - Hệ Thống Giám Sát Cảm Xúc

## 🔗 Base URL

```
http://localhost:8000
```

---

## 📑 Mục Lục

1. [Authentication APIs](#-authentication-apis)
2. [User Management APIs](#-user-management-apis)
3. [Session Management APIs](#-session-management-apis)
4. [Monitoring APIs](#-monitoring-apis)
5. [Report APIs](#-report-apis)
6. [Admin Management APIs](#-admin-management-apis)

---

## 🔐 Authentication APIs

### 1. Login

**Endpoint:** `POST /login/`

**Mô tả:** Đăng nhập vào hệ thống

**Request Body:**

```json
{
  "username": "teacher@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "full_name": "Nguyễn Văn A",
  "email": "teacher@example.com",
  "role": "teacher",
  "token": "token_1"
}
```

**Error Responses:**

- `401 Unauthorized`: User not found hoặc password incorrect

---

### 2. Register

**Endpoint:** `POST /register/`

**Mô tả:** Đăng ký tài khoản mới

**Request Body:**

```json
{
  "full_name": "Nguyễn Văn A",
  "email": "teacher@example.com",
  "password": "password123",
  "role": "teacher"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "full_name": "Nguyễn Văn A",
  "email": "teacher@example.com",
  "role": "teacher"
}
```

**Error Responses:**

- `400 Bad Request`: Email already registered

---

## 👥 User Management APIs

### 1. Create User

**Endpoint:** `POST /users/`

**Mô tả:** Tạo người dùng mới (Admin only)

**Request Body:**

```json
{
  "full_name": "Nguyễn Văn B",
  "email": "user@example.com",
  "password": "password123",
  "role": "teacher"
}
```

**Response (200 OK):**

```json
{
  "id": 2,
  "full_name": "Nguyễn Văn B",
  "email": "user@example.com",
  "role": "teacher"
}
```

---

### 2. Get All Users

**Endpoint:** `GET /users/`

**Mô tả:** Lấy danh sách tất cả người dùng

**Response (200 OK):**

```json
{
  "status": "success",
  "total": 5,
  "data": [
    {
      "id": 1,
      "full_name": "Nguyễn Văn A",
      "email": "teacher@example.com",
      "role": "teacher",
      "is_active": true,
      "created_at": "2024-11-01T10:00:00",
      "last_login": "2024-11-28T14:30:00"
    }
  ]
}
```

---

### 3. Get User by ID

**Endpoint:** `GET /users/{user_id}`

**Mô tả:** Lấy thông tin người dùng theo ID

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| user_id | int | ID của người dùng |

**Response (200 OK):**

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "full_name": "Nguyễn Văn A",
    "email": "teacher@example.com",
    "role": "teacher",
    "is_active": true,
    "created_at": "2024-11-01T10:00:00",
    "last_login": "2024-11-28T14:30:00"
  }
}
```

---

### 4. Update User

**Endpoint:** `PUT /users/{user_id}`

**Mô tả:** Cập nhật thông tin người dùng

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| user_id | int | ID của người dùng |

**Request Body:**

```json
{
  "full_name": "Nguyễn Văn A Cập Nhật",
  "is_active": true
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "User 1 updated",
  "user": {
    "id": 1,
    "full_name": "Nguyễn Văn A Cập Nhật",
    "email": "teacher@example.com",
    "role": "teacher"
  }
}
```

---

### 5. Delete User

**Endpoint:** `DELETE /users/{user_id}`

**Mô tả:** Xóa người dùng

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| user_id | int | ID của người dùng |

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "User 1 deleted"
}
```

---

## 📊 Session Management APIs

### 1. Create Session

**Endpoint:** `POST /sessions/create`

**Mô tả:** Tạo một buổi học mới

**Request Body:**

```json
{
  "teacher_id": 1,
  "subject": "Toán Học"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "session_id": 5,
  "subject": "Toán Học",
  "teacher_id": 1
}
```

---

### 2. Get Recent Sessions

**Endpoint:** `GET /sessions/recent`

**Mô tả:** Lấy danh sách các buổi học gần đây

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | int | 10 | Số lượng buổi học trả về |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": 5,
      "subject": "Toán Học",
      "teacher_id": 1,
      "created_at": "2024-11-28T14:00:00",
      "ended_at": "2024-11-28T14:45:00",
      "dominant_emotion": "Happy",
      "positive_rate": 75.5,
      "emotion_summary": {
        "Happy": 45,
        "Neutral": 30,
        "Sad": 10,
        "Angry": 5,
        "Surprise": 8,
        "Disgust": 1,
        "Fear": 1
      },
      "status": "ended"
    }
  ]
}
```

---

### 3. Get Recent Classes

**Endpoint:** `GET /sessions/recent_classes`

**Mô tả:** Lấy danh sách lớp học gần đây (alias của `/recent`)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | int | 10 | Số lượng buổi học trả về |

**Response:** (Tương tự /sessions/recent)

---

### 4. Get Sessions by Teacher

**Endpoint:** `GET /sessions/teacher/{teacher_id}`

**Mô tả:** Lấy tất cả buổi học của giáo viên

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| teacher_id | int | ID của giáo viên |

**Response (200 OK):**

```json
[
  {
    "id": 5,
    "subject": "Toán Học",
    "teacher_id": 1,
    "created_at": "2024-11-28T14:00:00",
    "ended_at": "2024-11-28T14:45:00"
  }
]
```

---

### 5. End Session

**Endpoint:** `POST /sessions/end_session`

**Mô tả:** Kết thúc buổi học và lưu dữ liệu cảm xúc

**Request Body:**

```json
{
  "session_id": "session_5",
  "end_time": "2024-11-28T14:45:00",
  "duration": 2700,
  "emotion_counts": {
    "Happy": 45,
    "Neutral": 30,
    "Sad": 10,
    "Angry": 5,
    "Surprise": 8,
    "Disgust": 1,
    "Fear": 1
  },
  "timeline": [
    {
      "frame": 0,
      "current_emotion": "Happy",
      "positive_rate": 78.5,
      "faces": 1
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Session 5 ended successfully",
  "session_id": 5,
  "total_frames": 100,
  "emotion_summary": {
    "Happy": 45,
    "Neutral": 30,
    "Sad": 10,
    "Angry": 5,
    "Surprise": 8,
    "Disgust": 1,
    "Fear": 1
  }
}
```

---

### 6. Get Session by ID

**Endpoint:** `GET /sessions/{session_id}`

**Mô tả:** Lấy chi tiết buổi học theo ID

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| session_id | int | ID của buổi học |

**Response (200 OK):**

```json
{
  "status": "success",
  "id": 5,
  "subject": "Toán Học",
  "teacher_id": 1,
  "created_at": "2024-11-28T14:00:00",
  "ended_at": "2024-11-28T14:45:00",
  "dominant_emotion": "Happy",
  "positive_rate": 75.5,
  "emotion_summary": {
    "Happy": 45,
    "Neutral": 30,
    "Sad": 10,
    "Angry": 5,
    "Surprise": 8,
    "Disgust": 1,
    "Fear": 1
  },
  "status": "ended"
}
```

---

## 📹 Monitoring APIs

### 1. Detect Emotion from Frame

**Endpoint:** `POST /monitoring/frame`

**Mô tả:** Gửi 1 frame ảnh để phân tích cảm xúc trong thời gian thực

**Request:**

- Content-Type: `multipart/form-data`
- Body: File (JPEG/PNG)

**Response (200 OK):**

```json
{
  "current_emotion": "Happy",
  "positive_rate": 78.5,
  "faces": [
    {
      "id": 1,
      "confidence": 0.95
    }
  ],
  "emotion_distribution": {
    "Happy": 78.5,
    "Neutral": 10.2,
    "Sad": 5.3,
    "Angry": 3.2,
    "Surprise": 2.5,
    "Disgust": 0.2,
    "Fear": 0.1
  }
}
```

---

### 2. Detect Emotion from Video

**Endpoint:** `POST /monitoring/upload-video/`

**Mô tả:** Tải lên video để phân tích cảm xúc cho từng frame

**Request:**

- Content-Type: `multipart/form-data`
- Parameters:
  - `file`: Video file (MP4, AVI, MOV...)
  - `frame_step` (optional): Số frame bỏ qua (mặc định: 10)

**Response (200 OK):**

```json
{
  "frames_total": 1000,
  "frames_analyzed": 100,
  "timeline": [
    {
      "frame": 0,
      "current_emotion": "Happy",
      "positive_rate": 78.5,
      "emotion_distribution": {
        "Happy": 78.5,
        "Neutral": 10.2,
        "Sad": 5.3,
        "Angry": 3.2,
        "Surprise": 2.5,
        "Disgust": 0.2,
        "Fear": 0.1
      }
    },
    {
      "frame": 10,
      "current_emotion": "Neutral",
      "positive_rate": 10.2,
      "emotion_distribution": {...}
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Không có file / File rỗng / File bị lỗi
- `500 Internal Server Error`: Server error

---

### 3. Get Analytics

**Endpoint:** `POST /monitoring/analytics`

**Mô tả:** Lấy phân tích chi tiết từ timeline dữ liệu

**Request Body:**

```json
{
  "timeline": [
    {
      "frame": 0,
      "current_emotion": "Happy",
      "positive_rate": 78.5,
      "emotion_distribution": {...}
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "total_samples": 100,
  "dominant_emotion": "Happy",
  "positive_rate": 75,
  "emotion_distribution": {
    "Happy": 45,
    "Neutral": 30,
    "Sad": 10,
    "Angry": 5,
    "Surprise": 8,
    "Disgust": 1,
    "Fear": 1
  },
  "emotion_over_time": [
    {
      "frame": 0,
      "emotion": "Happy",
      "positive_rate": 78.5
    }
  ],
  "teaching_insights": ["✅ Lớp rất hứng thú - Tiếp tục phương pháp hiện tại!"]
}
```

---

### 4. Health Check

**Endpoint:** `GET /monitoring/health`

**Mô tả:** Kiểm tra trạng thái của monitoring service

**Response (200 OK):**

```json
{
  "status": "healthy",
  "timestamp": "2024-11-28T14:45:00",
  "service": "emotion_monitoring"
}
```

---

## 📋 Report APIs

### 1. Create Report

**Endpoint:** `POST /reports/`

**Mô tả:** Tạo báo cáo buổi học

**Request Body:**

```json
{
  "session_id": 5,
  "report_format": "pdf",
  "file_path": "/reports/session_5_report.pdf",
  "file_size_bytes": 256000,
  "exported_by": 1
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "session_id": 5,
  "report_format": "pdf",
  "file_path": "/reports/session_5_report.pdf",
  "file_size_bytes": 256000,
  "exported_by": 1,
  "exported_at": "2024-11-28T14:50:00"
}
```

---

### 2. Get Reports by Session

**Endpoint:** `GET /reports/{session_id}`

**Mô tả:** Lấy danh sách báo cáo của buổi học

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| session_id | int | ID của buổi học |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "session_id": 5,
      "report_format": "pdf",
      "file_path": "/reports/session_5_report.pdf",
      "file_size_bytes": 256000,
      "exported_by": 1,
      "exported_at": "2024-11-28T14:50:00"
    }
  ]
}
```

---

## 👨‍💼 Admin Management APIs

### 1. Get All Teachers

**Endpoint:** `GET /admin/teachers`

**Mô tả:** Lấy danh sách tất cả giáo viên (Admin only)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Trang hiển thị |
| limit | int | 20 | Số giáo viên trên một trang |
| search | string | - | Tìm kiếm theo tên hoặc email |

**Response (200 OK):**

```json
{
  "status": "success",
  "total": 15,
  "page": 1,
  "data": [
    {
      "id": 1,
      "full_name": "Nguyễn Văn A",
      "email": "teachera@example.com",
      "role": "teacher",
      "is_active": true,
      "total_sessions": 25,
      "total_students": 120,
      "avg_positive_rate": 76.5,
      "created_at": "2024-11-01T10:00:00",
      "last_login": "2024-11-28T14:30:00"
    }
  ]
}
```

---

### 2. Get Teacher Statistics

**Endpoint:** `GET /admin/teachers/{teacher_id}/statistics`

**Mô tả:** Lấy thống kê chi tiết của một giáo viên

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| teacher_id | int | ID của giáo viên |

**Response (200 OK):**

```json
{
  "status": "success",
  "teacher_id": 1,
  "full_name": "Nguyễn Văn A",
  "statistics": {
    "total_sessions": 25,
    "total_classes": 5,
    "avg_session_duration": 2700,
    "avg_positive_rate": 76.5,
    "avg_student_count": 40,
    "most_taught_subject": "Toán Học",
    "emotion_trends": {
      "happy_avg": 45.3,
      "neutral_avg": 30.2,
      "sad_avg": 10.1,
      "angry_avg": 5.2,
      "surprise_avg": 7.1,
      "disgust_avg": 1.5,
      "fear_avg": 0.6
    }
  }
}
```

---

### 3. Disable/Enable Teacher

**Endpoint:** `PUT /admin/teachers/{teacher_id}/status`

**Mô tả:** Kích hoạt hoặc vô hiệu hóa tài khoản giáo viên

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| teacher_id | int | ID của giáo viên |

**Request Body:**

```json
{
  "is_active": false,
  "reason": "Tạm dừng do không còn dạy"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Teacher 1 status updated",
  "teacher_id": 1,
  "is_active": false
}
```

---

### 4. Get All Sessions (Admin View)

**Endpoint:** `GET /admin/sessions`

**Mô tả:** Lấy tất cả buổi học từ toàn bộ hệ thống (Admin only)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Trang hiển thị |
| limit | int | 20 | Số buổi học trên một trang |
| teacher_id | int | - | Lọc theo giáo viên |
| subject | string | - | Lọc theo môn học |
| status | string | - | Lọc theo trạng thái (pending/ended) |
| date_from | string | - | Ngày bắt đầu (ISO 8601) |
| date_to | string | - | Ngày kết thúc (ISO 8601) |

**Response (200 OK):**

```json
{
  "status": "success",
  "total": 250,
  "page": 1,
  "data": [
    {
      "id": 5,
      "teacher_id": 1,
      "teacher_name": "Nguyễn Văn A",
      "subject": "Toán Học",
      "created_at": "2024-11-28T14:00:00",
      "ended_at": "2024-11-28T14:45:00",
      "duration_minutes": 45,
      "student_count": 40,
      "dominant_emotion": "Happy",
      "positive_rate": 75.5,
      "status": "ended"
    }
  ]
}
```

---

### 5. Export Sessions Data

**Endpoint:** `GET /admin/sessions/export`

**Mô tả:** Xuất dữ liệu các buổi học ra file CSV/Excel

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| format | string | csv | Định dạng file (csv/excel) |
| date_from | string | - | Ngày bắt đầu |
| date_to | string | - | Ngày kết thúc |
| teacher_id | int | - | Lọc theo giáo viên |

**Response:**

```
Content-Type: application/csv (hoặc application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
```

File tải về với tên: `sessions_export_2024-11-28.csv`

---

### 6. Get All Reports (Admin View)

**Endpoint:** `GET /admin/reports`

**Mô tả:** Lấy tất cả báo cáo từ hệ thống (Admin only)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Trang hiển thị |
| limit | int | 20 | Số báo cáo trên một trang |
| session_id | int | - | Lọc theo buổi học |
| format | string | - | Lọc theo định dạng (pdf/excel) |
| exported_by | int | - | Lọc theo người xuất |
| date_from | string | - | Ngày bắt đầu |
| date_to | string | - | Ngày kết thúc |

**Response (200 OK):**

```json
{
  "status": "success",
  "total": 150,
  "page": 1,
  "data": [
    {
      "id": 1,
      "session_id": 5,
      "session_subject": "Toán Học",
      "report_format": "pdf",
      "file_name": "session_5_report.pdf",
      "file_size_mb": 2.5,
      "file_path": "/reports/session_5_report.pdf",
      "exported_by": 1,
      "exported_by_name": "Nguyễn Văn A",
      "exported_at": "2024-11-28T14:50:00",
      "download_count": 3,
      "last_downloaded": "2024-11-28T16:20:00"
    }
  ]
}
```

---

### 7. Delete Report

**Endpoint:** `DELETE /admin/reports/{report_id}`

**Mô tả:** Xóa báo cáo (Admin only)

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| report_id | int | ID của báo cáo |

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Report 1 deleted successfully",
  "freed_storage_mb": 2.5
}
```

---

### 8. Get Reports Statistics

**Endpoint:** `GET /admin/reports/statistics`

**Mô tả:** Lấy thống kê báo cáo

**Response (200 OK):**

```json
{
  "status": "success",
  "statistics": {
    "total_reports": 150,
    "total_storage_used_mb": 375.5,
    "reports_by_format": {
      "pdf": 120,
      "excel": 30
    },
    "average_download_count": 2.3,
    "most_popular_subject": "Toán Học",
    "total_downloads": 345,
    "archived_reports": 20
  }
}
```

---

### 9. Get System Analytics

**Endpoint:** `GET /admin/analytics/system`

**Mô tả:** Lấy thống kê toàn bộ hệ thống

**Response (200 OK):**

```json
{
  "status": "success",
  "analytics": {
    "total_users": 45,
    "total_teachers": 15,
    "total_sessions": 250,
    "total_classes": 30,
    "avg_session_duration_minutes": 45,
    "avg_students_per_session": 35,
    "system_avg_positive_rate": 72.5,
    "most_common_emotion": "Happy",
    "active_users_today": 12,
    "sessions_today": 8,
    "storage_used_mb": 1250.5,
    "storage_available_mb": 4750.5,
    "system_uptime_percent": 99.8,
    "average_response_time_ms": 245
  }
}
```

---

### 10. Generate System Report

**Endpoint:** `POST /admin/reports/system-report`

**Mô tả:** Tạo báo cáo toàn bộ hệ thống

**Request Body:**

```json
{
  "report_type": "monthly",
  "month": 11,
  "year": 2024,
  "include_sections": [
    "summary",
    "teacher_performance",
    "session_analytics",
    "emotion_distribution",
    "storage_usage",
    "recommendations"
  ],
  "output_format": "pdf"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "report_id": 5,
  "file_name": "system_report_2024_11.pdf",
  "file_size_mb": 5.2,
  "download_url": "/download/reports/system_report_2024_11.pdf",
  "generated_at": "2024-11-28T15:30:00",
  "expires_in_days": 30
}
```

---

### 11. Bulk Delete Sessions

**Endpoint:** `POST /admin/sessions/bulk-delete`

**Mô tả:** Xóa nhiều buổi học cùng một lúc

**Request Body:**

```json
{
  "session_ids": [1, 2, 3, 4, 5],
  "reason": "Xóa dữ liệu test"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "5 sessions deleted successfully",
  "deleted_count": 5,
  "freed_storage_mb": 12.5
}
```

---

### 12. Get Admin Activity Log

**Endpoint:** `GET /admin/activity-log`

**Mô tả:** Xem nhật ký hoạt động của Admin

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | int | 100 | Số bản ghi trên một trang |
| action | string | - | Lọc theo hành động (delete/update/export) |
| admin_id | int | - | Lọc theo Admin |
| date_from | string | - | Ngày bắt đầu |
| date_to | string | - | Ngày kết thúc |

**Response (200 OK):**

```json
{
  "status": "success",
  "total": 250,
  "data": [
    {
      "id": 1,
      "admin_id": 1,
      "admin_name": "Admin User",
      "action": "delete_session",
      "target_id": 5,
      "target_type": "session",
      "details": "Deleted session from 2024-11-28",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2024-11-28T15:30:00"
    }
  ]
}
```

---

## 🎯 Emotion Classification

Hệ thống nhận diện **7 loại cảm xúc chính:**

| Cảm Xúc     | Tiếng Anh | Mã  | Màu                  |
| ----------- | --------- | --- | -------------------- |
| Vui vẻ      | Happy     | 😄  | #28a745 (Xanh)       |
| Buồn        | Sad       | 😢  | #007bff (Xanh dương) |
| Giận dữ     | Angry     | 😡  | #dc3545 (Đỏ)         |
| Ngạc nhiên  | Surprise  | 😲  | #ffc107 (Vàng)       |
| Bình thường | Neutral   | 😐  | #6c757d (Xám)        |
| Ghê tởm     | Disgust   | 😖  | #20c997 (Xanh lá)    |
| Sợ hãi      | Fear      | 😨  | #fd7e14 (Cam)        |

---

## 📈 Chỉ Số Hiệu Suất

### 1. Hứng Thú (Engagement)

**Công thức:** `(Happy + Surprise) / Total Frames * 100`

- 75-100%: ✅ Rất tốt
- 50-74%: 👍 Tốt
- 25-49%: ⚠️ Trung bình
- 0-24%: ❌ Cần cải thiện

### 2. Tích Cực (Positive)

**Công thức:** `(Happy + Surprise) / Total Frames * 100`

- Giống với Engagement

---

## 🔄 Workflow Ví Dụ

### Flow: Bắt đầu giám sát buổi học trực tiếp

```
1. POST /sessions/create
   ↓
2. GET /monitoring/frame (lặp lại ~2 FPS hoặc 3 FPS)
   ↓
3. POST /monitoring/analytics (lấy stats)
   ↓
4. POST /sessions/end_session
   ↓
5. GET /sessions/recent_classes (hiển thị trên Analytics)
```

### Flow: Tải lên video để phân tích

```
1. POST /monitoring/upload-video/
   ↓
2. POST /monitoring/analytics (xử lý timeline)
   ↓
3. POST /sessions/end_session (lưu kết quả)
   ↓
4. GET /sessions/{session_id} (xem chi tiết)
```

---

## ⚙️ HTTP Status Codes

| Code | Ý Nghĩa                              |
| ---- | ------------------------------------ |
| 200  | OK - Request thành công              |
| 400  | Bad Request - Dữ liệu không hợp lệ   |
| 401  | Unauthorized - Cần xác thực          |
| 404  | Not Found - Tài nguyên không tồn tại |
| 500  | Internal Server Error - Lỗi server   |

---

## 📝 Ghi Chú

- **Timezone:** Sử dụng ISO 8601 format (UTC)
- **Authentication:** Token được trả về từ `/login/` endpoint
- **Rate Limiting:** Không áp dụng hiện tại
- **CORS:** Được bật để hỗ trợ Frontend từ `localhost:3000`

---

## 🔗 Liên Kết Hữu Ích

- Frontend Repository: `FrontEnd/`
- Backend Repository: `Backend/`
- Database Schema: `Backend/app/database/ptichcamxuc.sql`

---

**Cập nhật lần cuối:** 28-11-2024  
**Phiên bản:** 1.0
