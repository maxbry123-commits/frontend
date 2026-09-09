// Detect system color scheme and set dark mode as early as possible
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}
// Listen for system color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

let currentModel = 'grok-4.6';

document.getElementById('chatForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const question = document.getElementById('questionInput').value;

    // Display the user message immediately
    displayMessage('user', question);
    // Create AI bubble for loading
    const aiBubble = displayMessage('ai', 'Loading...');

    try {
        let history = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
        if (history.length === 0 || history[0].role !== 'system') {
            history.unshift({
                role: 'system',
                content: [{ type: 'text', text: 'You are a helpful and funny assistant.' }]
            });
        }
        // Add the new user message in xAI format
        history.push({
            role: 'user',
            content: [{ type: 'text', text: question }]
        });
        // Send the full history and model to the backend
        const serverResponse = await fetch('http://localhost:3000/ask-xai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: history, model: currentModel }),
        });

        if (!serverResponse.ok) {
            const errorText = await serverResponse.text();
            throw new Error(`Server error: ${errorText}`);
        }

        if (currentModel.startsWith('grok-imagine')) {
            const responseData = await serverResponse.json();
            let result = '';
            if (responseData.images && responseData.images.length > 0) {
                result = 'Generated Images:<br>';
                responseData.images.forEach((img, index) => {
                    const safeUrl = encodeURI(img.url);
                    result += `Image ${index + 1}: <img src="${safeUrl}" alt="Generated Image ${index + 1}" style="max-width: 100%; height: auto;"><br>`;
                });
            } else {
                result = 'No images generated. Response: ' + JSON.stringify(responseData);
            }
            const sanitizedHtml = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(result) : result;
            aiBubble.innerHTML = sanitizedHtml;
            // Add the assistant's response to history
            history.push({
                role: 'assistant',
                content: [{ type: 'text', text: result }]
            });
        } else {
            // Handle streaming response for text
            const reader = serverResponse.body.getReader();
            const decoder = new TextDecoder();
            let result = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                result += chunk;
                const rawHtml = marked.parse(result);  // Convert Markdown to HTML
                const sanitizedHtml = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;
                aiBubble.innerHTML = sanitizedHtml;
            }
            // Add the assistant's response to history
            history.push({
                role: 'assistant',
                content: [{ type: 'text', text: result }]
            });
        }

        document.getElementById('questionInput').value = '';  // Clear the input field
        // Save back to sessionStorage
        sessionStorage.setItem('conversationHistory', JSON.stringify(history));
    } catch (error) {
        aiBubble.textContent = `Error: ${error.message}`;
        console.error(error);
    }
});

// New: Add event listener for Enter key on the textarea
document.getElementById('questionInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('chatForm').dispatchEvent(new Event('submit'));
    }
});

// Display a chat message as a dialog bubble
function displayMessage(sender, text) {
    const chat = document.getElementById('chat');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (sender === 'user' ? 'user' : 'ai');
    // Add sender label for accessibility
    const label = document.createElement('div');
    label.style.fontSize = '12px';
    label.style.marginBottom = '2px';
    label.style.opacity = '0.7';
    label.textContent = (sender === 'user' ? 'You' : 'AI');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (sender === 'user') {
        bubble.textContent = text;
    } else {
        bubble.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(text) : text;
    }
    msgDiv.appendChild(label);
    msgDiv.appendChild(bubble);
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;

    return bubble;
}

// Dark mode toggle button logic
window.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.onclick = function () {
            document.body.classList.toggle('dark-mode');
        };
    }
    // Model toggle logic
    const textModelSelect = document.getElementById('textModelSelect');
    const imageModelSelect = document.getElementById('imageModelSelect');
    const modelHint = document.getElementById('modelHint');
    const questionInput = document.getElementById('questionInput');

    if (textModelSelect && imageModelSelect && modelHint && questionInput) {
        modelHint.textContent = `Current model: ${currentModel}`;

        textModelSelect.addEventListener('change', function () {
            currentModel = textModelSelect.value;
            imageModelSelect.selectedIndex = 0;
            modelHint.textContent = `Current model: ${currentModel}`;
            questionInput.placeholder = 'e.g., What\'s the meaning of life?';
        });

        imageModelSelect.addEventListener('change', function () {
            currentModel = imageModelSelect.value;
            // Reset the text select to the hidden default option
            textModelSelect.selectedIndex = 0;
            modelHint.textContent = `Current model: ${currentModel}`;
            questionInput.placeholder = 'e.g., A view in space';
        });
    }
    // Display chat history
    const history = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
    history.forEach(msg => {
        displayMessage(msg.sender, msg.text);
    });

    // Clear chat logic
    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
        clearChatBtn.onclick = function () {
            sessionStorage.removeItem('conversationHistory');
            document.getElementById('chat').innerHTML = '';
        };
    }
});
