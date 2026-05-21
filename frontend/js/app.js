// Router
const routes = {
    'home': renderHome,
    'menu': renderMenu,
    'reservation': renderReservation,
    'about': renderAbout,
    'contact': renderContact,
    'login': renderLogin,
    'register': renderRegister,
    'admin': renderAdmin
};

function router() {
    const hash = window.location.hash.slice(1) || 'home';
    const page = routes[hash] || renderHome;
    const app = document.getElementById('app');

    // Check admin route protection
    if (hash === 'admin' && !authManager.isAdmin()) {
        window.location.hash = '#login';
        return;
    }

    app.innerHTML = '';
    page(app);

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${hash}`);
    });

    window.scrollTo(0, 0);
}

// Page Renderers
function renderHome(container) {
    container.innerHTML = `
        <section class="hero">
            <div class="hero-content">
                <h1>Benvenuti a Bella Italia</h1>
                <p>Experience authentic Italian cuisine crafted with passion and the finest ingredients</p>
                <a href="#menu" class="btn-primary">View Our Menu</a>
                <a href="#reservation" class="btn-primary" style="margin-left: 1rem; background: transparent; border: 2px solid white;">Book a Table</a>
            </div>
        </section>

        <section class="section">
            <h2 class="section-title">Our Specialties</h2>
            <div class="menu-grid" id="featuredMenu">
                <div class="spinner" style="margin: 2rem auto; display: block;"></div>
            </div>
        </section>

        <section class="section" style="background: var(--secondary); color: white; border-radius: 20px; margin: 2rem 5%; max-width: none;">
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: var(--accent); margin-bottom: 1rem;">Why Choose Us?</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem;">
                    <div>
                        <i class="fas fa-utensils" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h3>Authentic Recipes</h3>
                        <p>Passed down through generations</p>
                    </div>
                    <div>
                        <i class="fas fa-leaf" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h3>Fresh Ingredients</h3>
                        <p>Sourced daily from local markets</p>
                    </div>
                    <div>
                        <i class="fas fa-wine-glass" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h3>Curated Wines</h3>
                        <p>Perfect pairings for every dish</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Load featured items
    loadFeaturedItems();
}

async function loadFeaturedItems() {
    try {
        const items = await api.getMenuItems();
        const featured = items.slice(0, 4);
        const container = document.getElementById('featuredMenu');
        container.innerHTML = featured.map(item => createMenuCard(item)).join('');
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

function createMenuCard(item) {
    return `
        <div class="menu-card">
            <img src="${item.imageUrl || 'https://via.placeholder.com/400x300'}" alt="${item.name}">
            <div class="menu-card-content">
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
                <div class="menu-card-footer">
                    <span class="price">$${item.price}</span>
                    <span class="badge badge-confirmed">${item.category}</span>
                </div>
            </div>
        </div>
    `;
}

function renderMenu(container) {
    container.innerHTML = `
        <section class="section">
            <h2 class="section-title">Our Menu</h2>
            <div class="menu-categories">
                <button class="category-btn active" onclick="filterMenu('ALL')">All</button>
                <button class="category-btn" onclick="filterMenu('PIZZA')">Pizza</button>
                <button class="category-btn" onclick="filterMenu('PASTA')">Pasta</button>
                <button class="category-btn" onclick="filterMenu('DRINKS')">Drinks</button>
                <button class="category-btn" onclick="filterMenu('DESSERTS')">Desserts</button>
            </div>
            <div class="menu-grid" id="menuGrid">
                <div class="spinner" style="margin: 2rem auto; display: block;"></div>
            </div>
        </section>
    `;
    loadMenuItems('ALL');
}

async function loadMenuItems(category) {
    const grid = document.getElementById('menuGrid');
    try {
        const items = category === 'ALL'
            ? await api.getMenuItems()
            : await api.getMenuByCategory(category);
        grid.innerHTML = items.map(item => createMenuCard(item)).join('');
    } catch (error) {
        grid.innerHTML = `<div class="alert alert-error">Error loading menu items</div>`;
    }
}

function filterMenu(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toUpperCase() === category ||
            (category === 'ALL' && btn.textContent === 'All'));
    });
    loadMenuItems(category);
}

