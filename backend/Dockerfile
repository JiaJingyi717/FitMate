# syntax=docker/dockerfile:1

FROM python:3.12-slim AS builder

WORKDIR /app

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

COPY requirements-prod.txt .
RUN pip install --prefix=/install -r requirements-prod.txt

# ---------- 开发：热重载（挂载源码） ----------
FROM python:3.12-slim AS development

WORKDIR /app

COPY --from=builder /install /usr/local
COPY requirements.txt requirements-prod.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN groupadd --system app && useradd --system --gid app --home-dir /app app \
    && chown -R app:app /app

USER app

ENV FLASK_APP=app.py \
    PYTHONUNBUFFERED=1

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/health', timeout=3)"

CMD ["python", "app.py"]

# ---------- 生产：Gunicorn ----------
FROM python:3.12-slim AS production

WORKDIR /app

COPY --from=builder /install /usr/local
COPY . .

RUN groupadd --system app && useradd --system --gid app --home-dir /app app \
    && chown -R app:app /app

USER app

ENV FLASK_APP=app.py \
    PYTHONUNBUFFERED=1 \
    FITMATE_PRODUCTION=1

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/health', timeout=3)"

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "4", "--timeout", "120", "app:app"]
