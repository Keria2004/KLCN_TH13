# Mở terminal

# Bước 1 — Tạo môi trường ảo

cd DL
python -m venv venv

# Bước 2 — Kích hoạt môi trường ảo

venv\Scripts\activate

# Bước 3 — Cài đặt thư viện cần thiết

pip install -r requirements.txt

# Bước 4 — Giải thích các file cần thiết

# DL/models/:

    2 model face_detection.pt (Phát hiện khuôn mặt) và ferYOLOv1.pt (Nhận diện cảm xúc)

# DL/test/:

    ferYOLO_video.py (test cảm xúc bằng video có sẵn)
    ferYOLO_webcam.py (test cảm xúc bằng camera laptop)

# Bước 5: Demo

cd test
python ferYOLO_webcam.py
python ferYOLO_video.py
