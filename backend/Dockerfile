# Backend Dockerfile
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container if you have one.
# For now, we will just install the known dependencies directly.
# Alternatively, you could do COPY requirements.txt . and RUN pip install -r requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the Fast API application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
