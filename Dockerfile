# Use the official Python 3.9 image as the base image
FROM python:3.9

# Set the working directory in the container to /app
WORKDIR /app

# Copy the requirements file to the container
COPY dependencies.txt .

# Install the dependencies in the container
RUN pip install -r dependencies.txt

# Copy the rest of the application files to the container
COPY . .

# Expose port 5000
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py

# Start the Flask application
CMD [ "flask", "run", "--host=0.0.0.0" ]
