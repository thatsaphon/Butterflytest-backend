const mqtt = require("mqtt");
const client = mqtt.connect("tcp://localhost:1883");
const topic = "first";

client.on("message", (topic, message) => {
  message = message.toString();
  console.log(message);
  if (topic === "first" && message === "Installing")
    client.publish("second", "next");
});

client.on("connect", () => {
  client.subscribe(topic);
});
