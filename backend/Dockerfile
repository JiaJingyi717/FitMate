FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# 使用国内镜像加速 pip 安装
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/ && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
