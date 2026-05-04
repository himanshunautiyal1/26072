const axios = require("axios");

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoaW1hbnNodS4yNjA3MkBnZ25pbmRpYS5kcm9uYWNoYXJ5YS5pbmZvIiwiZXhwIjoxNzc3ODcyNTI5LCJpYXQiOjE3Nzc4NzE2MjksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzNWYyMmMxNy0wODRlLTQxNTItYTc5ZC01NjZhNjQ0NTAwYWYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoaW1hbnNodSBuYXV0aXlhbCIsInN1YiI6IjY1NGY0NGY5LThhYjQtNGZhMS1hYWUyLTcyZmQyYzkwZjJlNyJ9LCJlbWFpbCI6ImhpbWFuc2h1LjI2MDcyQGdnbmluZGlhLmRyb25hY2hhcnlhLmluZm8iLCJuYW1lIjoiaGltYW5zaHUgbmF1dGl5YWwiLCJyb2xsTm8iOiIyNjA3MiIsImFjY2Vzc0NvZGUiOiJ1a3NkV1QiLCJjbGllbnRJRCI6IjY1NGY0NGY5LThhYjQtNGZhMS1hYWUyLTcyZmQyYzkwZjJlNyIsImNsaWVudFNlY3JldCI6Ilp4blVqdVVqWHljQldxdXgifQ.NJ8IV6ysRSgYQ_hr593Udsr0Bwpz7GK_DEuV7HkbdFA";
const AUTH_HEADERS = { Authorization: `Bearer ${ACCESS_TOKEN}` };

const STACK = new Set(["backend", "frontend"]);
const LEVEL = new Set(["debug", "info", "warn", "error", "fatal"]);

const BACKEND_PACKAGES = new Set([
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
]);

const FRONTEND_PACKAGES = new Set([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
]);

const SHARED_PACKAGES = new Set(["auth", "config", "middleware", "utils"]);

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const isValidPackage = (stack, pkg) => {
  if (SHARED_PACKAGES.has(pkg)) {
    return true;
  }

  if (stack === "backend") {
    return BACKEND_PACKAGES.has(pkg);
  }

  if (stack === "frontend") {
    return FRONTEND_PACKAGES.has(pkg);
  }

  return false;
};

const serializeMessage = (message) => {
  if (message == null) {
    return "";
  }

  if (typeof message === "string") {
    return message;
  }

  try {
    return JSON.stringify(message);
  } catch (error) {
    return String(message);
  }
};

const Log = async (stack, level, pkg, message) => {
  const stackValue = normalize(stack);
  const levelValue = normalize(level);
  const packageValue = normalize(pkg);
  const messageValue = serializeMessage(message);

  if (!STACK.has(stackValue)) {
    throw new Error(`Invalid stack: ${stack}`);
  }

  if (!LEVEL.has(levelValue)) {
    throw new Error(`Invalid level: ${level}`);
  }

  if (!isValidPackage(stackValue, packageValue)) {
    throw new Error(`Invalid package: ${pkg}`);
  }

  const payload = {
    stack: stackValue,
    level: levelValue,
    package: packageValue,
    message: messageValue,
  };

  const response = await axios.post(LOG_API_URL, payload, {
    headers: AUTH_HEADERS,
  });
  return response.data;
};

module.exports = { Log };