function renderReservation(container) {
    container.innerHTML = `
        <section class="reservation-hero">
            <h2>Reserve Your Table</h2>
            <p>Book your dining experience with us</p>
        </section>
        <section class="section">
            <div class="form-container">
                <form id="reservationForm" onsubmit="handleReservation(event)">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="customerName" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone">
                    </div>
                    <div class="form-group">
                        <label>Date *</label>
                        <input type="date" name="reservationDate" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Time *</label>
                        <input type="time" name="reservationTime" required min="11:00" max="22:00">
                    </div>
                    <div class="form-group">
                        <label>Party Size *</label>
                        <select name="partySize" required>
                            ${Array.from({length: 10}, (_, i) => `<option value="${i+1}">${i+1} ${i === 0 ? 'Person' : 'People'}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Special Requests</label>
                        <textarea name="specialRequests" placeholder="Any dietary requirements or special occasions..."></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Book Table</button>
                </form>
            </div>
        </section>
    `;
}

async function handleReservation(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
        await api.createReservation(data);
        showAlert('Reservation submitted successfully! We will confirm shortly.', 'success');
        form.reset();
    } catch (error) {
        showAlert(error.message || 'Failed to create reservation', 'error');
    }
}

function renderAbout(container) {
    container.innerHTML = `
        <section class="section">
            <h2 class="section-title">Our Story</h2>
            <div class="about-content">
                <div class="about-image">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" alt="Restaurant Interior">
                </div>
                <div class="about-text">
                    <h3>A Family Legacy Since 1985</h3>
                    <p>Bella Italia was founded by the Romano family, who brought their cherished recipes from Naples to New York. What started as a small trattoria has grown into one of the city's most beloved Italian restaurants.</p>
                    <p>Our commitment to authenticity means we import specialty ingredients directly from Italy, while sourcing fresh produce from local farms. Every dish tells a story of tradition, passion, and the joy of sharing good food with loved ones.</p>
                    <p>Chef Marco Romano continues his father's legacy, combining time-honored techniques with modern culinary innovation to create an unforgettable dining experience.</p>
                </div>
            </div>
        </section>
    `;
}

function renderContact(container) {
    container.innerHTML = `
        <section class="section">
            <h2 class="section-title">Contact Us</h2>
            <div class="contact-grid">
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Address</h4>
                            <p>123 Pasta Lane<br>New York, NY 10001</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h4>Phone</h4>
                            <p>(555) 123-4567</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h4>Email</h4>
                            <p>info@bellaitalia.com</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <h4>Hours</h4>
                            <p>Mon-Thu: 11am - 10pm<br>Fri-Sat: 11am - 11pm<br>Sun: 12pm - 9pm</p>
                        </div>
                    </div>
                </div>
                <div class="form-container">
                    <form id="contactForm" onsubmit="handleContact(event)">
                        <div class="form-group">
                            <label>Name *</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" name="subject">
                        </div>
                        <div class="form-group">
                            <label>Message *</label>
                            <textarea name="message" required placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" class="btn-primary" style="width: 100%;">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    `;
}

async function handleContact(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
        await api.createContact(data);
        showAlert('Message sent successfully! We will get back to you soon.', 'success');
        form.reset();
    } catch (error) {
        showAlert(error.message || 'Failed to send message', 'error');
    }
}

function renderLogin(container) {
    if (authManager.isAuthenticated()) {
        window.location.hash = '#home';
        return;
    }

    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h2><i class="fas fa-user-circle"></i> Login</h2>
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Login</button>
                </form>
                <div class="auth-links">
                    <p>Don't have an account? <a href="#register">Register</a></p>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
        const response = await api.login(data);
        authManager.setAuth(response.token, {
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role
        });
        showAlert('Login successful!', 'success');
        window.location.hash = '#home';
    } catch (error) {
        showAlert(error.message || 'Invalid credentials', 'error');
    }
}

