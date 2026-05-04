import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mlApiPath = path.join(__dirname, "..", "..", "ml-api");
const mlHealthUrl = process.env.ML_HEALTH_URL || "http://localhost:8000/";
const bundledPythonPath = path.join(
  os.homedir(),
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "python",
  "python.exe"
);

let mlProcess = null;
let startingPromise = null;

function getPythonCommand() {
  if (process.env.PYTHON_COMMAND) {
    return process.env.PYTHON_COMMAND;
  }

  if (fs.existsSync(bundledPythonPath)) {
    return bundledPythonPath;
  }

  return "python";
}

async function isMlServiceRunning() {
  try {
    const response = await fetch(mlHealthUrl);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForMlService(timeoutMs = 15000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isMlServiceRunning()) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  return false;
}

export async function startMlService() {
  if (await isMlServiceRunning()) {
    console.log("ML service already running on http://localhost:8000");
    return true;
  }

  if (startingPromise) {
    return startingPromise;
  }

  const pythonCommand = getPythonCommand();
  mlProcess = spawn(pythonCommand, ["app.py"], {
    cwd: mlApiPath,
    stdio: "inherit"
  });

  mlProcess.on("error", (error) => {
    console.error("Unable to start ML service:", error.message);
  });

  mlProcess.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`ML service stopped with code ${code}`);
    }
  });

  console.log(`Starting ML service on http://localhost:8000 using ${pythonCommand}`);

  startingPromise = waitForMlService().finally(() => {
    startingPromise = null;
  });

  return startingPromise;
}

export async function ensureMlServiceRunning() {
  if (await isMlServiceRunning()) {
    return true;
  }

  return startMlService();
}
