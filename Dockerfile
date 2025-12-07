FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/backend

RUN apt-get update && apt-get install -y --no-install-recommends libpq5 curl && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY . /app

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD curl -f http://localhost:5000/api/estadisticas || exit 1

ENV GUNICORN_WORKERS=2 GUNICORN_THREADS=4 GUNICORN_TIMEOUT=60
CMD ["gunicorn", "-w", "${GUNICORN_WORKERS}", "-k", "gthread", "--threads", "${GUNICORN_THREADS}", "--timeout", "${GUNICORN_TIMEOUT}", "--bind", "0.0.0.0:5000", "app:app"]
