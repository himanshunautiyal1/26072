const axios = require("axios");

const API_BASE_URL = "http://20.207.122.201/evaluation-service";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoaW1hbnNodS4yNjA3MkBnZ25pbmRpYS5kcm9uYWNoYXJ5YS5pbmZvIiwiZXhwIjoxNzc3ODcyNTI5LCJpYXQiOjE3Nzc4NzE2MjksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzNWYyMmMxNy0wODRlLTQxNTItYTc5ZC01NjZhNjQ0NTAwYWYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoaW1hbnNodSBuYXV0aXlhbCIsInN1YiI6IjY1NGY0NGY5LThhYjQtNGZhMS1hYWUyLTcyZmQyYzkwZjJlNyJ9LCJlbWFpbCI6ImhpbWFuc2h1LjI2MDcyQGdnbmluZGlhLmRyb25hY2hhcnlhLmluZm8iLCJuYW1lIjoiaGltYW5zaHUgbmF1dGl5YWwiLCJyb2xsTm8iOiIyNjA3MiIsImFjY2Vzc0NvZGUiOiJ1a3NkV1QiLCJjbGllbnRJRCI6IjY1NGY0NGY5LThhYjQtNGZhMS1hYWUyLTcyZmQyYzkwZjJlNyIsImNsaWVudFNlY3JldCI6Ilp4blVqdVVqWHljQldxdXgifQ.NJ8IV6ysRSgYQ_hr593Udsr0Bwpz7GK_DEuV7HkbdFA";
const AUTH_HEADERS = { Authorization: `Bearer ${ACCESS_TOKEN}` };

const fetchDepots = async () => {
  const response = await axios.get(`${API_BASE_URL}/depots`, {
    headers: AUTH_HEADERS,
  });

  const depots = Array.isArray(response.data?.depots)
    ? response.data.depots
    : [];

  return depots.map((depot) => ({
    id: Number(depot.ID),
    mechanicHours: Number(depot.MechanicHours),
  }));
};

const fetchVehicles = async () => {
  const response = await axios.get(`${API_BASE_URL}/vehicles`, {
    headers: AUTH_HEADERS,
  });

  const vehicles = Array.isArray(response.data?.vehicles)
    ? response.data.vehicles
    : [];

  return vehicles.map((vehicle) => ({
    taskId: String(vehicle.TaskID),
    duration: Number(vehicle.Duration),
    impact: Number(vehicle.Impact),
  }));
};

module.exports = {
  fetchDepots,
  fetchVehicles,
};
