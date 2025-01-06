const socket = io('http://localhost:3000'); // เชื่อมต่อกับ Backend

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// ฟังก์ชันแสดงข้อความ
function addMessage(message) {
    const div = document.createElement('div');
    div.textContent = message;
    messagesDiv.appendChild(div);
}

// เมื่อคลิกปุ่มส่ง
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('sendMessage', message); // ส่งข้อความไปยังเซิร์ฟเวอร์
        messageInput.value = '';
    }
});

// รับข้อความจากเซิร์ฟเวอร์
socket.on('receiveMessage', (message) => {
    addMessage(message); // แสดงข้อความในกล่องแชต
});