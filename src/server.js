const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const chatrooms = {};

// GET-Anfrage für einen Chatroom anhand der Chatroom-ID
app.get("/:chatroomId", (req, res) => {
  const chatroomId = req.params.chatroomId;
  const chatroom = chatrooms[chatroomId];

  if (chatroom) {
    res.sendFile(__dirname + "/public/chatroom.html");
  } else {
    res.status(404).send("Chatroom not found");
  }
});

// POST-Anfrage zum Erstellen eines Chatrooms
app.post("/create", (req, res) => {
  const chatroomName = req.body.chatroomName;
  const chatroomId = generateChatroomId();

  chatrooms[chatroomId] = {
    name: chatroomName,
    messages: []
  };

  res.json({ chatroomId });
});

// POST-Anfrage zum Senden einer Nachricht in einen Chatroom
app.post("/:chatroomId/send", (req, res) => {
  const chatroomId = req.params.chatroomId;
  const message = req.body.message;

  if (chatrooms[chatroomId]) {
    chatrooms[chatroomId].messages.push(message);
    res.send("Message sent successfully");
  } else {
    res.status(404).send("Chatroom not found");
  }
});

// Statische Dateien aus dem 'public' Ordner servieren
app.use(express.static(__dirname + "/public"));

// Hilfsfunktion zum Generieren einer zufälligen Chatroom-ID
function generateChatroomId() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let chatroomId = "";

  for (let i = 0; i < 6; i++) {
    chatroomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return chatroomId;
}

// Server starten
app.listen(3000, () => {
  console.log("Server started on port 3000");
});