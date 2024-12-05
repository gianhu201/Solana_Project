import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Đăng ký người dùng
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("passwordConfirm").value;

        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (password !== passwordConfirm) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
            // Lưu thông tin người dùng vào Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
            });
        
            alert("Tài khoản đã được đăng ký thành công!");
            window.location.href = "login.html";
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("Email này đã được sử dụng. Vui lòng chọn email khác.");
            } else {
                alert(error.message);
            }
        }
    });
});