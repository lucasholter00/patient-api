const { v4: uuidv4 } = require('uuid');
const { client } = require('../mqttUtils/MQTTclient');
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

/* GET timeslots with matching dentist ID.*/
async function getDentistAvailableTimes(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const dentistID = req.params.dentistID;
        const publishTopic = "grp20/req/availableTimes/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            dentist_id: dentistID,
            requestID: uuid
        }), (err) => { if (err) { next(err) } });
        mqttTimeout(uuid, 10000);
    }
    catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getDentistAvailableTimes
};
