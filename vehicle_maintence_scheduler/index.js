const express = require("express");
const { Log } = require("../LoggingMiddleware");
const { fetchDepots, fetchVehicles } = require("./api");
const { getBestSchedule } = require("./scheduler");

const app = express();
const port = Number(process.env.PORT || "3000");

app.use(express.json());

const logEvent = async (stack, level, pkg, message) => {
  try {
    await Log(stack, level, pkg, message);
  } catch (error) {
    console.log("Log failed");
  }
};

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/schedule", async (req, res) => {
  const includeTasks = req.query.includeTasks !== "false";
  const requestedDepotId = req.query.depotId ? Number(req.query.depotId) : null;

  await logEvent("backend", "info", "route", "Schedule request received.");

  try {
    const [depots, vehicles] = await Promise.all([
      fetchDepots(),
      fetchVehicles(),
    ]);

    let schedule = depots.map((depot) => {
      const result = getBestSchedule(vehicles, depot.mechanicHours);
      const entry = {
        depotId: depot.id,
        mechanicHours: depot.mechanicHours,
        totalDuration: result.totalDuration,
        totalImpact: result.totalImpact,
        taskIds: result.taskIds,
      };

      if (includeTasks) {
        entry.tasks = result.tasks;
      }

      return entry;
    });

    if (requestedDepotId != null) {
      schedule = schedule.filter((item) => item.depotId === requestedDepotId);
      if (!schedule.length) {
        await logEvent(
          "backend",
          "warn",
          "route",
          `Depot ${requestedDepotId} not found.`,
        );
        return res.status(404).json({ error: "Depot not found." });
      }
    }

    await logEvent("backend", "info", "service", "Schedule computed.");

    return res.json({
      generatedAt: new Date().toISOString(),
      depots: schedule,
    });
  } catch (error) {
    await logEvent("backend", "error", "handler", {
      message: "Schedule computation failed.",
      error: error.message || error,
    });

    return res.status(500).json({
      error: "Failed to compute schedule.",
      details: error.message || "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`Vehicle scheduler running on http://localhost:${port}`);
});
