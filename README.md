How to build and run with Docker

Build image
    cd mirxes-fe
    docker build -t mirxes-fe .

Run project
    docker run --rm -p 4173:4173  --name mirxes-fe --network mynetwork mirxes-fe

Frontend URL: http://localhost:4173/

TASK 3
• Why did you choose that layout and technology stack?
- I used React for frontend and FastAPI with AI integration for Backend, and Docker for DevOps.
Fastapi: Async support, automatic Swagger documentation, and well-suited for structured JSON APIs.
AI technology: I used OpenAI and Cohere AI to generate summary.
Redis: Implemented for caching, but not fully tested.

• What did you assume about the data, the users, or the clinical context?
- The risk score represents an individual’s probability of developing specific cancers over a defined period. It helps identify high-risk individuals who may require additional surveillance or preventive screening.

• What would need to change if the dataset grew to 100,000 patients or multiple concurrent users?
- Implement proper caching and data normalization.
- Add background processing and optimize database queries for scalability.
- Implement react datatable.

• Known limitations, future improvements, or anything you want to flag.
- Multi-server support would require shared storage.
- Add authentication and authorization.
- Improve project structure (HMVC).
- Persist data in a database instead of files.
- Fully implement and test caching.
- Add unit and integration testing.
- Implement a dynamic rule engine (e.g., using JSON-based rules). For eg. https://www.npmjs.com/package/json-rules-engine https://user-images.githubusercontent.com/61467683/82750274-dd3b3b80-9da6-11ea-96eb-434a6a1a9bc1.png