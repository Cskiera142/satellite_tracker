const { default: axios } = require("axios");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000; // Use the value of PORT environment variable or default to port 3000

const altitudeData = [];
app.use(express.static("public"));

app.get("/stats", async (req, res) => {
  try {
    const response = await axios.get("https://api.cfast.dev/satellite");
    const satelliteData = response.data;

    const lastUpdated = new Date(satelliteData.last_updated);

    const currentTime = new Date();

    if (currentTime - lastUpdated <= 5 * 60 * 1000) {
      altitudeData.push(parseFloat(satelliteData.altitude));

      while (
        altitudeData.length > 0 &&
        currentTime - new Date(altitudeData[0].timestamp) > 5 * 60 * 1000
      ) {
        altitudeData.shift();
      }
    }
    const minAltitude = Math.min(...altitudeData);
    const maxAltitude = Math.max(...altitudeData);
    const averageAltitude =
      altitudeData.reduce((acc, altitude) => acc + altitude, 0) /
      altitudeData.length;

    res.json({
      minAltitude,
      maxAltitude,
      averageAltitude,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", async (req, res) => {
  try {
    const currentTime = new Date();
    const oneMinuteAgo = new Date(currentTime - 60 * 100);

    const recentAltitudeData = altitudeData.filter(
      (entry) => new Date(entry.timestamp) >= oneMinuteAgo
    );

    if (recentAltitudeData.length === 0) {
      res.json({ message: "Altitude is A-OK" });
    } else {
      const sumAltitude = recentAltitudeData.reduce(
        (acc, entry) => acc + entry.altitude,
        0
      );
      const averageAltitude = sumAltitude / recentAltitudeData.length;

      if (averageAltitude < 160) {
        res.json({ message: "WARNING: RAPID ORBITAL DECAY IMMINENT" });
      } else {
        res.json({ message: "Sustained Low Earth Orbit Resumed" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
