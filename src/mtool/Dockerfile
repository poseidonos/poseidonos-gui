FROM python:3.6-slim
LABEL org.opencontainers.image.source https://github.com/poseidonos/poseidonos-gui

WORKDIR /app

ENV PYTHONPATH /app

COPY ./api ./

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python3", "rest/app.py"]

