

```markdown
# Pet Store API Monitor

## Node.js Implementation

### Packages Needed:
- **axios**: HTTP requests (`npm install axios`)
- **hot-shots**: StatsD client (`npm install hot-shots`)
- **dotenv**: Environment variables (`npm install dotenv`)

### Installation:
```bash
npm install axios hot-shots dotenv
```

### Execution:
```bash
node petscript.js
```

---

## Python Implementation

### Prerequisites:
1. Verify Python version (3.6+ required):
```bash
python3 --version
```

2. Install pip if missing:
```bash
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py
pip3 --version
```

3. Install required package:
```bash
pip3 install datadog
```

### Execution:
```bash
python3 Apimetric.py
```

> **Note**: Both implementations require a running Datadog agent configured to receive StatsD metrics on port 8125.
`
