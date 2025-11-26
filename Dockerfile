FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libopencv-dev \
    python3-opencv \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY Backend/requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY Backend/app ./app

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
