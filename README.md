# 🧬 Mirxes Risk Dashboard

## 🚀 How to Build and Run with Docker

### 1️⃣ Build Docker Image

```bash
cd mirxes-fe
docker build -t mirxes-fe .
```

### 2️⃣ Run the Project

```bash
docker run --rm -p 4173:4173 --name mirxes-fe --network mynetwork mirxes-fe
```

### 🌐 Frontend URL

```
http://localhost:4173/
```

---

# 📌 TASK 3

## 🏗️ Why did you choose that layout and technology stack?

I used a modern, scalable, and API-first architecture:

### 🔹 Frontend

* **React** – Component-based architecture, fast rendering, and strong ecosystem.

### 🔹 Backend

* **FastAPI** –

  * Async support for high performance
  * Automatic Swagger documentation
  * Well-suited for structured JSON APIs

### 🔹 AI Integration

* **OpenAI** – For generating intelligent summaries
* **Cohere AI** – Alternative AI summarization provider

### 🔹 DevOps

* **Docker** – Ensures consistent deployment and environment isolation

### 🔹 Caching

* **Redis** – Implemented for caching (not fully tested)

---

## 📊 What did you assume about the data, the users, or the clinical context?

* The **risk score** represents an individual’s probability of developing specific cancers over a defined period.
* It is used to identify **high-risk individuals** who may require additional surveillance or preventive screening.
* The system is intended for dashboard-style monitoring and clinical decision support.

---

## 📈 What would need to change if the dataset grew to 100,000 patients or multiple concurrent users?

To support scalability:

* Implement proper caching strategy (Redis optimization)
* Normalize and index database schema
* Add background processing (Celery / task queue)
* Optimize database queries
* Use server-side pagination
* Implement React DataTable with virtualization
* Add load balancing for multiple backend instances

---

## ⚠️ Known limitations, future improvements, or anything you want to flag.

* Multi-server support requires shared storage or object storage (e.g., S3)
* Add authentication & authorization (JWT / OAuth2)
* Improve project structure (HMVC or clean architecture)
* Persist data in a database instead of JSON files
* Fully implement and test caching layer
* Add unit and integration testing
* Implement a dynamic rule engine (JSON-based rules)

Example:

* [https://www.npmjs.com/package/json-rules-engine](https://www.npmjs.com/package/json-rules-engine)
* Rule Engine Architecture Preview:
  [https://user-images.githubusercontent.com/61467683/82750274-dd3b3b80-9da6-11ea-96eb-434a6a1a9bc1.png](https://user-images.githubusercontent.com/61467683/82750274-dd3b3b80-9da6-11ea-96eb-434a6a1a9bc1.png)

---