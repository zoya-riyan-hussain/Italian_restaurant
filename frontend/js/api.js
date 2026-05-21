const API_BASE_URL = 'http://localhost:8090/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Menu
    async getMenuItems() {
        return this.request('/menu');
    }

    async getMenuByCategory(category) {
        return this.request(`/menu/category/${category}`);
    }

    async createMenuItem(item) {
        return this.request('/menu', {
            method: 'POST',
            body: JSON.stringify(item)
        });
    }

    async updateMenuItem(id, item) {
        return this.request(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(item)
        });
    }

    async deleteMenuItem(id) {
        return this.request(`/menu/${id}`, {
            method: 'DELETE'
        });
    }

    // Reservations
    async getReservations() {
        return this.request('/reservations');
    }

    async createReservation(reservation) {
        return this.request('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservation)
        });
    }

    async updateReservationStatus(id, status) {
        return this.request(`/reservations/${id}/status?status=${status}`, {
            method: 'PUT'
        });
    }

    async deleteReservation(id) {
        return this.request(`/reservations/${id}`, {
            method: 'DELETE'
        });
    }

    // Contacts
    async getContacts() {
        return this.request('/contacts');
    }

    async createContact(contact) {
        return this.request('/contacts', {
            method: 'POST',
            body: JSON.stringify(contact)
        });
    }

    async markContactAsRead(id) {
        return this.request(`/contacts/${id}/read`, {
            method: 'PUT'
        });
    }

    async deleteContact(id) {
        return this.request(`/contacts/${id}`, {
            method: 'DELETE'
        });
    }
}

const api = new ApiService();