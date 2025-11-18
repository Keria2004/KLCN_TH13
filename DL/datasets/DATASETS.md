# ----- DATASETS DOCUMENTS -----

## 1️⃣ MỤC TIÊU

Dataset được sử dụng để huấn luyện và đánh giá các mô hình nhận diện **cảm xúc trên khuôn mặt**

## 2️⃣ CẤU TRÚC THƯ MỤC

### 🧠 Emotion Dataset (FER2013)

emotion_dataset/
├── train/
│ ├── angry/
│ ├── disgust/
│ ├── fear/
│ ├── happy/
│ ├── sad/
│ ├── surprise/
│ └── neutral/
├── validation/
└── test/

- **Nguồn:** [FER2013 - Kaggle](https://www.kaggle.com/datasets/msambare/fer2013)
- **Mô tả ngắn:** Bộ dữ liệu gồm các hình ảnh khuôn mặt gán nhãn cảm xúc, dùng để huấn luyện các mô hình CNN hoặc mini_XCEPTION.
- **Kích thước ảnh:** 48×48 (grayscale)
- **Số lớp:** 7 (angry, disgust, fear, happy, sad, surprise, neutral)
