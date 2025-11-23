document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Vui lòng nhập đầy đủ tên người dùng và mật khẩu.');
        return;
    }

    // Đây là ví dụ placeholder, bạn có thể thay bằng API xác thực
    if (username === 'admin' && password === '123456') {
        alert('Đăng nhập thành công!');
        window.location.href = 'index.html'; // chuyển sang trang chính
    } else {
        alert('Tên người dùng hoặc mật khẩu không đúng.');
    }
});
