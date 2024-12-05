import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";



document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".grid")
    const scoreDisplay = document.querySelector("#score")
    const resultDisplay = document.querySelector("#result")


    const width = 4
    let squares = []
    let score = 0
    const firebaseConfig = {
        apiKey: "AIzaSyDz2sRbIAFVP5SHqzg_SmQBaPLG2TYnbAE",
        authDomain: "project-8130279698625975476.firebaseapp.com",
        projectId: "project-8130279698625975476",
        storageBucket: "project-8130279698625975476.appspot.com",
        messagingSenderId: "720719138643",
        appId: "1:720719138643:web:881b09fc16552cc0d5dba6"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();
    let email;
    loadLeaderboardRealTime();
    // Lấy email của người dùng đã đăng nhập
    auth.onAuthStateChanged(user => {
        if (user) {
            email = user.email;
            document.getElementById("userNameDisplay").textContent = email; // Hiển thị email
            getScore(email); // Lấy điểm số cho người dùng
            getHighScore(email); // Lấy điểm số cao nhất cho người dùng
        } else {
            console.log("No user is signed in.");
        }
    });


    async function getScore(email) {
        const docRef = doc(db, "scores", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            document.getElementById("user-score").textContent = docSnap.data().score;
        } else {
            console.log("No such document!");
        }
    }
    //bảng điểm 
    function loadLeaderboardRealTime() {
        const scoresCollection = collection(db, "scores");
        onSnapshot(scoresCollection, snapshot => {
            const leaderboardBody = document.getElementById("leaderboard-body");
            leaderboardBody.innerHTML = ""; // Xóa nội dung cũ trong bảng

            const scoresData = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() }; // Lưu ID tài liệu (email)
            });
            scoresData.sort((a, b) => b.highScore - a.highScore); // Sắp xếp theo highScore

            scoresData.forEach((player, index) => {
                const row = document.createElement("tr");
                const playerCell = document.createElement("td");
                const scoreCell = document.createElement("td");

                playerCell.textContent = player.id || `Player ${index + 1}`; // Hiển thị email từ ID tài liệu
                scoreCell.textContent = player.highScore || 0; // Hiển thị điểm cao nhất

                row.appendChild(playerCell);
                row.appendChild(scoreCell);
                leaderboardBody.appendChild(row);
            });
        });
    }
    document.getElementById("new-game-button").addEventListener("click", () => {
        restartGame();
    });

    // create the playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.innerHTML = 0;
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }
    createBoard();

    //generate a new number
    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2
            checkForGameOver()
        } else generate()
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)

                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)

                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + width * 2].innerHTML
            let totalFour = squares[i + width * 3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)

            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + width * 2].innerHTML = newColumn[2]
            squares[i + width * 3].innerHTML = newColumn[3]
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + width * 2].innerHTML
            let totalFour = squares[i + width * 3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)

            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + width * 2].innerHTML = newColumn[2]
            squares[i + width * 3].innerHTML = newColumn[3]
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + 1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    ///assign functions to keys
    function control(e) {
        if (e.key === "ArrowLeft") {
            keyLeft()
        } else if (e.key === "ArrowRight") {
            keyRight()
        } else if (e.key === "ArrowUp") {
            keyUp()
        } else if (e.key === "ArrowDown") {
            keyDown()
        }
    }
    document.addEventListener("keydown", control)

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    //check for the number 2048 in the squares to win
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                showPopup("You WIN!");
                document.removeEventListener("keydown", control);

                if (email) {
                    saveScore(email, score).then(() => {
                        console.log("Điểm số đã được lưu.");
                    }).catch((error) => {
                        console.error("Lỗi khi lưu điểm:", error);
                    });
                } else {
                    console.error("Không có email để lưu điểm.");
                }

                return;
            }
        }
    }
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                // Hiển thị popup thông báo thắng
                showPopup("You WIN!");
                document.removeEventListener("keydown", control);

                // Lưu điểm nếu có email
                if (email) {
                    saveScore(email, score).then(() => {
                        console.log("Điểm số đã được lưu.");
                    }).catch((error) => {
                        console.error("Lỗi khi lưu điểm:", error);
                    });
                } else {
                    console.error("Không có email để lưu điểm.");
                }

                // Xác định tỷ lệ nhận phần thưởng (50%)
                const rewardChance = Math.random() < 0.5; // 50% tỷ lệ
                if (rewardChance) {
                    showPopup("Congratulations! You've received a reward! Keep playing for more rewards.");
                } else {
                    showPopup("You've won! Keep playing to try your luck for a reward.");
                }

                // Cho phép tiếp tục chơi
                continueGame();

                return; // Thoát khỏi hàm khi điều kiện thắng được xử lý
            }
        }
    }
    // Hàm tiếp tục trò chơi
    function continueGame() {
        // Cho phép người chơi tiếp tục di chuyển
        document.addEventListener("keydown", control);
    }

    //check if there are no zeros on the board to lose
    // Lấy email của người dùng đã đăng nhập
    auth.onAuthStateChanged(user => {
        if (user) {
            email = user.email; // Sửa đổi biến toàn cục
            document.getElementById("userNameDisplay").textContent = email; // Hiển thị email
            getScore(email); // Lấy điểm số cho người dùng
        } else {
            console.log("No user is signed in.");
        }
    });


    // Lấy email của người dùng đã đăng nhập
    auth.onAuthStateChanged(user => {
        if (user) {
            email = user.email; // Sửa đổi biến toàn cục
            document.getElementById("userNameDisplay").textContent = email; // Hiển thị email
            getScore(email); // Lấy điểm số cho người dùng
        } else {
            console.log("No user is signed in.");
        }
    });

    // Trong hàm checkForGameOver
    function checkForGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++;
            }
        }
        if (zeros === 0) {
            console.log("Trò chơi kết thúc: Không còn số 0");
            console.log("Điểm số cuối cùng trước khi lưu:", score);

            let rewardAmount = 0;

            // Liên kết điểm với thông báo
            const rewardMessages = {
                1: "Bạn đã đạt 1000 điểm! Nhận 1 phần thưởng.",
                2: "Bạn đã đạt 2000 điểm! Nhận 2 phần thưởng.",
                3: "Bạn đã đạt 5000 điểm! Nhận 3 phần thưởng."
            };

            if (score >= 5000) {
                rewardAmount = 3;
            } else if (score >= 2000) {
                rewardAmount = 2;
            } else if (score >= 1000) {
                rewardAmount = 1;
            }

            // Random xác suất nhận phần thưởng
            const isLucky = Math.random() < 0.5; // 50% cơ hội nhận quà

            if (rewardAmount > 0 && isLucky) {
                // Người chơi may mắn nhận thưởng
                showPopup(`Chúc mừng! ${rewardMessages[rewardAmount]}`);
            } else if (rewardAmount > 0) {
                // Người chơi không nhận thưởng
                showPopup(`Bạn đã đạt ${score} điểm! Tiếp tục cố gắng để thử vận may.`);
            } else {
                // Dưới 1000 điểm
                showPopup(`Bạn đã đạt ${score} điểm! Tiếp tục cố gắng để nhận phần thưởng.`);
            }

            // Kết nối ví và gửi thưởng nếu có
            connectWallet().then((walletAddress) => {
                if (walletAddress && isLucky) {
                    sendReward(walletAddress, rewardAmount);
                }
            });

            // Lưu điểm số
            if (email) {
                saveScore(email, score).then(() => {
                    console.log("Điểm số đã được lưu.");
                }).catch((error) => {
                    console.error("Lỗi khi lưu điểm:", error);
                });
            } else {
                console.error("Không có email để lưu điểm.");
            }

            // Kết thúc trò chơi
            document.removeEventListener("keydown", control);
            setTimeout(clear, 3000);
        }
    }






    async function getHighScore(email) {
        const docRef = doc(db, "scores", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const scoreData = docSnap.data();
            document.getElementById("highScoreDisplay").textContent = scoreData.highScore || 0; // Hiển thị điểm số cao nhất
        } else {
            console.log("No high score document!");
        }
    }

    async function saveScore(email, score) {
        const docRef = doc(db, "scores", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Nếu đã có tài liệu, cập nhật điểm số nếu điểm số mới cao hơn
            const existingScore = docSnap.data().score || 0;
            const highScore = Math.max(existingScore, score);
            await setDoc(docRef, { score: score, highScore: highScore });
        } else {
            // Nếu chưa có tài liệu, tạo mới
            await setDoc(docRef, { score: score, highScore: score });
        }
    }




    function clear() {
        clearInterval(myTimer)
    }
    function showPopup(message) {
        const popup = document.getElementById("game-over-popup");
        const messageDisplay = document.getElementById("game-over-message");
        const okButton = document.getElementById("ok-button");

        messageDisplay.textContent = message;
        popup.classList.remove("hidden");

        // Xử lý khi nhấn nút OK
        okButton.onclick = () => {
            popup.classList.add("hidden");
            restartGame(); // Gọi hàm khởi động lại trò chơi
        };
    }

    function restartGame() {
        // Reset trạng thái các ô
        squares.forEach(square => (square.innerHTML = 0));
        score = 0;

        // Cập nhật giao diện
        scoreDisplay.textContent = score;
        document.getElementById("score").textContent = score;

        // Tạo lại bảng mới với hai ô khởi tạo
        generate();
        generate();

        // Kích hoạt lại sự kiện bàn phím
        document.addEventListener("keydown", control);

        console.log("New game started!");
    }

    async function connectWallet() {
        const provider = window.solana;

        if (provider && provider.isPhantom) {
            try {
                const response = await provider.connect();
                console.log("Kết nối ví thành công:", response.publicKey.toString());
                return response.publicKey.toString();
            } catch (err) {
                console.error("Kết nối bị từ chối:", err);
                alert("Bạn đã từ chối yêu cầu kết nối. Vui lòng cho phép kết nối ví để tiếp tục.");
            }
        } else {
            alert("Vui lòng cài đặt ví Phantom.");
        }
    }

    async function sendReward(walletAddress, amount) {
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

        const fromWallet = solanaWeb3.Keypair.generate(); // Ví bạn sử dụng để gửi token
        const toWallet = new solanaWeb3.PublicKey(walletAddress);

        // Số lượng token (cần phải có token đã được tạo trên mạng)
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toWallet,
                lamports: amount * solanaWeb3.LAMPORTS_PER_SOL, // Chuyển đổi SOL sang lamports
            })
        );

        const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, {
            signers: [fromWallet],
        });

        console.log("Đã gửi phần thưởng:", signature);
    }


    // Xử lý sự kiện khi người dùng nhấn nút Log Out
    document.getElementById("logout-button").addEventListener("click", function () {
        // Xóa cookie của userEmail
        document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Chuyển hướng về trang login
        window.location.href = "login.html"; // Đảm bảo file login.html có tồn tại
    });

    // Hàm kiểm tra cookie userEmail và chuyển hướng nếu không tồn tại
    function checkLoginStatus() {
        const cookies = document.cookie.split("; ");
        const userEmailCookie = cookies.find(cookie => cookie.startsWith("userEmail="));
        if (!userEmailCookie) {
            // Không có cookie userEmail, chuyển hướng về trang login
            window.location.href = "login.html";
        }
    }

    // Kiểm tra trạng thái đăng nhập ngay khi tải trang
    checkLoginStatus();



    //add colours
    function addColours() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = "#afa192"
            else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = "#eee4da"
            else if (squares[i].innerHTML == 4) squares[i].style.backgroundColor = "#ede0c8"
            else if (squares[i].innerHTML == 8) squares[i].style.backgroundColor = "#f2b179"
            else if (squares[i].innerHTML == 16) squares[i].style.backgroundColor = "#ffcea4"
            else if (squares[i].innerHTML == 32) squares[i].style.backgroundColor = "#e8c064"
            else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = "#ffab6e"
            else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = "#fd9982"
            else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = "#ead79c"
            else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = "#76daff"
            else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = "#beeaa5"
            else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = "#d7d4f0"
        }
    }
    addColours()

    let myTimer = setInterval(addColours, 50)
})


