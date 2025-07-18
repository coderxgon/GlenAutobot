const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "postimage",
  version: "1.0.1",
  role: 0,
  aliases: ["imgupload", "imgcdn"],
  description: "Upload a replied image to CDN with expiration",
  usage: "<reply to an image> [expiration days]",
  credits: "Vern",
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  // Validate reply
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("❌ Please reply to an image to upload.", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "photo") {
    return api.sendMessage("❌ Only photo/image attachments are supported.", threadID, messageID);
  }

  const imageUrl = attachment.url;
  const expiration = parseInt(args[0]) || 30; // Default: 30 days

  const apiUrl = `https://kaiz-apis.gleeze.com/api/postimagecc?imageUrl=${encodeURIComponent(imageUrl)}&expiration=${expiration}&apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5`;

  api.sendMessage("📤 Uploading your image to CDN, please wait...", threadID, async () => {
    try {
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || !data.url) {
        return api.sendMessage("❌ Failed to upload image. Try again later.", threadID, messageID);
      }

      api.sendMessage(
        `✅ Image uploaded successfully!\n📎 Link: ${data.url}\n⏳ Expires in: ${expiration} day(s)`,
        threadID,
        messageID
      );
    } catch (err) {
      console.error("Upload Error:", err?.response?.data || err.message);
      api.sendMessage("❌ Error occurred while uploading. Please try again.", threadID, messageID);
    }
  });
};