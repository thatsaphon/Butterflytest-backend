const express = require("express");
const app = express();
const cors = require("cors");

const mqtt = require("async-mqtt");
const client = mqtt.connect("tcp://localhost:1883");
const result = ["initial"];
client.on("message", async (topic, message, packet) => {
  message = message.toString();
  console.log("Topic:", topic);
  console.log("Message:", message);
  result.push(message);
  console.log(result);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const installController = async (req, res, next) => {
  try {
    result.pop();
    const { topic, message } = req.body;
    if (topic !== "first")
      return res.status(400).json({ message: "topic is not valid" });
    if (message !== "Installing")
      return res.status(400).json({ message: "message is not valid" });

    await client.subscribe("second");
    await client.publish(topic, message);
    setTimeout(() => {
      if (result[0] !== "next")
        return res.status(500).json({ message: "internal server error" });
      res.status(200).json({ message: "Success" });
    }, 2000);
  } catch (err) {
    console.log(err);
  }
};
app.post("/", installController);

app.use("/", (req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});

const port = 8000;
app.listen(port, (req, res, next) => {
  console.log("server running on port " + port);
});
