# ModiFylter

> University project implementing a serverless image-processing application on AWS.

![Python](https://img.shields.io/badge/Python-3.x-blue)
![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![Image Processing](https://img.shields.io/badge/Image-Processing-green)
![University Project](https://img.shields.io/badge/Project-University-lightgrey)

---

## 📖 Overview

ModiFylter is a university project focused on the design and deployment of a **serverless image-processing application** using **Amazon Web Services (AWS)**.

The application allows users to upload an image through a lightweight web interface, apply image filters, and download the processed result. At the current stage, the platform supports:

- grayscale filtering;
- black & white filtering.

The project emphasizes cloud-native architecture and distributed processing rather than advanced computer vision techniques. In particular, the work explores how AWS services can be orchestrated to build scalable and event-driven image-processing pipelines.

---

## 🏗 Architecture

The application is divided into two main components:

### Frontend
The frontend consists of:

- `HTML`
- `CSS`
- `JavaScript`

The web application handles:

- image upload;
- filter selection;
- communication with AWS services;
- retrieval and download of processed images.

The frontend is deployed using **AWS Amplify**.

### Backend

The backend is based on a serverless AWS architecture and includes:

- **AWS Lambda** functions for image processing;
- **Amazon S3** buckets for storage and event triggering;
- **Amazon Cognito** for identity management;
- **Amazon API Gateway** for WebSocket communication;
- **Amazon DynamoDB** for connection tracking;
- **Amazon CloudWatch** for monitoring and logging.

The processing pipeline is event-driven: uploading an image to an S3 bucket automatically triggers the filtering workflow through Lambda functions.

---

## 📁 Repository Structure

```text
ModiFylter-main/
│
├── main.py
├── filters.py
├── lambda_function.py
├── index.html
├── modifylterActions.js
├── package.json
├── Dockerfile
├── ModiFylter___1914546___Project_report.pdf
│
├── README.md
└── TODO.md
```

### Main Components

| File | Description |
|---|---|
| `index.html` | Frontend interface |
| `modifylterActions.js` | Client-side logic and AWS interactions |
| `filters.py` | Image filtering operations |
| `lambda_function.py` | AWS Lambda backend logic |
| `main.py` | Main execution / utility script |
| `Dockerfile` | Container configuration for deployment/testing |
| `ModiFylter___1914546___Project_report.pdf` | Project report and architectural discussion |

---

## 🎯 Objectives

The project investigates:

- serverless application design;
- event-driven cloud architectures;
- distributed image-processing workflows;
- AWS service integration;
- scalable backend deployment strategies.

Particular attention is given to the interaction between frontend components and AWS-managed backend services.

---

## 🛠 Technologies

### Programming Languages

- Python
- JavaScript
- HTML / CSS

### AWS Services

- AWS Amplify
- AWS Lambda
- Amazon S3
- Amazon Cognito
- Amazon API Gateway
- Amazon DynamoDB
- Amazon CloudWatch
- Amazon ECS / ECR (evaluation and deployment experiments)

### Libraries and Tools

- AWS SDK for JavaScript
- Docker
- Puppeteer
- OpenCV / Pillow (depending on the filtering implementation)

---

## 📊 Processing Workflow

The application follows the workflow described in the project report:

1. The user uploads an image through the frontend.
2. The image is validated and converted into a suitable request format.
3. The image is uploaded to an S3 bucket.
4. The upload event triggers an AWS Lambda function.
5. The Lambda function applies the selected filter.
6. The processed image is stored in an output bucket.
7. A WebSocket notification informs the client that processing is complete.
8. The processed image becomes available for download.

This architecture avoids sending large images directly as HTTP payloads and enables asynchronous processing.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
cd ModiFylter-main
```

(Optional) Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install pillow numpy boto3
```

Install JavaScript dependencies:

```bash
npm install
```

---

## 🚀 Usage

### Local Development

Run the frontend locally:

```bash
npm start
```

or open:

```text
index.html
```

depending on the project configuration.

### AWS Deployment

The complete application is intended to run on AWS infrastructure.

To reproduce the deployment pipeline, the following services must be configured:

- AWS Amplify
- Amazon Cognito
- Amazon S3
- AWS Lambda
- API Gateway WebSocket endpoints

Refer to the project report for a detailed discussion of the deployed architecture and service configuration.

---

## 📝 Notes

- This repository was developed primarily for academic purposes.
- The project focuses on cloud architecture and serverless workflows more than advanced image-processing algorithms.
- Some AWS resources referenced in the report may no longer be active or publicly accessible.
- Results and deployment behavior may vary depending on AWS configuration and permissions.

---

## 👥 Authors

Developed as part of a university cloud-computing and distributed systems project.
