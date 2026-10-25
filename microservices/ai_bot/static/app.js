let sessionId = localStorage.getItem('investiq_session_id') || ('sess_' + Math.random().toString(36).substring(2, 10));
localStorage.setItem('investiq_session_id', sessionId);

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const ctxStock = document.getElementById('ctx-stock');
const ctxPage = document.getElementById('ctx-page');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const modelVal = document.getElementById('model-val');

// Check backend status on page load
async function checkHealth() {
    try {
        const res = await fetch('/health');
        if (res.ok) {
            const data = await res.json();
            statusDot.classList.add('active');
            if (data.gemini_active) {
                statusText.innerText = 'Connected (Gemini Online)';
                statusText.style.color = '#3fb950';
            } else {
                statusText.innerText = 'Online (Live Data Active)';
                statusText.style.color = '#e3b341';
            }
            if (data.gemini_model) {
                modelVal.innerText = data.gemini_model;
            }
        } else {
            throw new Error();
        }
    } catch {
        statusDot.classList.remove('active');
        statusText.innerText = 'Offline / Connecting';
        statusText.style.color = '#f85149';
    }
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerText = role === 'user' ? '👤' : '🤖';

    const content = document.createElement('div');
    content.className = 'message-content';

    if (role === 'bot') {
        content.innerHTML = marked.parse(text);
    } else {
        content.innerText = text;
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
}

function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading-msg';
    loadingDiv.id = 'active-loading';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerText = '🤖';

    const content = document.createElement('div');
    content.className = 'message-content loading-dots';
    content.innerHTML = 'Thinking <span>.</span><span>.</span><span>.</span>';

    loadingDiv.appendChild(avatar);
    loadingDiv.appendChild(content);
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingIndicator() {
    const loading = document.getElementById('active-loading');
    if (loading) {
        loading.remove();
    }
}

async function handleChatSubmit(e) {
    if (e) e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    userInput.value = '';
    appendMessage('user', query);
    showLoadingIndicator();

    try {
        const payload = {
            message: query,
            session_id: sessionId,
            current_stock: ctxStock.value.trim() || null,
            page_context: ctxPage.value || null
        };

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        removeLoadingIndicator();

        if (response.ok) {
            const data = await response.json();
            appendMessage('bot', data.reply);
            if (data.active_company) {
                const display = document.getElementById('active-stock-display');
                if (display) {
                    display.innerText = `${data.active_company} (${data.active_ticker})`;
                }
            }
        } else {
            const err = await response.json();
            appendMessage('bot', `⚠️ Error: ${err.detail || 'Failed to get response from AI Co-Pilot.'}`);
        }
    } catch (error) {
        removeLoadingIndicator();
        appendMessage('bot', '⚠️ Network error: Could not reach backend server at /api/chat. Ensure server is running.');
    }
}

function sendQuickPrompt(promptText) {
    userInput.value = promptText;
    handleChatSubmit();
}

async function clearChat() {
    try {
        await fetch(`/api/chat/history/${sessionId}`, { method: 'DELETE' });
    } catch {}
    const display = document.getElementById('active-stock-display');
    if (display) display.innerText = 'None';
    chatMessages.innerHTML = `
        <div class="message system-message">
            <div class="avatar">🤖</div>
            <div class="message-content">
                <strong>Conversation Reset</strong>
                <p>New session initialized. Active company context cleared. How can I help you analyze the market today?</p>
            </div>
        </div>
    `;
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('investiq_session_id', sessionId);
}

// Initial check
checkHealth();
setInterval(checkHealth, 15000);
