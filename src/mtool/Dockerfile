FROM python:3.6-slim

WORKDIR /app

ENV PYTHONPATH /app

COPY ./api ./

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python3", "rest/app.py"]

