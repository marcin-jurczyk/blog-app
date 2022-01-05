# # Create our image based on Python 3.8
# FROM python:3.9-slim

# # Expose ports
# EXPOSE 5000

# # Tell Python to not generate .pyc
# ENV PYTHONDONTWRITEBYTECODE 1

# # Turn off buffering
# ENV PYTHONUNBUFFERED 1

# # Install requirements using pip
# ADD requirements.txt .
# RUN python -m pip install -r requirements.txt

# # Set working directory and addour Flask API files
# WORKDIR /app
# ADD . /app

FROM python:3.9-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python"]

CMD ["main.py"]