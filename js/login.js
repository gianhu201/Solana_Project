import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDz2sRbIAFVP5SHqzg_SmQBaPLG2TYnbAE",
    authDomain: "project-8130279698625975476.firebaseapp.com",
    projectId: "project-8130279698625975476",
    storageBucket: "project-8130279698625975476.appspot.com",
    messagingSenderId: "720719138643",
    appId: "1:720719138643:web:881b09fc16552cc0d5dba6"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Đăng nhập người dùng
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".login100-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("input[name='email']").value;
        const password = document.querySelector("input[name='pass']").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Đăng nhập thành công
            alert("Đăng nhập thành công!");

            // Lưu email vào cookie với thời gian tồn tại 5 giờ
            setCookie("userEmail", email, 5);

            // Chuyển hướng sang trang chính
            window.location.href = "index.html";
        } catch (error) {
            alert("Đăng nhập thất bại: " + error.message);
        }
    });
});

// Hàm lưu cookie
function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000); // Đặt thời gian hết hạn
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