function renderRegister(container) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h2><i class="fas fa-user-plus"></i> Register</h2>
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required minlength="3">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required minlength="6">
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Register</button>
                </form>
                <div class="auth-links">
                    <p>Already have an account? <a href="#login">Login</a></p>
                </div>
            </div>
        </div>
    `;
}

async function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
        await api.register(data);
        showAlert('Registration successful! Please login.', 'success');
        window.location.hash = '#login';
    } catch (error) {
        showAlert(error.message || 'Registration failed', 'error');
    }
}

// Admin Dashboard
function renderAdmin(container) {
    container.innerHTML = `
        <div class="admin-container" style="display: flex;">
            <aside class="admin-sidebar">
                <div style="text-align: center; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h3><i class="fas fa-cog"></i> Admin Panel</h3>
                </div>
                <ul>
                    <li><a href="#" class="active" onclick="showAdminTab('dashboard', event)"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a href="#" onclick="showAdminTab('menu', event)"><i class="fas fa-utensils"></i> Menu Items</a></li>
                    <li><a href="#" onclick="showAdminTab('reservations', event)"><i class="fas fa-calendar-check"></i> Reservations</a></li>
                    <li><a href="#" onclick="showAdminTab('contacts', event)"><i class="fas fa-envelope"></i> Messages</a></li>
                </ul>
            </aside>
            <div class="admin-main" id="adminContent" style="flex: 1;">
                <div class="spinner" style="margin: 2rem auto; display: block;"></div>
            </div>
        </div>
    `;
    showAdminTab('dashboard');
}

async function showAdminTab(tab, e) {
    if (e) e.preventDefault();

    // Update sidebar active state
    document.querySelectorAll('.admin-sidebar a').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(tab)) {
            link.classList.add('active');
        }
    });

    const content = document.getElementById('adminContent');

    switch(tab) {
        case 'dashboard':
            renderAdminDashboard(content);
            break;
        case 'menu':
            await renderAdminMenu(content);
            break;
        case 'reservations':
            await renderAdminReservations(content);
            break;
        case 'contacts':
            await renderAdminContacts(content);
            break;
    }
}

async function renderAdminDashboard(container) {
    try {
        const [menuItems, reservations, contacts] = await Promise.all([
            api.getMenuItems(),
            api.getReservations(),
            api.getContacts()
        ]);

        container.innerHTML = `
            <h2>Dashboard Overview</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Total Menu Items</h4>
                    <div class="value">${menuItems.length}</div>
                </div>
                <div class="stat-card">
                    <h4>Total Reservations</h4>
                    <div class="value">${reservations.length}</div>
                </div>
                <div class="stat-card">
                    <h4>Pending Reservations</h4>
                    <div class="value">${reservations.filter(r => r.status === 'PENDING').length}</div>
                </div>
                <div class="stat-card">
                    <h4>New Messages</h4>
                    <div class="value">${contacts.filter(c => !c.isRead).length}</div>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load dashboard data</div>`;
    }
}

async function renderAdminMenu(container) {
    try {
        const items = await api.getMenuItems();
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Menu Management</h2>
                <button class="btn-primary" onclick="showMenuForm()"><i class="fas fa-plus"></i> Add Item</button>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.name}</td>
                                <td><span class="badge badge-confirmed">${item.category}</span></td>
                                <td>$${item.price}</td>
                                <td>${item.available ? '<span style="color: green;">●</span> Active' : '<span style="color: red;">●</span> Inactive'}</td>
                                <td>
                                    <button onclick="editMenuItem(${item.id})" style="background: none; border: none; color: var(--primary); cursor: pointer;"><i class="fas fa-edit"></i></button>
                                    <button onclick="deleteMenuItem(${item.id})" style="background: none; border: none; color: red; cursor: pointer;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load menu items</div>`;
    }
}

