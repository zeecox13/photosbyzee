// Admin Dashboard JavaScript

// Authentication
let adminToken = null;

// Check for existing session
document.addEventListener('DOMContentLoaded', function() {
    adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        verifyAdminSession();
    }
});

// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminError');
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            adminToken = data.token;
            localStorage.setItem('adminToken', adminToken);
            showDashboard();
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        // Demo mode - allow access with demo credentials
        if (email === 'admin@photosbyzee.com' && password === 'demo2024') {
            adminToken = 'demo-token';
            localStorage.setItem('adminToken', adminToken);
            showDashboard();
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Login failed. Please try again.';
        }
    }
});

function verifyAdminSession() {
    fetch('/api/admin/verify', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.valid) {
            showDashboard();
        } else {
            localStorage.removeItem('adminToken');
            adminToken = null;
        }
    })
    .catch(() => {
        // In demo mode, just show dashboard
        showDashboard();
    });
}

function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
    loadDashboardData();
}

function adminLogout() {
    localStorage.removeItem('adminToken');
    adminToken = null;
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('dashboardContent').style.display = 'none';
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load section data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'overview':
            loadOverview();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'galleries':
            loadGalleries();
            break;
        case 'clients':
            loadClients();
            break;
        case 'availability':
            loadAvailability();
            break;
        case 'payments':
            loadPayments();
            break;
    }
}

// Load Dashboard Data
function loadDashboardData() {
    loadOverview();
}

function loadOverview() {
    // Fetch dashboard stats
    fetch('/api/admin/stats', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('upcomingCount').textContent = data.upcomingBookings || 0;
        document.getElementById('pendingGalleries').textContent = data.pendingGalleries || 0;
        document.getElementById('monthRevenue').textContent = `$${data.monthRevenue || 0}`;
        document.getElementById('activeClients').textContent = data.activeClients || 0;
    })
    .catch(() => {
        // Demo data
        document.getElementById('upcomingCount').textContent = '5';
        document.getElementById('pendingGalleries').textContent = '3';
        document.getElementById('monthRevenue').textContent = '$2,450';
        document.getElementById('activeClients').textContent = '12';
    });
}

function loadBookings() {
    fetch('/api/admin/bookings', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        renderBookingsTable(data.bookings);
    })
    .catch(() => {
        // Demo data
        renderBookingsTable([
            {
                date: '2024-02-15',
                time: '2:00 PM',
                client: 'Jane Smith',
                service: 'Family Session',
                status: 'Confirmed',
                deposit: '$175',
                id: 1
            }
        ]);
    });
}

function renderBookingsTable(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>${booking.time}</td>
            <td>${booking.client}</td>
            <td>${booking.service}</td>
            <td><span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span></td>
            <td>${booking.deposit}</td>
            <td>
                <button onclick="viewBooking(${booking.id})">View</button>
                <button onclick="editBooking(${booking.id})">Edit</button>
            </td>
        </tr>
    `).join('');
}

function loadGalleries() {
    fetch('/api/admin/galleries', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        renderGalleriesTable(data.galleries);
    })
    .catch(() => {
        renderGalleriesTable([]);
    });
}

function renderGalleriesTable(galleries) {
    const tbody = document.getElementById('galleriesTableBody');
    tbody.innerHTML = galleries.length > 0 ? galleries.map(gallery => `
        <tr>
            <td>${gallery.id}</td>
            <td>${gallery.clientName}</td>
            <td>${new Date(gallery.sessionDate).toLocaleDateString()}</td>
            <td>${gallery.password}</td>
            <td>${gallery.photoCount}</td>
            <td>${gallery.status}</td>
            <td>
                <button onclick="viewGallery('${gallery.id}')">View</button>
                <button onclick="editGallery('${gallery.id}')">Edit</button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="7">No galleries yet</td></tr>';
}

function loadClients() {
    fetch('/api/admin/clients', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        renderClientsTable(data.clients);
    })
    .catch(() => {
        renderClientsTable([]);
    });
}

function renderClientsTable(clients) {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = clients.length > 0 ? clients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.bookingCount}</td>
            <td>$${client.totalSpent}</td>
            <td>
                <button onclick="viewClient(${client.id})">View</button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="6">No clients yet</td></tr>';
}

function loadAvailability() {
    // Load calendar and recurring availability
    renderAvailabilityCalendar();
    loadRecurringSlots();
}

function renderAvailabilityCalendar() {
    // Similar to booking calendar but for admin editing
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // This would fetch and display availability for editing
}

function loadRecurringSlots() {
    fetch('/api/admin/availability/recurring', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        renderRecurringSlots(data.slots);
    })
    .catch(() => {
        renderRecurringSlots([]);
    });
}

function renderRecurringSlots(slots) {
    const container = document.getElementById('recurringSlots');
    container.innerHTML = slots.length > 0 ? slots.map(slot => `
        <div class="recurring-slot">
            <span>${slot.day} - ${slot.time}</span>
            <button onclick="deleteRecurringSlot(${slot.id})">Delete</button>
        </div>
    `).join('') : '<p>No recurring availability set</p>';
}

function loadPayments() {
    fetch('/api/admin/payments', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        renderPaymentsTable(data.payments);
    })
    .catch(() => {
        renderPaymentsTable([]);
    });
}

function renderPaymentsTable(payments) {
    const tbody = document.getElementById('paymentsTableBody');
    tbody.innerHTML = payments.length > 0 ? payments.map(payment => `
        <tr>
            <td>${new Date(payment.date).toLocaleDateString()}</td>
            <td>${payment.client}</td>
            <td>${payment.type}</td>
            <td>$${payment.amount}</td>
            <td>${payment.status}</td>
            <td>${payment.stripeId}</td>
            <td>
                <button onclick="viewPayment('${payment.id}')">View</button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="7">No payments yet</td></tr>';
}

// Action Functions
function refreshBookings() {
    loadBookings();
}

function createNewGallery() {
    alert('Create new gallery functionality - would open modal/form');
}

function addAvailability() {
    alert('Add availability functionality - would open form');
}

function exportClients() {
    alert('Export clients functionality - would download CSV');
}

function configureStripe() {
    alert('Stripe configuration - would open settings modal');
}

function configureEmail() {
    alert('Email configuration - would open settings modal');
}

function configureSMS() {
    alert('SMS configuration - would open settings modal');
}

function configureSecurity() {
    alert('Security settings - would open settings modal');
}

