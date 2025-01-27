// เชื่อมต่อกับ Backend 
const socket = io('http://172.20.10.3:3000');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const emojiButton = document.getElementById('emoji-btn'); // ปุ่มอิโมจิ
const emojiContainer = document.getElementById('emoji-container'); // กล่องอิโมจิ
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-btn');
let username = "";

// ฟังก์ชันเพิ่มข้อความในกล่องแชต
function addMessage(content, isUser, senderName, time) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', isUser ? 'user' : 'other');

  const senderDiv = document.createElement('div');
  senderDiv.classList.add('message-sender');
  senderDiv.textContent = senderName;

  const messageContent = document.createElement('div');
  messageContent.textContent = content;

  const timeDiv = document.createElement('div');
  timeDiv.classList.add('message-time');
  timeDiv.textContent = time;

  messageDiv.appendChild(senderDiv);
  messageDiv.appendChild(messageContent);
  messageDiv.appendChild(timeDiv);

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// การเข้าสู่ระบบ
loginButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    socket.emit('join', username);
    localStorage.setItem('chatUsername', username); // บันทึก username ใน localStorage
  }
});

// การส่งข้อความ
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const currentTime = new Date().toLocaleTimeString();
    const messageData = { message, sender: username, time: currentTime };
    addMessage(message, true, username, currentTime); // แสดงข้อความในหน้าต่างแชททันที
    socket.emit('chat message', messageData); // ส่งไปยังเซิร์ฟเวอร์
    localStorage.setItem('lastMessage', JSON.stringify(messageData)); // บันทึกข้อความใน localStorage
    messageInput.value = ''; // ล้างช่องป้อนข้อความ
  }
});

// รับข้อความจากเซิร์ฟเวอร์
socket.on('chat message', (data) => {
  addMessage(data.message, false, data.sender, data.time); // แสดงข้อความจากผู้อื่น
});

// ฟังก์ชันแสดง/ซ่อนอิโมจิ
emojiButton.addEventListener('click', () => {
  emojiContainer.style.display = emojiContainer.style.display === 'block' ? 'none' : 'block';
});

// เพิ่มอิโมจิลงในข้อความ
emojiContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN') {
    messageInput.value += event.target.textContent; // เพิ่มอิโมจิในข้อความ
  }
});

// เเสดงข้อความลิ้งหากัน
window.addEventListener('storage', (event) => {
  if (event.key === 'lastMessage' && event.newValue) {
    const data = JSON.parse(event.newValue);
    if (data.sender !== username) { // ตรวจสอบว่าข้อความไม่ใช่ของผู้ใช้ปัจจุบัน
      addMessage(data.message, false, data.sender, data.time);
    }
  }
});

// ลงทะเบียน Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  });
}
