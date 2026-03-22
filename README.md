# Heron — Business Event Monitoring for SaaS

> Detect when your business workflows silently break.

---

## The Problem

Most monitoring tools tell you when your system crashes.

They do **NOT** tell you when your business stops working.

Examples of silent failures:

* Signup webhook stops firing
* Payment events stop being produced
* Email jobs stop running
* Background workers silently fail

Your app looks healthy.
But your business flow is broken.

You only find out when a user complains.

---

## What Heron Does

Heron monitors **business events**, not infrastructure.

Example:

```python
heron.track("payment.completed")
```

Heron learns how often this event occurs.

```text
payment.completed → every ~3 minutes
```

If the event suddenly stops:

```text
🚨 Heron Alert
payment.completed stopped
```

When it resumes:

```text
✅ Heron Recovery
payment.completed resumed
Downtime: 18 minutes
```

---

## ⚙️ How It Works

```text
Your App → Heron SDK → Heron Server → Pattern Learning → Silence Detection → Slack Alerts
```

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/pranavkp71/Heron.git
cd heron/heron-server
```

---

### 2. Setup Backend

```bash
pip install -r requirements.txt
```

---

### 3. Setup PostgreSQL

Create a database and run:

```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    slack_webhook_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    api_key TEXT,
    event_name TEXT,
    service TEXT,
    environment TEXT,
    metadata JSONB,
    timestamp BIGINT
);

CREATE TABLE event_stats (
    api_key TEXT,
    event_name TEXT,
    service TEXT,
    environment TEXT,
    last_seen BIGINT,
    avg_interval FLOAT,
    event_count INTEGER,
    incident_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    api_key TEXT,
    event_name TEXT,
    service TEXT,
    environment TEXT,
    started_at TIMESTAMP,
    resolved_at TIMESTAMP,
    duration INTEGER
);
```

---

### 4. Run Server

```bash
python run.py
```

Server runs at:

```text
http://localhost:8000
```

---

### 5. Create a Project

```bash
curl -X POST "http://localhost:8000/v1/projects?name=MyApp"
```

Response:

```json
{
  "project_id": 1,
  "api_key": "heron_xxxxx"
}
```

---

### 6. Setup Slack Alerts

* Go to Slack → Incoming Webhooks
* Create a webhook
* Add it to your project

---

### 7. Use SDK in Your App

Since Heron is not yet published on PyPI:

```python
import sys
sys.path.append("/path/to/heron-sdk")

import heron

heron.init(api_key="YOUR_API_KEY")

heron.track("payment.completed")
```

---

## What Happens Next

Heron will:

1. Learn event frequency
2. Detect when events stop
3. Create an incident
4. Send a Slack alert
5. Detect recovery
6. Send recovery alert with downtime

---

## Example Alert

```text
🚨 Heron Alert

Event: payment.completed
Last seen: 18 minutes ago
Expected interval: ~3 minutes
```

---

## Example Recovery

```text
✅ Heron Recovery

Event: payment.completed
Downtime: 18 minutes
```

---

## API Endpoints

### Get all incidents

```bash
GET /v1/incidents?api_key=YOUR_KEY
```

---

### Get active incidents

```bash
GET /v1/incidents/active?api_key=YOUR_KEY
```

---

## 🎯 Current Status

Heron is in early development.

* Core monitoring engine
* Incident tracking 
* Slack alerts 
* Multi project support

---

## Contributing / Feedback

If you're a SaaS founder or developer and want to try Heron:

I'd love to help you set it up personally.

---

## Roadmap

* Dashboard UI
* Hosted SaaS version
* Flow monitoring (signup → purchase)
* AI incident summaries

---

## Built For

* Indie hackers
* SaaS founders
* Backend engineers

---

## Getting Started (TL;DR)

```bash
git clone ...
pip install -r requirements.txt
setup postgres
python run.py
```

Then:

```python
heron.track("your.event")
```

---

## Follow Progress

Building Heron in public, sharing progress, learnings, and updates:

- X: https://x.com/pranavk_p
- LinkedIn: https://www.linkedin.com/in/pranav-k-p-0048ba278/  

Feel free to follow along or reach out
