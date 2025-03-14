document.addEventListener('DOMContentLoaded', () => {
    // Get the current user
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/'; // Redirect to login if no user is found
        return;
    }

    // Load transactions
    const transactions = user.transactions;
    console.log('Transactions:', transactions); // Debug: Log transactions

    // Calculate totals
    const totalIncome = calculateTotal(transactions, 'income');
    const totalExpense = calculateTotal(transactions, 'expense');
    const remainingBalance = user.budget - totalExpense;

    // Display totals on the dashboard
    document.getElementById('totalIncome').textContent = `₹${totalIncome.toLocaleString()}`;
    document.getElementById('totalExpense').textContent = `₹${totalExpense.toLocaleString()}`;
    document.getElementById('remainingBalance').textContent = `₹${remainingBalance.toLocaleString()}`;

    // Render charts
    renderCategoryChart(transactions);
    renderTrendChart(transactions);

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

// Function to get the current user
function getCurrentUser() {
    const username = localStorage.getItem('kharcha_currentUser');
    const users = JSON.parse(localStorage.getItem('kharcha_users')) || [];
    return users.find(u => u.username === username);
}

// Function to calculate total income or expenses
function calculateTotal(transactions, type) {
    return transactions
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
}

// Function to render the category chart
function renderCategoryChart(transactions) {
    const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Miscellaneous'];
    const categoryData = categories.map(cat => 
        transactions
            .filter(t => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0)
    );

    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: categoryData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Function to render the trend chart
function renderTrendChart(transactions) {
    const dates = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyExpenses = dates.map(date => 
        transactions
            .filter(t => t.type === 'expense' && t.date === date)
            .reduce((sum, t) => sum + t.amount, 0)
    );

    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Expenses',
                data: dailyExpenses,
                borderColor: '#2962ff',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            }
        }
    });
}

// Function to handle logout
function logout() {
    localStorage.removeItem('kharcha_currentUser');
    window.location.href = '/';
}