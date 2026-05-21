# RepoLens — GitHub Repository Intelligence Platform

> Visualize and understand any GitHub repository instantly.

RepoLens is a developer tool that analyzes public GitHub repositories and generates a visual dashboard containing:

* Lines of Code (LOC) analytics
* Interactive architecture graphs
* File structure visualization
* Tech stack detection
* Repository summaries
* Repo quality scoring
* Shareable report pages

The goal of RepoLens is to help developers quickly understand unfamiliar codebases without manually exploring every file.

---

# Features

## 1. GitHub Repository Analysis

Paste any public GitHub repository URL and RepoLens will automatically analyze the project.

### Supported Inputs

* Public GitHub repositories
* JavaScript / TypeScript projects
* MERN applications
* Node.js backends
* React applications

---

# 2. LOC (Lines of Code) Analytics

RepoLens generates detailed code statistics using `cloc`.

### Analytics Included

* Total lines of code
* Per-language code statistics
* Comment count
* Blank lines
* Language percentage distribution

### Example

```txt
JavaScript: 12,420 LOC
TypeScript: 4,210 LOC
CSS: 1,100 LOC
JSON: 430 LOC
```

---

# 3. Interactive File Structure Viewer

Explore the repository structure through an interactive folder tree.

### Features

* Expand/collapse folders
* Nested directory traversal
* Fast visualization of project structure
* Ignored unnecessary directories for performance

### Ignored Directories

```txt
node_modules
.git
dist
build
coverage
```

---

# 4. Tech Stack Detection

RepoLens automatically detects frameworks and technologies used inside the repository.

### Detectable Technologies

* React
* Next.js
* Express.js
* MongoDB
* TailwindCSS
* TypeScript
* Docker
* JWT Authentication
* REST APIs

### Detection Sources

* package.json
* Dockerfile
* docker-compose.yml
* configuration files
* folder conventions

---

# 5. Architecture Graph

The architecture graph visually explains how the repository is organized.

### Features

* Folder relationship graphs
* Dependency visualization
* Import-based connections
* Interactive draggable nodes
* Zoom and pan support

### Example Flow

```txt
Frontend
   ↓
API Routes
   ↓
Controllers
   ↓
Database Models
```

### Built Using

* React Flow
* Import analysis
* Folder dependency mapping

---

# 6. Shareable Report URLs

Every repository analysis generates a shareable dashboard link.

### Example

```txt
https://repolens.dev/report/abc123
```

### Benefits

* Share projects easily
* Add reports to portfolios
* Showcase architecture visually
* Share on LinkedIn, X/Twitter, and GitHub

---

# 7. Repository Summary Panel

RepoLens generates a smart repository overview summarizing:

* Project type
* Architecture style
* Frontend stack
* Backend stack
* Important detected features

### Example

```txt
This repository is a MERN fullstack application.

Frontend:
React + TailwindCSS

Backend:
Express + MongoDB

Architecture:
MVC Pattern
```

---

# 8. Repository Scoring System

RepoLens evaluates repositories using multiple quality indicators.

### Metrics

* Architecture quality
* Project structure
* Documentation presence
* Testing setup
* Complexity estimation
* Maintainability

### Example

```txt
Architecture Score: 84/100
Maintainability: Good
Complexity: Medium
Documentation: Weak
```

---

# Tech Stack

## Frontend

* React
* TailwindCSS
* React Flow

## Backend

* Node.js
* Express.js

## Analysis Engine

* simple-git
* cloc
* Custom file parser

## Deployment

* AWS EC2
* Docker
* NGINX

---

# How It Works

```txt
User submits GitHub repository URL
            ↓
RepoLens clones repository temporarily
            ↓
Runs repository analysis
 ├── LOC analysis
 ├── File structure parsing
 ├── Tech stack detection
 ├── Dependency analysis
            ↓
Generates report JSON
            ↓
Displays visual dashboard
            ↓
Deletes temporary repository files
```

---

# Project Goals

RepoLens aims to:

* Help developers understand unfamiliar codebases quickly
* Improve open-source onboarding
* Visualize repository architecture
* Simplify project exploration
* Create beautiful shareable engineering reports

---

# Future Features

## Planned Features

* AI-generated repository summaries
* README generation
* Private repository analysis
* Complexity heatmaps
* Team dashboards
* GitHub OAuth integration
* Exportable PDF reports
* CI/CD integration
* Architecture recommendations

---

# Performance & Optimization

RepoLens ignores heavy folders during analysis to improve performance.

### Ignored Folders

```txt
node_modules
.git
build
dist
coverage
```

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/yourusername/repolens.git
```

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Start Frontend

```bash
npm run dev
```

## Start Backend

```bash
npm run dev
```

---

# Deployment

RepoLens is designed to be deployed using:

* Docker
* AWS EC2
* NGINX reverse proxy

---

# Contributing

Contributions, feature suggestions, and feedback are welcome.

---

# Author

-- Anmol Mehra

```
