<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vern's Gemini Chatbot</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html,body {
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Courier New', Courier, monospace;
      background: #10141b;
      color: #f8f8f8;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 0 2em 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    h1 {
      text-align: center;
      color: #00bcd4;
      letter-spacing: 2px;
      margin-top: 2em;
      margin-bottom: 0.5em;
    }
    .chat-window {
      flex: 1;
      background: #151b25;
      border-radius: 12px;
      padding: 1em;
      overflow-y: auto;
      margin-bottom: 1em;
      box-shadow: 0 2px 16px #001a2e99;
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .msg {
      max-width: 80%;
      background: #222b38;
      padding: 0.7em 1em;
      border-radius: 12px;
      box-shadow: 0 1px 8px #003c4b44;
      font-size: 1.04em;
      line-height: 1.5;
      word-break: break-word;
      white-space: pre-line;
    }
    .msg.user { 
      align-self: flex-end;
      background: linear-gradient(90deg, #00bcd4 20%, #00546b 100%);
      color: #10141b;
    }
    .msg.bot {
      align-self: flex-start;
      background: linear-gradient(90deg, #2b293e 10%, #00bcd455 100%);
      color: #00ffd8;
    }
    .input-row {
      display: flex;
      gap: 0.5em;
      margin-bottom: 0.5em;
    }
    input[type="text"] {
      flex: 1;
      padding: 1em;
      border-radius: 10px;
      border: none;
      background: #1a2636;
      color: #fff;
      font-size: 1.1em;
    }
    button {
      padding: 1em 1.4em;
      border-radius: 10px;
      border: none;
      background: #00bcd4;
      color: #10141b;
      font-weight: bold;
      font-size: 1.1em;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    @media (max-width: 650px) {
      .container { max-width: 100vw; }
      .chat-window { padding: 0.5em; }
      h1 { font-size: 1.3em; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🤖 Vern's Gemini Chatbot</h1>
    <div id="chat" class="chat-window"></div>
    <form id="chatForm" class="input-row" autocomplete="off">
      <input type="text" id="userInput" placeholder="Type your message..." autofocus />
      <button type="submit" id="sendBtn">Send</button>
    </form>
  </div>
  <script>
    const chat = document.getElementById("chat");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    function addMessage(text, who = "user") {
      const div = document.createElement("div");
      div.className = "msg " + who;
      div.textContent = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    async function askGemini(prompt) {
      addMessage(prompt, "user");
      addMessage("...", "bot"); // Loading indicator
      sendBtn.disabled = true;
      input.disabled = true;
      try {
        // Change endpoint if needed
        const res = await fetch("https://urangkapolka.vercel.app/api/gemink?prompt=" + encodeURIComponent(prompt));
        const data = await res.json();
        let answer = data.response || "⚠️ No answer received from Gemini.";
        // Remove loading indicator
        let bots = chat.querySelectorAll(".msg.bot");
        if (bots.length > 0) bots[bots.length-1].remove();
        addMessage(answer, "bot");
      } catch (err) {
        let bots = chat.querySelectorAll(".msg.bot");
        if (bots.length > 0) bots[bots.length-1].remove();
        addMessage("🚫 Error: " + (err?.message || "API error."), "bot");
      }
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }

    form.onsubmit = e => {
      e.preventDefault();
      const prompt = input.value.trim();
      if (!prompt) return;
      askGemini(prompt);
      input.value = "";
    };

    // Optional: Welcome message
    window.onload = () => {
      addMessage("Hi! I am Gemini AI. Ask me anything 🤖", "bot");
      input.focus();
    };
  </script>
</body>
</html>