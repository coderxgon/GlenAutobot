const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "welcome",
    version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
        const addedParticipants = event.logMessageData.addedParticipants;
        if (!addedParticipants || addedParticipants.length === 0) return;

        const senderID = addedParticipants[0].userFbId;
        let name = await api.getUserInfo(senderID).then(info => info[senderID].name);

        const maxLength = 15;
        if (name.length > maxLength) {
            name = name.substring(0, maxLength - 3) + '...';
        }

        const groupInfo = await api.getThreadInfo(event.threadID);
        const groupName = groupInfo.threadName || "this group";
        const background = groupInfo.imageSrc || "https://i.ibb.co/4YBNyvP/images-76.jpg";
        const memberCount = groupInfo.participantIDs.length;

        const url = `https://hershey-api.onrender.com/api/welcome` +
            `?username=${encodeURIComponent(name)}` +
            `&avatarUrl=https://i.imgur.com/xwCoQ5H.jpeg` +
            `&groupname=${encodeURIComponent(groupName)}` +
            `&bg=${encodeURIComponent(background)}` +
            `&memberCount=${memberCount}` +
            `&uid=${senderID}`;

        try {
            const { data } = await axios.get(url, { responseType: 'arraybuffer' });
            const dir = './script/cache';
            const filePath = path.join(dir, 'welcome_image.jpg');

            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, Buffer.from(data));

            api.sendMessage({
                body: `Everyone welcome the new member ${name} to ${groupName}!`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        } catch (error) {
            console.error("Error fetching welcome image:", error.message);
            api.sendMessage({
                body: `Everyone welcome the new member ${name} to ${groupName}!`
            }, event.threadID);
        }
    }
};