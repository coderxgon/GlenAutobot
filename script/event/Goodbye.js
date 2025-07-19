const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "goodbyenoti",
    version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType === "log:unsubscribe") {
        if (!event.logMessageData || !event.logMessageData.leftParticipantFbId) return;

        const leftID = event.logMessageData.leftParticipantFbId;
        let name = await api.getUserInfo(leftID).then(info => info[leftID].name);

        const maxLength = 15;
        if (name.length > maxLength) {
            name = name.substring(0, maxLength - 3) + '...';
        }

        const groupInfo = await api.getThreadInfo(event.threadID);
        const groupName = groupInfo.threadName || "this group";
        const background = groupInfo.imageSrc || "https://i.ibb.co/4YBNyvP/images-76.jpg";
        const memberCount = groupInfo.participantIDs.length;

        const url = `https://hershey-api.onrender.com/api/goodbye` +
            `?pp=https://i.imgur.com/xwCoQ5H.jpeg` +
            `&nama=${encodeURIComponent(name)}` +
            `&bg=${encodeURIComponent(background)}` +
            `&member=${memberCount}` +
            `&uid=${leftID}`;

        try {
            const dir = './script/cache';
            const filePath = path.join(dir, 'goodbye_image.jpg');
            fs.mkdirSync(dir, { recursive: true });

            const { data } = await axios.get(url, { responseType: 'arraybuffer' });
            fs.writeFileSync(filePath, Buffer.from(data));

            api.sendMessage({
                body: `👋 ${name} has left ${groupName}. We’ll miss you!`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        } catch (error) {
            console.error("Error fetching goodbye image:", error.message);
            api.sendMessage({
                body: `👋 ${name} has left ${groupName}.`
            }, event.threadID);
        }
    }
};