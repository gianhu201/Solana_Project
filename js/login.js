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
            alert("Đăng nhập thành công!");
            window.location.href = "index.html";
        } catch (error) {
            alert("Đăng nhập thất bại: " + error.message);
        }
    });
});v