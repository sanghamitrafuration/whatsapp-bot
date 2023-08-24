/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async(req, res) => {
  // Parse the request body from the POST
  try{
      let body = req.body;

    // Check the Incoming webhook message
    console.log(JSON.stringify(body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0] &&
        body.entry[0].changes[0].value.messages[0].type==="text"
    
      ) {
        let phone_number_id =
        body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body.entry[0].changes[0].value.messages[0].from;// extract the phone number from the webhook payload
        let msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        console.log(body.entry[0].changes[0].value.messages[0], "body.entry[0].changes[0].value.messages[0]")
        if(msg_body=="Hi" || msg_body=="hi" || msg_body=="Hey" || msg_body=="hey"){
          msg_body="Welcome to Furation tech"
        }else{
          msg_body="For more info. please click on https://www.furation.tech/"
        }
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: msg_body
                  },
                  action: {
                    buttons: [
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
                    ]
                  }
                }
          },
          headers: { "Content-Type": "application/json" },
          
        }).then(res=>console.log(res))
        .catch(err=>console.log(err))
         
      } else if (
        body.entry[0].changes[0].value.messages[0].type==="interactive" &&
        body.entry[0].changes[0].value.messages[0].interactive &&
        body.entry[0].changes[0].value.messages[0].interactive.button_reply &&
        body.entry[0].changes[0].value.messages[0].interactive.button_reply.id
      ){
          let phone_number_id =
          body.entry[0].changes[0].value.metadata.phone_number_id;
          let from = body.entry[0].changes[0].value.messages[0].from;// extract the phone number from the webhook payload
          let msg_body = body.entry[0].changes[0].value.messages[0].interactive.button_reply.title; // extract the message text from the webhook payload
          console.log(body.entry[0].changes[0].value.messages[0].interactive.button_reply.title, "body.entry[0].changes[0].value.messages[0].interactive.button_reply.title")
  
          if(body.entry[0].changes[0].value.messages[0].interactive.button_reply.id==="UNIQUE_BUTTON_ID_1"){
            console.log("UNIQUE_BUTTON_ID_1", "About Location")
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: msg_body
                  },
                  action: {
                    buttons: [
                      {
                        type: "reply",
                        reply: {
                          id: "UNIQUE_BUTTON_ID_3",
                          title: "Live Location"
                        }
                      },
                      {
                        type: "reply",
                        reply: {
                          id: "UNIQUE_BUTTON_ID_4",
                          title: "Current Location"
                        }
                      }
                    ]
                  }
                }
              },
              headers: { "Content-Type": "application/json" },
              
            })
            res.sendStatus(200);
          }else if(body.entry[0].changes[0].value.messages[0].interactive.button_reply.id==="UNIQUE_BUTTON_ID_2") {
            console.log("UNIQUE_BUTTON_ID_2", "About Service")
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: msg_body
                  },
                  action: {
                    buttons: [
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
                    ]
                  }
                }
              },
              headers: { "Content-Type": "application/json" },
              
            })
          }else if(body.entry[0].changes[0].value.messages[0].interactive.button_reply.id==="UNIQUE_BUTTON_ID_3") {
            console.log("UNIQUE_BUTTON_ID_2", "About Service")
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: "We will contact you regarding Live Location"
                  }
                }
              },
              headers: { "Content-Type": "application/json" },
              
            })
          }else if(body.entry[0].changes[0].value.messages[0].interactive.button_reply.id==="UNIQUE_BUTTON_ID_4") {
            console.log("UNIQUE_BUTTON_ID_2", "About Service")
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: "We will contact you regarding Current Location"
                  }
                }
              },
              headers: { "Content-Type": "application/json" },
              
            })
          }else if(body.entry[0].changes[0].value.messages[0].interactive.button_reply.id==="UNIQUE_BUTTON_ID_5") {
            console.log("UNIQUE_BUTTON_ID_2", "About Service")
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: "We will contact you regarding Website Service"
                  }
                }
              },
              headers: { "Content-Type": "application/json" },
              
            })
          }else if(body.entry[0].changes[0].value.messages[0].interactive.button_reply.id==="UNIQUE_BUTTON_ID_6") {
            console.log("UNIQUE_BUTTON_ID_2", "About Service")
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
                  body: msg_body
                },
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    // text: "Select the option"
                    text: "We will contact you regarding Mobile app"
                  }
                }
              },
              headers: { "Content-Type": "application/json" },
              
            })
          }
          res.sendStatus(200);
  
      }

     }
    else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  }
  catch(error){
    console.log(error)
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
  console.log(req.query, "Welcome")
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});