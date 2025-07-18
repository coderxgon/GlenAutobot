const axios = require('axios');

module.exports.config = {
  name: 'bot',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt4', 'gpt'],
  description: 'Interact with an AI assistant',
  usage: 'ai [your message]',
  credits: 'Vern',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const senderId = event.senderID;

  if (args.length === 0) {
    return api.sendMessage(
      "❌ Please provide a message after 'ai'. Example: 'ai How are you?'",
      event.threadID,
      event.messageID
    );
  }

  const input = args.join(' ').trim();
  const systemRole = 'You are Tr1pZzey AI, a helpful and friendly assistant.';
  const prompt = `${systemRole}\n${input}`;

  const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o-pro?ask=what+is+this&uid=4fe7e522-70b7-420b-a746-d7a23db49ee5&imageUrl=https%3A%2F%2Fi.ibb.co%2FdsBYR8Gb%2F518891713-4071070426475328-3833574861334449397-n-jpg-stp-dst-jpg-p480x480-tt6-nc-cat-105-ccb-1-7-nc.jpg&apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5&q=${encodeURIComponent(prompt)}&uid=${senderId}`;

  api.sendMessage(
    "🤖 Processing your request, please wait...",
    event.threadID,
    async (err) => {
      if (err) return;

      try {
        const res = await axios.get(apiUrl);
        const response = res?.data?.response || "⚠️ No response from AI.";

        const parts = [];
        for (let i = 0; i < response.length; i += 1999) {
          parts.push(response.substring(i, i + 1999));
        }

        for (const part of parts) {
          await api.sendMessage(part, event.threadID);
        }

      } catch (error) {
        console.error('GPT API Error:', error?.response?.data || error.message);
        await api.sendMessage("❌ An error occurred while processing your request.", event.threadID);
      }
    }
  );
};