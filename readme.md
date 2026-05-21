# RepoLens

RepoLens is a full-stack web application that analyzes GitHub repositories and generates detailed architectural and technical reports. It scans repository structures, detects technologies, analyzes file organization, calculates repository scores, and visualizes project architecture in an interactive and user-friendly way.

Built with a modern microservices-inspired architecture, RepoLens separates frontend and backend responsibilities for scalability, maintainability, and performance.

---

## Features

- Analyze GitHub repositories automatically
- Generate repository health and quality scores
- Detect technologies and frameworks used
- Visualize project file structures
- Generate architecture diagrams and graphs
- Display language breakdown and LOC statistics
- Fast frontend powered by Vite
- Responsive UI with Tailwind CSS
- REST API-based backend communication
- Modular and scalable service architecture

---

# Tech Stack

## Frontend

- React
- Tailwind CSS
- React Router
- Axios
- Vite

## Backend

- Express.js
- MongoDB
- Node.js

---

# Architecture

RepoLens follows a modular architecture with clear separation between:

- Frontend → UI rendering and client-side interactions
- Backend → Repository analysis engine and API services
- Database → MongoDB for report storage and persistence

The backend services are divided into specialized modules responsible for:

- Repository cloning
- Stack detection
- Architecture graph generation
- File tree parsing
- LOC calculation
- Score analysis
- Report summarization

---

# Project Structure

```bash
RepoLens/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│
└── README.md
```

---

# Core Backend Services

| Service | Purpose |
|---|---|
| `cloner.js` | Clones GitHub repositories |
| `stackDetector.js` | Detects frameworks and technologies |
| `fileTree.js` | Generates repository file tree |
| `archGraph.js` | Creates architecture graphs |
| `diagramGenerator.js` | Builds visual diagrams |
| `locRunner.js` | Calculates lines of code |
| `scorer.js` | Generates repository quality score |
| `summarizer.js` | Creates repository summaries |
| `cleanup.js` | Removes temporary cloned repositories |

---

# Example Analysis Output

RepoLens can generate insights such as:

- Total lines of code
- Language breakdown
- Repository architecture
- Tech stack detection
- File structure visualization
- Project quality score
- Repository summary report

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/repolens.git
cd repolens
```

---

## 2. Setup Backend

```bash
cd backend
npm install
```

### Create `.env`

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Start Backend Server

```bash
npm run dev
```

---

## 3. Setup Frontend

```bash
cd frontend
npm install
```

### Start Frontend

```bash
npm run dev
```

---

# API Endpoint

## Analyze Repository

```http
POST /api/analyze
```

### Request Body

```json
{
  "repoUrl": "https://github.com/user/repository"
}
```

---

# Repository Metrics

| Metric | Value |
|---|---|
| Languages Detected | 5 |
| Technologies Detected | 7 |
| Total Lines of Code | 9,171 |
| Repository Score | 35/100 |

---

# Engineering Highlights

- Modular service-oriented backend design
- Clean separation of frontend and backend
- Scalable architecture for future integrations
- Dynamic repository analysis pipeline
- Reusable React components
- Fast development workflow using Vite
- RESTful API communication with Axios

---

# Future Improvements

- Authentication & Authorization
- Cloud deployment support
- Advanced analytics dashboard
- AI-powered repository recommendations
- Docker containerization
- CI/CD pipeline integration
- Multi-repository comparison
- Public report sharing

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# Author

Developed by **Anmol Mehra**

If you like this project, give it a star on GitHub.