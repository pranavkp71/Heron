# Contributing to Heron

Thank you for your interest in contributing to Heron! We're building an open-source SaaS event monitoring platform, and we'd love your help.

This document outlines the simplest way to get up and running.

---

## Getting Started

To get the project running locally, follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/pranavkp71/Heron.git
cd Heron
```

**2. Install dependencies**
Setup the Python backend dependencies. It's recommended to use a virtual environment format.

```bash
cd heron-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

*(Optional)* To install the SDK natively for testing or external use, you can also run:
```bash
pip install getheron
```

**3. Run the server**
Ensure you have set up a PostgreSQL database as outlined in the `README.md`. Once the database is ready:

```bash
python run.py
```
The server should now be running.

---

## Branching

When making changes, please work on a new branch instead of committing directly to `main`.

A simple branch naming convention works best:
```bash
git checkout -b feature/add-new-alert
git checkout -b fix/auth-bug
```

---

## Testing

We use `pytest` for backend test coverage. Please make sure all tests pass before submitting your changes.

To run the backend tests:
```bash
cd heron-server
python -m pytest tests/ -v
```

Ensure you run tests using the same Python virtual environment where you installed the dependencies.

---

## Pull Requests

Once your changes are ready and tests are passing:

1. Push your branch to GitHub.
2. Open a Pull Request against the `main` branch.
3. Provide a brief description of what you changed and why.
4. One of the maintainers will review your PR as soon as possible!

Welcome to the team, and happy coding!