function showMenuForm(item = null) {
    const isEdit = !!item;
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <h2>${isEdit ? 'Edit' : 'Add'} Menu Item</h2>
        <div class="form-container" style="max-width: 600px;">
            <form id="menuForm" onsubmit="handleMenuSubmit(event, ${item?.id || 'null'})">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" value="${item?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description">${item?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Price *</label>
                    <input type="number" step="0.01" name="price" value="${item?.price || ''}" required>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required>
                        <option value="PIZZA" ${item?.category === 'PIZZA' ? 'selected' : ''}>Pizza</option>
                        <option value="PASTA" ${item?.category === 'PASTA' ? 'selected' : ''}>Pasta</option>
                        <option value="DRINKS" ${item?.category === 'DRINKS' ? 'selected' : ''}>Drinks</option>
                        <option value="DESSERTS" ${item?.category === 'DESSERTS' ? 'selected' : ''}>Desserts</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="url" name="imageUrl" value="${item?.imageUrl || ''}">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="available" ${item?.available !== false ? 'checked' : ''}>
                        Available
                    </label>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button type="submit" class="btn-primary">${isEdit ? 'Update' : 'Create'} Item</button>
                    <button type="button" class="btn-primary" style="background: var(--text-light);" onclick="showAdminTab('menu')">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

async function handleMenuSubmit(e, id) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    data.available = form.available.checked;
    data.price = parseFloat(data.price);

    try {
        if (id) {
            await api.updateMenuItem(id, data);
        } else {
            await api.createMenuItem(data);
        }
        showAlert('Menu item saved successfully!', 'success');
        showAdminTab('menu');
    } catch (error) {
        showAlert(error.message || 'Failed to save menu item', 'error');
    }
}

async function editMenuItem(id) {
    try {
        const items = await api.getMenuItems();
        const item = items.find(i => i.id === id);
        if (item) showMenuForm(item);
    } catch (error) {
        showAlert('Failed to load item', 'error');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
        await api.deleteMenuItem(id);
        showAlert('Item deleted successfully', 'success');
        showAdminTab('menu');
    } catch (error) {
        showAlert('Failed to delete item', 'error');
    }
}

async function renderAdminReservations(container) {
    try {
        const reservations = await api.getReservations();
        container.innerHTML = `
            <h2>Reservations</h2>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Party</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map(r => `
                            <tr>
                                <td>${r.id}</td>
                                <td>${r.customerName}<br><small>${r.email}</small></td>
                                <td>${r.reservationDate}</td>
                                <td>${r.reservationTime}</td>
                                <td>${r.partySize}</td>
                                <td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td>
                                <td>
                                    ${r.status === 'PENDING' ? `
                                        <button onclick="updateReservationStatus(${r.id}, 'CONFIRMED')" style="background: green; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">Confirm</button>
                                        <button onclick="updateReservationStatus(${r.id}, 'CANCELLED')" style="background: red; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">Cancel</button>
                                    ` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load reservations</div>`;
    }
}

async function updateReservationStatus(id, status) {
    try {
        await api.updateReservationStatus(id, status);
        showAlert(`Reservation ${status.toLowerCase()}`, 'success');
        showAdminTab('reservations');
    } catch (error) {
        showAlert('Failed to update reservation', 'error');
    }
}

async function renderAdminContacts(container) {
    try {
        const contacts = await api.getContacts();
        container.innerHTML = `
            <h2>Contact Messages</h2>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contacts.map(c => `
                            <tr style="${!c.isRead ? 'font-weight: bold; background: #fff3cd;' : ''}">
                                <td>${c.id}</td>
                                <td>${c.name}</td>
                                <td>${c.email}</td>
                                <td>${c.subject || '-'}</td>
                                <td>${c.message.substring(0, 50)}${c.message.length > 50 ? '...' : ''}</td>
                                <td>${new Date(c.createdAt).toLocaleDateString()}</td>
                                <td>
                                    ${!c.isRead ? `<button onclick="markAsRead(${c.id})" style="background: var(--primary); color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">Mark Read</button>` : '<span style="color: green;">✓ Read</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Failed to load messages</div>`;
    }
}

async function markAsRead(id) {
    try {
        await api.markContactAsRead(id);
        showAdminTab('contacts');
    } catch (error) {
        showAlert('Failed to mark as read', 'error');
    }
}

// Utility Functions
function showAlert(message, type) {
    const existing = document.querySelector('.alert-float');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-float`;
    alert.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;';
    alert.textContent = message;

    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
}

// Mobile Navigation
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Initialize auth UI
    authManager.updateUI();

    // Initialize router
    router();
    window.addEventListener('hashchange', router);
});

// Add slideIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);