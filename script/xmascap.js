const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "xmascap",
  version: "1.0.0",
  role: 0,
  credits: "Vern",
  aliases: [],
  usages: "< reply to an image > [red | blue]",
  cooldown: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const pathie = __dirname + `/cache/xmascap-image.jpg`;
  const { threadID, messageID, messageReply } = event;

  if (!messageReply || !messageReply.attachments?.[0]?.url) {
    return api.sendMessage("❌ Please reply to an image to add a Christmas cap. Use `red` or `blue` as optional color.", threadID, messageID);
  }

  const imageUrl = messageReply.attachments[0].url;
  const color = args[0]?.toLowerCase() === "blue" ? "blue" : "red"; // Only accept 'blue' or default to 'red'

  try {
    api.sendMessage("🎅 Adding Christmas cap, please wait...", threadID, messageID);

    const xmasCapUrl = `https://kaiz-apis.gleeze.com/api/xmas-cap?imageUrl=${encodeURIComponent(imageUrl)}&apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5&color=${color}`;
    const response = await axios.get(xmasCapUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(pathie, Buffer.from(response.data));

    api.sendMessage({
      body: `🎄 Christmas cap added successfully! Color: ${color}`,
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);

  } catch (error) {
    console.error("❌ XmasCap API Error:", error?.response?.data || error.message);
    api.sendMessage(`❌ Failed to add Christmas cap. Try again later.`, threadID, messageID);
  }
};