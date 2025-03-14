document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('kharcha_users')) || [];
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authMessage = document.getElementById('authMessage');

    console.log('Current Users:', users);

    // Toggle between Login and Signup forms
    document.querySelectorAll('.form-toggle button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.form-toggle button.active').classList.remove('active');
            e.target.classList.add('active');
            document.querySelector('.auth-form.active').classList.remove('active');
            document.getElementById(`${e.target.id.replace('Btn', 'Form')}`).classList.add('active');
        });
    });

    // Signup Functionality
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value.trim();
        const password = document.getElementById('signupPassword').value.trim();

        if (!username || !password) {
            showMessage('Username and password are required!', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters!', 'error');
            return;
        }

        if (users.some(user => user.username === username)) {
            showMessage('Username already exists!', 'error');
            return;
        }

        const newUser = {
            username,
            password: btoa(password),
            budget: 10000,
            transactions: generateSampleData()
        };

        users.push(newUser);
        localStorage.setItem('kharcha_users', JSON.stringify(users));
        showMessage('Account created successfully! Please login.', 'success');
        signupForm.reset();

        console.log('Updated Users:', users);
        console.log('localStorage:', localStorage.getItem('kharcha_users'));
    });

    // Login Functionality
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        console.log('Login Attempt:', { username, password });

        const user = users.find(u => u.username === username);

        console.log('User Found:', user);

        if (!user) {
            showMessage('Username not found!', 'error');
            return;
        }

        const decodedPassword = atob(user.password);
        if (decodedPassword !== password) {
            showMessage('Invalid password!', 'error');
            return;
        }

        localStorage.setItem('kharcha_currentUser', username);
        showMessage('Login successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });

    function showMessage(text, type) {
        authMessage.textContent = text;
        authMessage.className = `message ${type}`;
        authMessage.style.display = 'block';
        setTimeout(() => authMessage.style.display = 'none', 3000);
    }

    function generateSampleData() {
        const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Miscellaneous'];
        const months = [
            { name: 'December 2023', days: 31 },
            { name: 'January 2024', days: 31 },
            { name: 'February 2024', days: 29 },
            { name: 'March 2024', days: 31 }
        ];

        const transactions = [];

        months.forEach((month, monthIndex) => {
            let monthlyTotal = 0;
            const transactionCount = Math.floor(Math.random() * 11) + 20;

            for (let i = 0; i < transactionCount; i++) {
                const category = categories[Math.floor(Math.random() * categories.length)];
                const amount = getRandomAmount(category);
                const date = new Date(2023, 11 + monthIndex, Math.floor(Math.random() * month.days) + 1);
                const description = getDescription(category);

                transactions.push({
                    id: date.getTime() + i,
                    type: 'expense',
                    category,
                    amount,
                    date: date.toISOString().split('T')[0],
                    description
                });

                monthlyTotal += amount;
            }

            const adjustment = (10000 - monthlyTotal) / transactionCount;
            transactions
                .filter(t => t.date.startsWith(`2023-${12 + monthIndex}`))
                .forEach(t => t.amount += adjustment);
        });

        console.log('Generated Transactions:', transactions); // Debug: Log generated transactions
        return transactions;
    }

    function getRandomAmount(category) {
        switch (category) {
            case 'Food':
                return Math.floor(Math.random() * 500) + 100;
            case 'Transport':
                return Math.floor(Math.random() * 300) + 50;
            case 'Shopping':
                return Math.floor(Math.random() * 2000) + 500;
            case 'Entertainment':
                return Math.floor(Math.random() * 1000) + 200;
            case 'Miscellaneous':
                return Math.floor(Math.random() * 800) + 100;
            default:
                return 0;
        }
    }

    function getDescription(category) {
        const descriptions = {
            Food: ['Lunch at restaurant', 'Groceries', 'Snacks', 'Dinner with friends', 'Tea/Coffee'],
            Transport: ['Fuel refill', 'Cab ride', 'Bus fare', 'Train ticket', 'Auto rickshaw'],
            Shopping: ['New clothes', 'Mobile accessory', 'Shoes', 'Gadget purchase', 'Grocery shopping'],
            Entertainment: ['Movie tickets', 'Concert', 'Netflix subscription', 'Amusement park', 'Sports event'],
            Miscellaneous: ['Books', 'Stationery', 'Medical expense', 'Gift', 'Donation']
        };
        return descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
    }

    function addPreloadedTransactions() {
        const users = JSON.parse(localStorage.getItem('kharcha_users')) || [];
        const samadhan = users.find(user => user.username === 'samadhan');

        if (samadhan && (!samadhan.transactions || samadhan.transactions.length === 0)) {
            samadhan.transactions = generateSampleData();
            localStorage.setItem('kharcha_users', JSON.stringify(users));
        }
    }

    addPreloadedTransactions();
});