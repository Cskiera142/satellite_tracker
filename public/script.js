document.addEventListener("DOMContentLoaded", () => {
  const fetchStatistics = async () => {
    try {
      const response = await axios.get("/stats");
      const data = response.data;

      document.getElementById("minAltitude").textContent =
        data.minAltitude.toFixed(3);
      document.getElementById("maxAltitude").textContent =
        data.maxAltitude.toFixed(3);
      document.getElementById("averageAltitude").textContent =
        data.averageAltitude.toFixed(3);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await axios.get("/health");
      const data = response.data;

      const orbitStatusEl = document.getElementById("orbit-status");
      orbitStatusEl.textContent = "Altitude is A-OK";

      if (data.message === "Altitude is A-OK") {
        orbitStatusEl.classList.add("health-ok");
      } else if (data.message === "WARNING: RAPID ORBITAL DECAY IMMINENT") {
        orbitStatusEl.classList.add("health-warning");
      } else if (data.message === "Sustained Low Earth Orbit Resumed") {
        orbitStatusEl.classList.add("health-sustained");
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchStatistics();
  fetchHealth();

  setInterval(() => {
    fetchStatistics();
    fetchHealth();
  }, 10000);
});
