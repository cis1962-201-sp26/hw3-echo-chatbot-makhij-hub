var currentChat = { messages: [] };
/**
 * Simulates a bot response to a user message
 * @param {string} userMessage - The user's message
 * @returns {string} - The bot's response
 */
function simulateBotResponse(userMessage) {
    // Simulate bot response with a delay
    setTimeout(function () {
        var botReply = 'You said: "'.concat(userMessage, '"');
        sendMessage('Echo', botReply);
    }, 500);
}
/**
 * Sends a message in the current chat
 * @param {string} role - The role of the message sender ('User' or 'Echo')
 * @param {string} message - The message content
 */
function sendMessage(role, message) {
    //dont create if empty
    if (message.length === 0) return;
    //trim if too long
    var trimmed = message.length > 500 ? message.slice(0, 500) : message;
    currentChat.messages.push({ role: role, content: trimmed });
    //add storage
    saveChat();
    renderMessages(currentChat.messages);
}
/**
 * Renders the messages in the chat current selected
 * @param {{role: string, content: string}[]} messages - The messages to render
 */
function renderMessages(messages) {
    var chatArea = document.getElementById('chat-area');
    if (!chatArea) throw new Error('Cant find chat area id ');
    //clear
    chatArea.innerHTML = '';
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        var textBubble = document.createElement('div');
        textBubble.classList.add('message');
        if (message.role === 'User') {
            textBubble.classList.add('user');
        } else {
            textBubble.classList.add('echo');
        }
        textBubble.textContent = message.content;
        chatArea.appendChild(textBubble);
    }
    //scroll down
    chatArea.scrollTop = chatArea.scrollHeight;
}
/**
 * Creates a new chat
 * @requirements
 * - If no chat exists, create a new chat object and stores it in local storage
 * - If a chat exits, delete the old chat object and creates a new one
 * - Always render the chat list and messages after creating a new chat
 */
function createNewChat() {
    currentChat = { messages: [] };
    saveChat();
    //add storage
    renderMessages(currentChat.messages);
    //finish
    var input = document.getElementById('user-input');
    if (!input) throw new Error('input error');
    input.value = '';
    saveChat();
}
//storage
function saveChat() {
    localStorage.setItem('chat_key', JSON.stringify(currentChat));
}
function loadChat() {
    var loaded = localStorage.getItem('chat_key');
    if (!loaded) return null;
    try {
        var parsedLoad = JSON.parse(loaded);
        if (parsedLoad !== null) {
            return parsedLoad;
        }
        return null;
    } catch (_a) {
        return null;
    }
}
/**
 * Initializes the app
 * @requirements
 * - Fetch the chat object from local storage
 * - Renders the chat messages from the saved chat
 * - If no chat exists, create a new chat
 */
function initializeApp() {
    var storedChat = loadChat();
    if (storedChat) {
        currentChat = storedChat;
        renderMessages(currentChat.messages);
    } else {
        createNewChat();
    }
    var input = document.getElementById('user-input');
    if (!input) throw new Error('input error');
    input.addEventListener('input', disableSend);
    disableSend();
    var resetButt = document.getElementById('reset-butt');
    if (!resetButt) throw new Error('rest error');
    resetButt.addEventListener('click', function (x) {
        x.preventDefault();
        createNewChat();
    });
    var form = document.getElementById('chat-form');
    if (!form) throw new Error('form error');
    form.addEventListener('submit', function (x) {
        x.preventDefault();
        var textInput = input.value.trim();
        if (textInput.length === 0) return;
        sendMessage('User', textInput);
        input.value = '';
        disableSend();
        simulateBotResponse(textInput);
    });
}
function disableSend() {
    var input = document.getElementById('user-input');
    if (!input) throw new Error('input error');
    var sendButt = document.getElementById('send-butt');
    if (!sendButt) throw new Error('send error');
    sendButt.disabled = input.value.trim().length === 0;
}
// TODO: Create an event listener to reset the chat messages when the "New Chat" button is clicked
// TODO: Create an event listener to handle sending messages when the user submits the chat input form
// Initialize the app upon reload
initializeApp();
export {};
