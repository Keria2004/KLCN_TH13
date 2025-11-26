// ai.js
document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chatHistory');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    function addMessage(sender, text, isAI = false, media = null) {
        const container = document.createElement('div');
        container.classList.add('message-container');
        container.classList.add(isAI ? 'ai-container' : 'user-container');

        let messageHTML = `<div class="chat-message ${isAI ? 'ai-message' : 'user-message'}">`;

        if (media) {
            messageHTML += `<div class="media-placeholder">
                                <img src="${media}" alt="Media">
                                <span class="fps">FPS: 10</span>
                            </div>`;
        }

        messageHTML += `<p>${text}</p>
                        <span class="sender-info">${sender}</span>
                        </div>`;

        container.innerHTML = messageHTML;
        chatHistory.appendChild(container);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage('Bạn', text);

        chatInput.value = '';

        setTimeout(() => {
            let aiResponse = '';
            let media = null;

            if (text.toLowerCase().includes('văn quán')) {
                aiResponse = 'Đây là thông tin về lớp Văn Quán.';
                media = 'https://via.placeholder.com/300x150?text=Van+Quan';
            } else if (text.toLowerCase().includes('văn phú')) {
                aiResponse = 'Đây là thông tin về lớp Văn Phú.';
                media = 'https://via.placeholder.com/300x150?text=Van+Phu';
            } else {
                aiResponse = 'Tôi có thể cung cấp thông tin về lớp học và cảm xúc học sinh.';
            }

            addMessage('AI', aiResponse, true, media);
        }, 800);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    addMessage('AI', 'Xin chào! Tôi là trợ lý lớp học. Tôi có thể cung cấp thông tin về lớp học, số lượng học sinh, điểm trung bình và cảm xúc.', true);
});
// 
// Hàm hiển thị thông báo
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    const notif = document.createElement('div');
    notif.classList.add('notification', type);
    notif.textContent = message;
    container.appendChild(notif);

    // Hiển thị animation
    setTimeout(() => notif.classList.add('show'), 100);

    // Ẩn sau duration
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => container.removeChild(notif), 500);
    }, duration);
}
