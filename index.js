/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

require("dotenv").config();

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios").default;
const app = express().use(body_parser.json()); // creates express http server
const PORT = process.env.PORT || 1337;

// Sets server port and logs message on success
app.listen(PORT, () => console.log(`webhook is listening at ${PORT}`));

app.get("/", (req, res) => res.send("Welcome"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  // Parse the request reqData from the POST
  try {
    let reqData = req.body;

    // Check the Incoming webhook message
    console.log(JSON.stringify(reqData, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (reqData.object) {
      if (
        reqData.entry &&
        reqData.entry[0].changes &&
        reqData.entry[0].changes[0] &&
        reqData.entry[0].changes[0].value.messages &&
        reqData.entry[0].changes[0].value.messages[0] &&
        reqData.entry[0].changes[0].value.messages[0].type === "text"
      ) {
        let phone_number_id =
          reqData.entry[0].changes[0].value.metadata.phone_number_id;
        let from = reqData.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = reqData.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        console.log(
          reqData.entry[0].changes[0].value.messages[0],
          "body.entry[0].changes[0].value.messages[0]"
        );
        if (
          msg_body == "Hi" ||
          msg_body == "hi" ||
          msg_body == "Hey" ||
          msg_body == "hey"
        ) {
          msg_body = "Welcome to Furation tech";
          welcomeMessageButtons(phone_number_id, msg_body, from);
        } else if (msg_body == "Ok" || msg_body == "ok") {
          msg_body = "Thank you for contacting us";
          okresponse(phone_number_id, from, msg_body);
        } else {
          msg_body =
            "For more info. please click on https://www.furation.tech/";
          welcomeMessageButtons(phone_number_id, msg_body, from);
        }
      } else if (
        reqData.entry[0].changes[0].value.messages[0].type === "interactive" &&
        reqData.entry[0].changes[0].value.messages[0].interactive &&
        reqData.entry[0].changes[0].value.messages[0].interactive
          .button_reply &&
        reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
          .id
      ) {
        let phone_number_id =
          reqData.entry[0].changes[0].value.metadata.phone_number_id;
        let from = reqData.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body =
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .title; // extract the message text from the webhook payload
        console.log(
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .title,
          "reqData.entry[0].changes[0].value.messages[0].interactive.button_reply.title"
        );

        if (
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id === "UNIQUE_BUTTON_ID_1"
        ) {
          buttonId1Response(phone_number_id, from, msg_body);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id === "UNIQUE_BUTTON_ID_2"
        ) {
          buttonId2Response(phone_number_id, from, msg_body);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id === "UNIQUE_BUTTON_ID_3"
        ) {
          buttonId3Response(phone_number_id, from, msg_body);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id === "UNIQUE_BUTTON_ID_4"
        ) {
          buttonId4Response(phone_number_id, from, msg_body);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id === "UNIQUE_BUTTON_ID_5"
        ) {
          buttonId5Response(phone_number_id, from, msg_body);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id === "UNIQUE_BUTTON_ID_6"
        ) {
          buttonId6Response(phone_number_id, from, msg_body);
        } else {
          noresponse(phone_number_id, from, msg_body);
        }
        res.sendStatus(200);
      }
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/

  const verify_token = process.env.VERIFY_TOKEN;
  console.log(req.query, "Welcome");
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe") {
      // token === verify_token
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}); 


const welcomeMessageButtons = (phone_number_id, msg_body, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: msg_body,
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: msg_body,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_1",
                title: "About Location",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_2",
                title: "About Service",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

const buttonId1Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: msg_body,
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: msg_body,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_3",
                title: "Live Location",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_4",
                title: "Current Location",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId2Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: msg_body,
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: msg_body,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_5",
                title: "Website",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_6",
                title: "Mobile App",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId3Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you regarding Live Location",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId4Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you regarding Current Location",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId5Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you regarding Website Service",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId6Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you regarding Mobile app",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const noresponse = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const okresponse = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: msg_body,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};
