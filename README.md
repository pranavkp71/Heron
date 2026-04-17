<p align="center">
  <img src="assets/heron-logo.png" width="100%" />
</p>

# Heron — Business Event Monitoring for SaaS

> **Detect when your business workflows silently break.**

---

## What is Heron

Heron makes sure your critical business events are actually happening. Unlike traditional monitoring that tells you when your servers crash, Heron learns the usual frequency of your events and immediately alerts you when they stop unexpectedly.

---

## The Problem

Most monitoring tools tell you about infrastructure failures. They do **NOT** tell you when your business stops working. 

Examples of silent failures:
* Signup webhooks stop firing
* Payment events stop being produced
* Email jobs stop running
* Background workers silently fail

Your app looks perfectly healthy, but your business flow is broken. You usually only find out when a user complains. Heron fixes this gap.

---

## How It Works

```text
Your App → Heron SDK → Heron Server → Pattern Learning → Silence Detection → Slack Alerts
```

---

## Installation

Install the Heron Python SDK via pip:

```bash
pip install getheron
```

---

## Quick Start

Getting started with the Heron backend server is designed to be completely frictionless.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pranavkp71/Heron.git
   cd Heron/heron-server
   ```

2. **Install dependencies:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Start the backend:**
   Once your PostgreSQL database logic is connected via `.env`, simply boot the server:
   ```bash
   python run.py
   ```
   The backend will be live at `http://localhost:8000`.

---

## Example

Instrumenting a business event only takes a single line of code!

```python
import heron

# Initialize the SDK with your project key
heron.init(api_key="YOUR_API_KEY")

# Track an event
heron.track("payment.completed")
```

Heron learns that `payment.completed` happens **every ~3 minutes**.

**If the event silently stops:**
```text
🚨 Heron Alert

Event: payment.completed
Last seen: 18 minutes ago
Expected interval: ~3 minutes
```

**When the event resumes:**
```text
✅ Heron Recovery

Event: payment.completed
Downtime: 18 minutes
```

---

## API

Heron provides simple REST endpoints to query and consume your own incident data.

**Get all incidents:**
```bash
GET /v1/incidents?api_key=YOUR_KEY
```

**Get active incidents only:**
```bash
GET /v1/incidents/active?api_key=YOUR_KEY
```

---

## Contributing

We welcome contributions from everyone! Whether it's fixing bugs, improving docs, or adding new features, we'd love your help.

Please read our [Contributing Guide](CONTRIBUTING.md) for full instructions on how to get started, branch expectations, and how to run our backend test suite.
