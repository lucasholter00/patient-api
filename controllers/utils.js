const mqtt = require("mqtt");
const mqttOptions = {
    host: 'placeholder',
    port: 'placeholder',
    protocol: 'placeholder',
    username: 'placeholder',
    password: 'placeholder'
};
const client = mqtt.connect(mqttOptions);

/*This map is responsible for storing res objects with a unique identifier as the key */
const responseMap = new Map();

const subscribeTopics = [
    "grp20/res/appointments/+",
    "grp20/res/timeSlots/+",
    "grp20/res/patients/+"
];


/*Handles received messages, if received message contains a requestID 
present in responseMap the received message is sent.*/
client.on("message", (topic, message) => {
    try {
        const messageJson = JSON.parse(message.toString());
        if (messageJson.hasOwnProperty("requestID")) {
            const res = responseMap.get(messageJson.requestID)

            if (res) {
                //Checks if the message contains a status code
                if (messageJson.hasOwnProperty("status")) {
                    //Sends response with the provided status code & error message
                    res.status(parseInt(messageJson.status)).json({ error: messageJson.error, })
                } else {
                    res.json(messageJson);
                }
                responseMap.delete(messageJson.requestID);
            } else { console.error("Response object not found for requestID: " + messageJson.requestID) }
        }
    } catch (err) {
        console.error(err.message)
    }

});

client.on("connect", () => {
    console.log("Succesfully connected to broker");
    client.subscribe(subscribeTopics);
});

client.on("reconnect", () => {
    console.log("Reconnecting to broker...");
});

client.on("error", (error) => {
    console.error(error);
});

client.on("close", () => {
    console.log("Disconnected from broker");
});

async function mqttTimeout(uuid, time) {
    setTimeout(() => {
        const response = responseMap.get(uuid)
        if (response) {
            responseMap.delete(uuid);
            response.status(504).json({ error: "Server timed out" });
        }

    }, time)
};

module.exports = {
    mqttTimeout,
    client,
    responseMap
};