"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios").default;
const app = express().use(bodyParser.json());
// Access token for your app
const token = process.env.WHATSAPP_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;
app.listen(process.env.PORT || 1337, () => {
  console.log("Webhook is listening");
});
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "page") {
      handleIncomingMessage(body);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.sendStatus(500);
  }
});
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
async function sendWhatsAppMessage(phoneNumberId, from, msgBody, buttons) {
  const response = await axios.post(
    `https://graph.facebook.com/v12.0/${phoneNumberId}/messages?access_token=${token}`,
    {
      messaging_product: "whatsapp",
      to: from,
      text: { body: msgBody },
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: msgBody },
        action: { buttons }
      }
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
}
function handleIncomingMessage(body) {
  const change = body.entry[0].changes[0];
  const phoneNumberId = change.value.metadata.phone_number_id;
  const from = change.value.messages[0].from;
  const msgBody = change.value.messages[0].text.body;
  let msgResponse = {};
  if (msgBody.toLowerCase() === "hi" || msgBody.toLowerCase() === "hey") {
    msgResponse = sendWelcomeMessage(phoneNumberId, from);
  } else {
    msgResponse = sendInfoMessage(phoneNumberId, from);
  }
  // Assuming you have some way of sending the response to the user
  // For example: res.status(200).json(msgResponse);
}
function sendWelcomeMessage(phoneNumberId, from) {
  const welcomeMessage = "Welcome to Furation Tech";
  return sendWhatsAppMessage(phoneNumberId, from, welcomeMessage, [
    {
      type: "reply",
      reply: {
        id: "UNIQUE_BUTTON_ID_1",
        title: "About Location"
      }
    },
    {
      type: "reply",
      reply: {
        id: "UNIQUE_BUTTON_ID_2",
        title: "About Service"
      }
    }
  ]);
}
function sendInfoMessage(phoneNumberId, from) {
  const infoMessage = "For more info, please click on https://www.furation.tech/";
  return sendWhatsAppMessage(phoneNumberId, from, infoMessage, [
    {
      type: "reply",
      reply: {
        id: "UNIQUE_BUTTON_ID_5",
        title: "Website"
      }
    },
    {
      type: "reply",
      reply: {
        id: "UNIQUE_BUTTON_ID_6",
        title: "Mobile App"
      }
    }
  ]);
}