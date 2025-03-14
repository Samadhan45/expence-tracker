document.addEventListener('DOMContentLoaded', () => {
    // Get the current user
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/'; // Redirect to login if no user is found
        return;
    }

    // Load transactions
    loadTransactions(user);

    // Add transaction form submission
    const addTransactionForm = document.getElementById('addTransactionForm');
    addTransactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTransaction(user);
    });

    // Show/hide transaction form
    document.querySelector('.transaction-header button').addEventListener('click', () => {
        document.getElementById('transactionForm').style.display = 'block';
    });

    document.getElementById('addTransactionForm').querySelector('button[type="button"]').addEventListener('click', () => {
        document.getElementById('transactionForm').style.display = 'none';
        addTransactionForm.reset();
    });
});

// Function to get the current user
function getCurrentUser() {
    const username = localStorage.getItem('kharcha_currentUser');
    const users = JSON.parse(localStorage.getItem('kharcha_users')) || [];
    return users.find(u => u.username === username);
}

// Function to load and display transactions
function loadTransactions(user) {
    const tbody = document.getElementById('transactionList');
    tbody.innerHTML = '';

    // Sort transactions by date (newest first)
    user.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display transactions in the table
    user.transactions.forEach(txn => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(txn.date).toLocaleDateString()}</td>
            <td><span class="txn-type ${txn.type}">${txn.type}</span></td>
            <td>${txn.category}</td>
            <td class="${txn.type}">₹${txn.amount.toLocaleString()}</td>
            <td>${txn.description}</td>
            <td>
                <button onclick="editTransaction('${txn.id}')">Edit</button>
                <button onclick="deleteTransaction('${txn.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to add a new transaction
function addTransaction(user) {
    const form = document.getElementById('addTransactionForm');
    const newTransaction = {
        id: Date.now(), // Unique ID
        type: form.elements.txnType.value,
        category: form.elements.txnCategory.value,
        amount: parseFloat(form.elements.txnAmount.value),
        date: form.elements.txnDate.value,
        description: form.elements.txnDesc.value
    };

    // Add transaction to the user's data
    user.transactions.push(newTransaction);
    updateUserData(user);

    // Reload transactions
    loadTransactions(user);

    // Hide the form and reset it
    document.getElementById('transactionForm').style.display = 'none';
    form.reset();
}

// Function to edit a transaction
function editTransaction(id) {
    const user = getCurrentUser();
    const txn = user.transactions.find(t => t.id === id);
    const form = document.getElementById('addTransactionForm');

    // Populate the form with the transaction data
    form.elements.txnType.value = txn.type;
    form.elements.txnCategory.value = txn.category;
    form.elements.txnAmount.value = txn.amount;
    form.elements.txnDate.value = txn.date;
    form.elements.txnDesc.value = txn.description;

    // Show the form
    document.getElementById('transactionForm').style.display = 'block';

    // Update the form's submit handler to edit the transaction
    form.onsubmit = (e) => {
        e.preventDefault();
        txn.type = form.elements.txnType.value;
        txn.category = form.elements.txnCategory.value;
        txn.amount = parseFloat(form.elements.txnAmount.value);
        txn.date = form.elements.txnDate.value;
        txn.description = form.elements.txnDesc.value;

        updateUserData(user);
        loadTransactions(user);

        // Hide the form and reset it
        document.getElementById('transactionForm').style.display = 'none';
        form.reset();
    };
}

// Function to delete a transaction
function deleteTransaction(id) {
    const user = getCurrentUser();
    user.transactions = user.transactions.filter(t => t.id !== id);
    updateUserData(user);
    loadTransactions(user);
}

// Function to update user data in localStorage
function updateUserData(user) {
    const users = JSON.parse(localStorage.getItem('kharcha_users'));
    const index = users.findIndex(u => u.username === user.username);
    users[index] = user;
    localStorage.setItem('kharcha_users', JSON.stringify(users));
}