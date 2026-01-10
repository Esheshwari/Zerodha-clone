# Zerodha Clone – Full Stack Trading/monitoring Platform 

A **full-stack trading platform clone inspired by Zerodha (Kite)**, built using **React, Node.js, Express, and MongoDB**. This project demonstrates **real-world fintech system design**, scalable backend APIs, and a modern dashboard-driven frontend.

> Disclaimer: This project is for **educational and portfolio purposes only**. It is **not affiliated with Zerodha** and does **not provide real trading functionality**.

---

##  Why This Project 

This repository is designed to showcase **production-level engineering skills**, not just UI cloning:

* End-to-end **frontend + backend + database** implementation
* Clean, scalable **React architecture**
* RESTful backend APIs with proper data modeling
* Realistic **trading dashboard & analytics flows**
* Fintech-inspired system design
* Deployment-ready setup with environment configuration

---


## Repository Overview

This repository is structured as a **full-fledged MERN application** with clearly separated **frontend, backend, and dashboard** modules. Each module is independently built and deployed while sharing a unified MongoDB data layer, reflecting real-world production architecture.

---

## Frontend

### Description
The frontend replicates Zerodha’s core user experience with a clean, responsive, and intuitive interface. It manages user authentication flows, portfolio navigation, trading views, and seamless API consumption from the backend services.

### Tech Stack
- React.js
- React Router
- Context API / State Management
- Axios
- Modern CSS / UI Framework (as implemented)

### Responsibilities
- User authentication (login & signup)
- Protected routes and session handling
- REST API integration
- Portfolio and trading user interface

---

## Dashboard

### Description
The dashboard is a data-driven interface designed to visualize trading information such as **holdings, positions, profit & loss (PnL), and order history**, closely mirroring real-world fintech dashboards.

### Tech Stack
- React.js
- Charting & data visualization libraries
- Reusable and modular UI components

### Responsibilities
- Portfolio analytics and insights
- Holdings and positions visualization
- Trade summaries and performance metrics

---

## Backend

### Description
The backend provides a scalable and secure **RESTful API** responsible for business logic, authentication, and database interactions. It follows a clean separation of concerns with production-style architecture.

### Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT (JSON Web Tokens)
- bcrypt for password hashing

### Responsibilities
- User authentication and authorization
- Order, holding, and position management
- Secure API endpoints with middleware protection
- Data validation and persistence

---

## CI/CD Pipeline

- Continuous Integration using **GitHub Actions**
- Automated build and validation workflows on every push
- Environment-based configuration for deployment


## Local Setup & Installation

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (local or Atlas)
* Git

### Clone Repository

```bash
git clone https://github.com/your-username/zerodha-clone.git
cd zerodha-clone
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file:

```env
PORT=3002
MONGO_URI=your_mongodb_connection_string
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```


### Dashboard Setup

```bash
cd dashboard
npm install
npm start
```


## Key Highlights of this project

* Designed and implemented a full-stack MERN application with frontend, backend, and dashboard modules

* Built secure authentication flows using JWT, hashed passwords, and protected API routes

* Developed RESTful APIs for users, orders, holdings, positions, and watchlists

* Implemented CI/CD pipelines using GitHub Actions to automate build and validation workflows

* Created a scalable backend architecture with clean separation of routes, controllers, and models

* Delivered production-ready documentation including architecture and authentication setup guides

* Provided local deployment demo video showcasing complete end-to-end functionality


## Future Enhancements

* Real-time market data (WebSockets)
* Advanced analytics & charts
* Options trading module
* Paper trading engine

---

## Demo & Deployment

*  **Local Deployment Video**: Demonstrates

  * Application startup
  * Dashboard navigation
  * API integration
  * Data flow between frontend & backend

    ### Attachments
* To understand the project in detail kindly refer to this video: https://youtu.be/xF8avhNwL8o

https://github.com/user-attachments/assets/2cfe9461-cb18-4012-8573-dc7d630b0ad9


---

## Author

**Esheshwari Kumari -**
Computer Science Undergraduate 

> Building production-grade systems at the intersection of **software engineering and data**, with a focus on **scalable APIs, secure architectures, and analytics-driven decision making.**
---
## Final Note

This project reflects **how modern fintech platforms are engineered**, focusing on **architecture, scalability, and clean code** rather than just visuals.

If you're a recruiter or engineer reviewing this repo - thank you for your time!

