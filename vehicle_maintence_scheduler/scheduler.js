const getBestSchedule = (tasks, hours) => {
  const list = Array.isArray(tasks) ? tasks : [];
  const capacity = Math.max(0, Math.floor(Number(hours) || 0));
  const dp = new Array(capacity + 1).fill(0);
  const pick = new Array(capacity + 1).fill(-1);
  const prev = new Array(capacity + 1).fill(-1);

  for (let i = 0; i < list.length; i += 1) {
    const task = list[i];
    const duration = Math.max(0, Math.floor(Number(task.duration) || 0));
    const impact = Number(task.impact) || 0;

    if (!duration) {
      continue;
    }

    for (let w = capacity; w >= duration; w -= 1) {
      const candidate = dp[w - duration] + impact;
      if (candidate > dp[w]) {
        dp[w] = candidate;
        pick[w] = i;
        prev[w] = w - duration;
      }
    }
  }

  let w = capacity;
  const chosen = [];

  while (w >= 0 && pick[w] !== -1) {
    const task = list[pick[w]];
    if (!task) {
      break;
    }

    chosen.push(task);
    const next = prev[w];
    if (next === w) {
      break;
    }

    w = next;
  }

  chosen.reverse();

  const totalDuration = chosen.reduce(
    (sum, task) => sum + (Number(task.duration) || 0),
    0,
  );

  return {
    totalDuration,
    totalImpact: dp[capacity] || 0,
    tasks: chosen,
    taskIds: chosen.map((task) => task.taskId),
  };
};

module.exports = { getBestSchedule };
