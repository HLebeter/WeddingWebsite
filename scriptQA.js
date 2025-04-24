const apiURL = "https://b5re9h4z9e.execute-api.eu-west-2.amazonaws.com/default/Wedding_ChatBot_QA"
let messages = [];
const sessionId = crypto.randomUUID();

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${sender}: ${text}`;
  msgDiv.style.margin = "5px 0";
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("You", userText);
  input.value = "";

  const payload = {
    session_id: sessionId,
    user_input: userText,
    messages: messages
  };

  console.log("Sending to API:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      const reply = data.reply;
      appendMessage("Bot", reply);
      messages = data.messages;  // Preserve the full chat history
    } else {
      appendMessage("Bot", "Oops, something went wrong.");
      console.error(data);
    }
  } catch (err) {
    console.error("Error calling API:", err);
    appendMessage("Bot", "Error contacting server.");
  }
}
