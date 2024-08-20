# AWS Deployment Guide

Here's a step-by-step guide to deploying your FastAPI project on an EC2 instance using Docker:

### Step 1: Prepare Your EC2 Instance

1. **Launch an EC2 Instance**:
   - Go to the AWS Management Console and launch a new EC2 instance.
   - Choose an Amazon Machine Image (AMI), such as Ubuntu 20.04 LTS.
   - Select an instance type (e.g., `t2.micro` if you’re on the free tier).
   - Configure security groups to allow inbound traffic on ports `22` (SSH) and `80` (HTTP).

2. **Connect to Your Instance**:
   - Once the instance is running, connect to it using SSH.
   - Example command:
     ```bash
     ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-dns
     ```

### Step 2: Install Docker on the EC2 Instance

1. **Update the Package List**:
   ```bash
   sudo apt-get update
   ```

2. **Install Docker**:
   ```bash
   sudo apt-get install -y docker.io
   ```

3. **Start Docker and Enable It to Run at Boot**:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

4. **Verify Docker Installation**:
   ```bash
   docker --version
   ```

### Step 3: Prepare Your FastAPI Project for Deployment

1. **Create a Dockerfile in Your FastAPI Project**:
   In the root of your FastAPI project directory, create a `Dockerfile`:
   ```Dockerfile
   # Use an official Python runtime as a parent image
   FROM python:3.10-slim

   # Set the working directory in the container
   WORKDIR /app

   # Copy the requirements file into the container
   COPY requirements.txt .

   # Install dependencies
   RUN pip install --no-cache-dir -r requirements.txt

   # Copy the project files into the container
   COPY . .

   # Expose port 80 to the outside world
   EXPOSE 80

   # Command to run the application
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
   ```

2. **Create a `requirements.txt` File**:
   Ensure you have a `requirements.txt` file with all dependencies listed:
   ```txt
   fastapi
   uvicorn[standard]
   asyncpg
   # Add other dependencies here
   ```

3. **Build Your Docker Image**:
   - On your local machine, navigate to the project directory and build the Docker image:
     ```bash
     docker build -t fastapi-app .
     ```

4. **Test Your Docker Image Locally**:
   - Run the Docker container locally to ensure everything works:
     ```bash
     docker run -d --restart unless-stopped -p 8001:80 fastapi-app
     ```
   - Open a browser and navigate to `http://localhost:8001` to test.

5. **Access the Application**:
   - Navigate to your EC2 instance's public DNS or IP address in your browser. The application should be accessible at `http://your-ec2-public-dns`.

### Step 4: Push Docker Image to Docker Hub (optional)

1. **Log In to Docker Hub**:
   ```bash
   docker login
   ```

2. **Tag Your Docker Image**:
   ```bash
   docker tag fastapi-app your-dockerhub-username/fastapi-app
   ```

3. **Push the Image to Docker Hub**:
   ```bash
   docker push your-dockerhub-username/fastapi-app
   ```

### Step 5: Deploy the Docker Container on EC2 (optional)

1. **Pull the Docker Image from Docker Hub**:
   - On your EC2 instance, pull the image from Docker Hub:
     ```bash
     docker pull your-dockerhub-username/fastapi-app
     ```

2. **Run the Docker Container**:
   ```bash
   docker run -d -p 80:80 your-dockerhub-username/fastapi-app
   ```

### Step 6: Run the server using docker-compose 
To enable auto-restart of your FastAPI application using Docker Compose, you'll need to define a restart policy within your `docker-compose.yml` file. This ensures that your application container restarts automatically if it stops, or if the EC2 instance is restarted.

Here’s how to do it:

1. **Create or Update Your `docker-compose.yml` File**:

   - Created a `docker-compose.yml` file. This file defines your application's services, including the restart policy.

   - Here's an example `docker-compose.yml` file for the FastAPI application:

   ```yaml
   version: '3.8'

   services:
   fastapi-app:
      image: fastapi-app:latest
      ports:
         - "80:80"
      restart: unless-stopped
      environment:
         - DATABASE_URL=postgresql://postgres:password@localhost/todoDB
      volumes:
         - ./app:/app  # Adjust this to your specific needs
   ```



2. **Deploy Your Application with Docker Compose**:

   - Once you have your `docker-compose.yml` file configured, you can deploy your application using Docker Compose.

3. **Run the Application**:
   ```bash
   docker-compose up -d
   ```
   - The `-d` flag runs the containers in detached mode, allowing them to run in the background.

### Step 7: Configure a Reverse Proxy (Optional)

To make your FastAPI application accessible via a domain name, you can set up a reverse proxy using Nginx:

1. **Install Nginx**:
   ```bash
   sudo apt-get install -y nginx
   ```

2. **Configure Nginx**:
   - Open the Nginx configuration file:
     ```bash
     sudo nano /etc/nginx/sites-available/default
     ```
   - Update the configuration to forward requests to the Docker container:
     ```nginx
     server {
         listen 80;
         server_name your-domain.com;

         location / {
             proxy_pass http://127.0.0.1:80;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```

3. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

4. **Point Your Domain to the EC2 Instance**:
   - Update your domain's DNS settings to point to the EC2 instance's public IP address.

### Step 7: Running Tests (Optional)

1. **SSH into Your EC2 Instance**:
   - If not already connected, SSH into your EC2 instance.

2. **Run Tests**:
   - Navigate to your project directory:
     ```bash
     cd /path/to/your/project
     ```
   - Run the tests:
     ```bash
     pytest
     ```

### Conclusion

Your FastAPI application is now deployed on an EC2 instance using Docker. You can access it via your EC2 public IP address or your domain name if configured. This setup is scalable, and you can easily update the application by rebuilding and redeploying the Docker container.