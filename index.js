require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");

const url = "http://api.weatherapi.com/v1/current.json?key=";
const port = process.env.PORT || 3000;
const key = process.env.APIKEY;

const app = express();
app.listen(port, () => {
  `Server is running on ${port}`;
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res.send("Hello.. kindly kindly use /api/hello?visitor_name=Mark")
);

app.get("/api/hello", (req, res) => {
  const visitorName = req.query.visitor_name;

  if (!visitorName) {
    res.status(400).json({ error: "Visitor name is required" });
    return;
  }
  requester_ip = requestIp.getClientIp(req);

  fetch(`${url}${key}&q=${requester_ip}&aqi=no`)
    .then((response) => response.json())
    .then((data) => {
      let requester_location = data.location.country;
      let requester_temp_c = data.current.temp_c;

      const greeting = `Hello, ${visitorName}!, the temperature is ${requester_temp_c} degrees Celcius in ${requester_location}`;
      res.json({
        client_ip: requester_ip,
        location: requester_location,
        greeting: greeting,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve location" });
    });
});

app.use("/api", (req, res) => {
  res.json({
    message: "kindly use <example.com>/api/hello?visitor_name=Mark",
  });
});
