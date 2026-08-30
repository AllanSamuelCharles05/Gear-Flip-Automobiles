/**
 * GearFlip Automobiles - Full-Stack Client Script
 * Connects frontend interface with Node.js/Express REST APIs
 */

// ================= API BASE URL CONFIGURATION =================
const getApiBaseUrl = () => {
    if (window.location.port === '3000') {
        return '/api';
    }
    // For VS Code Live Server (port 5500) or other static server
    return 'http://localhost:3000/api';
};

const API_BASE = getApiBaseUrl();

// ================= APPLICATION STATE =================
const state = {
    filters: {
        search: '',
        category: 'All',
        body_type: 'All Cars',
        brand: '',
        location: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        fuel_type: '',
        transmission: '',
        sort: 'Newest First'
    },
    viewMode: 'grid', // 'grid' | 'list'
    wishlistIds: new Set(),
    currentUser: null,
    guestToken: getOrCreateGuestToken(),
    searchDebounceTimer: null
};

// Unique guest token for persisting guest wishlists
function getOrCreateGuestToken() {
    let token = localStorage.getItem('gearflip_guest_token');
    if (!token) {
        token = 'guest_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
        localStorage.setItem('gearflip_guest_token', token);
    }
    return token;
}


// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    loadUserSession();
    syncWishlistIds();
    setupSearchListener();
    setupOutsideDropdownListener();
    fetchVehicles();
});


// ================= AUTHENTICATION & SESSION =================
function loadUserSession() {
    const savedUser = localStorage.getItem('gearflip_user');
    const savedToken = localStorage.getItem('gearflip_token');
    if (savedUser && savedToken) {
        try {
            state.currentUser = JSON.parse(savedUser);
            updateUserHeaderUI();
        } catch (e) {
            console.error('Failed to parse saved user', e);
        }
    }
}

function updateUserHeaderUI() {
    const accountText = document.getElementById('userAccountText');
    const avatarIcon = document.getElementById('userAvatarIcon');
    if (state.currentUser) {
        accountText.textContent = state.currentUser.name.split(' ')[0];
        avatarIcon.textContent = '👤';
    } else {
        accountText.textContent = 'Login';
        avatarIcon.textContent = '♙';
    }
}


// ================= FETCH & RENDER VEHICLES =================
async function fetchVehicles() {
    const container = document.getElementById('carsContainer');
    const countText = document.getElementById('vehicleCountText');

    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading vehicles...</p>
        </div>
    `;

    try {
        const queryParams = new URLSearchParams();
        if (state.filters.search) queryParams.append('search', state.filters.search);
        if (state.filters.category && state.filters.category !== 'All') queryParams.append('category', state.filters.category);
        if (state.filters.body_type && state.filters.body_type !== 'All Cars') queryParams.append('body_type', state.filters.body_type);
        if (state.filters.brand) queryParams.append('brand', state.filters.brand);
        if (state.filters.location && state.filters.location !== 'All India') queryParams.append('location', state.filters.location);
        if (state.filters.minPrice) queryParams.append('minPrice', state.filters.minPrice);
        if (state.filters.maxPrice) queryParams.append('maxPrice', state.filters.maxPrice);
        if (state.filters.minYear) queryParams.append('minYear', state.filters.minYear);
        if (state.filters.maxYear) queryParams.append('maxYear', state.filters.maxYear);
        if (state.filters.fuel_type) queryParams.append('fuel_type', state.filters.fuel_type);
        if (state.filters.transmission) queryParams.append('transmission', state.filters.transmission);
        if (state.filters.sort) queryParams.append('sort', state.filters.sort);

        const response = await fetch(`${API_BASE}/vehicles?${queryParams.toString()}`);
        if (!response.ok) throw new Error('API server returned error');

        const result = await response.json();
        const vehicles = result.data || [];

        countText.textContent = `${vehicles.length} Vehicles Available`;

        if (vehicles.length === 0) {
            container.innerHTML = `
                <div class="loading-state empty-state">
                    <div class="empty-icon">🚗💨</div>
                    <h3>No Vehicles Match Your Criteria</h3>
                    <p>Try adjusting your search terms or clearing active filters.</p>
                    <button class="btn-primary" style="margin-top: 15px;" onclick="clearAllFilters()">Reset All Filters</button>
                </div>
            `;
            return;
        }

        renderVehicleCards(vehicles);
    } catch (error) {
        console.error('Error loading vehicles:', error);
        container.innerHTML = `
            <div class="loading-state empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Unable to Connect to Backend Server</h3>
                <p>Ensure the Node.js server is running on <code>http://localhost:3000</code>.</p>
                <button class="btn-primary" style="margin-top: 15px;" onclick="fetchVehicles()">Retry Connection</button>
            </div>
        `;
    }
}

function renderVehicleCards(vehicles) {
    const container = document.getElementById('carsContainer');
    container.innerHTML = vehicles.map(v => {
        const isWishlisted = state.wishlistIds.has(v.id);
        const formattedPrice = formatINR(v.price);
        const formattedKm = Number(v.km_driven).toLocaleString('en-IN') + ' km';
        const tagClass = getTagClass(v.price_tag);

        return `
            <div class="car-card" id="car-card-${v.id}">
                <div class="car-image">
                    <img src="${escapeHtml(v.image_url)}" alt="${escapeHtml(v.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85'">
                    
                    <span class="car-tag-badge ${tagClass}">${escapeHtml(v.price_tag || 'VERIFIED')}</span>
                    
                    <button 
                        class="heart-btn ${isWishlisted ? 'active' : ''}" 
                        onclick="toggleWishlist(${v.id}, this)"
                        title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
                    >
                        ${isWishlisted ? '♥' : '♡'}
                    </button>
                </div>

                <div class="car-details">
                    <h3>${escapeHtml(v.title)}</h3>
                    
                    <p class="car-info">
                        ${v.year} &nbsp;•&nbsp; ${escapeHtml(v.fuel_type)} &nbsp;•&nbsp; ${formattedKm}
                    </p>

                    <p class="location-text">
                        📍 ${escapeHtml(v.location)}${v.state ? ', ' + escapeHtml(v.state) : ''}
                    </p>

                    <div class="price-row">
                        <strong>${formattedPrice}</strong>
                        <span class="price-tag ${tagClass}">${escapeHtml(v.price_tag || 'GOOD PRICE')}</span>
                    </div>

                    <button class="details-btn" onclick="openVehicleDetails(${v.id})">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
}


// ================= SEARCH & FILTER HANDLING =================
function setupSearchListener() {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => {
        clearTimeout(state.searchDebounceTimer);
        state.searchDebounceTimer = setTimeout(() => {
            state.filters.search = e.target.value.trim();
            fetchVehicles();
        }, 350);
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    });
}

function triggerSearch() {
    const input = document.getElementById('searchInput');
    state.filters.search = input.value.trim();
    fetchVehicles();
}

function filterByCategory(categoryName, element) {
    state.filters.category = categoryName;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }

    const title = document.getElementById('sectionTitle');
    title.textContent = categoryName === 'All' ? 'All Vehicles for Sale' : `${categoryName} for Sale`;

    fetchVehicles();
}

function filterByBodyType(bodyTypeName, element) {
    state.filters.body_type = bodyTypeName;

    document.querySelectorAll('.vehicle-type').forEach(el => el.classList.remove('selected'));
    if (element) {
        element.classList.add('selected');
    }

    fetchVehicles();
}

function toggleDropdown(dropdownId) {
    const menu = document.getElementById(dropdownId);
    const isShowing = menu.classList.contains('show');

    // Close all open dropdowns first
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));

    if (!isShowing) {
        menu.classList.add('show');
    }
}

function setupOutsideDropdownListener() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown-wrapper')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        }
    });
}

function selectFilter(filterKey, value, labelText) {
    state.filters[filterKey] = value;

    // Update filter label
    if (filterKey === 'location') document.getElementById('filterLocationLabel').textContent = labelText;
    if (filterKey === 'brand') document.getElementById('filterBrandLabel').textContent = labelText;
    if (filterKey === 'minYear') document.getElementById('filterYearLabel').textContent = labelText;
    if (filterKey === 'fuel_type') document.getElementById('filterFuelLabel').textContent = labelText;
    if (filterKey === 'transmission') document.getElementById('filterTransmissionLabel').textContent = labelText;

    // Close dropdown
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    fetchVehicles();
}

function selectPriceFilter(min, max, labelText) {
    state.filters.minPrice = min;
    state.filters.maxPrice = max;
    document.getElementById('filterPriceLabel').textContent = labelText;
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    fetchVehicles();
}

function applyFilters() {
    fetchVehicles();
    showToast('Filters applied successfully', 'info');
}

function clearAllFilters() {
    state.filters = {
        search: '',
        category: 'All',
        body_type: 'All Cars',
        brand: '',
        location: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        fuel_type: '',
        transmission: '',
        sort: 'Newest First'
    };

    document.getElementById('searchInput').value = '';
    document.getElementById('filterLocationLabel').textContent = 'Location';
    document.getElementById('filterBrandLabel').textContent = 'Brand';
    document.getElementById('filterPriceLabel').textContent = 'Price';
    document.getElementById('filterYearLabel').textContent = 'Year';
    document.getElementById('filterFuelLabel').textContent = 'Fuel Type';
    document.getElementById('filterTransmissionLabel').textContent = 'Transmission';
    document.getElementById('currentLocationText').textContent = 'All India';
    document.getElementById('sortSelect').value = 'Newest First';

    document.querySelectorAll('.nav-link').forEach((l, idx) => {
        l.classList.toggle('active', idx === 0);
    });

    document.querySelectorAll('.vehicle-type').forEach((t, idx) => {
        t.classList.toggle('selected', idx === 0);
    });

    fetchVehicles();
    showToast('All filters cleared', 'info');
}

function handleSortChange(sortValue) {
    state.filters.sort = sortValue;
    fetchVehicles();
}

function setViewMode(mode) {
    state.viewMode = mode;
    const container = document.getElementById('carsContainer');
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');

    if (mode === 'list') {
        container.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    } else {
        container.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    }
}


// ================= WISHLIST FUNCTIONALITY =================
async function syncWishlistIds() {
    try {
        const query = state.currentUser ? `user_id=${state.currentUser.id}` : `guest_token=${state.guestToken}`;
        const response = await fetch(`${API_BASE}/wishlist/ids?${query}`);
        if (response.ok) {
            const data = await response.json();
            state.wishlistIds = new Set(data.ids || []);
            updateWishlistBadge();
        }
    } catch (e) {
        console.error('Failed to sync wishlist IDs:', e);
    }
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistCount');
    badge.textContent = state.wishlistIds.size;
}

async function toggleWishlist(vehicleId, button) {
    try {
        const payload = {
            vehicle_id: vehicleId,
            guest_token: state.guestToken,
            user_id: state.currentUser ? state.currentUser.id : null
        };

        const response = await fetch(`${API_BASE}/wishlist/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
            if (data.isWishlisted) {
                state.wishlistIds.add(vehicleId);
                if (button) {
                    button.classList.add('active');
                    button.innerHTML = '♥';
                }
                showToast('Vehicle added to wishlist!', 'success');
            } else {
                state.wishlistIds.delete(vehicleId);
                if (button) {
                    button.classList.remove('active');
                    button.innerHTML = '♡';
                }
                showToast('Vehicle removed from wishlist', 'info');
            }
            updateWishlistBadge();
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        showToast('Could not update wishlist', 'error');
    }
}

async function openWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    const container = document.getElementById('wishlistItemsContainer');

    modal.classList.add('active');
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading your saved vehicles...</p>
        </div>
    `;

    try {
        const query = state.currentUser ? `user_id=${state.currentUser.id}` : `guest_token=${state.guestToken}`;
        const response = await fetch(`${API_BASE}/wishlist?${query}`);
        const result = await response.json();
        const items = result.data || [];

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">♡</div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Browse cars and click the heart icon to save vehicles you love!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(v => `
            <div class="wishlist-item" id="wishlist-item-${v.id}">
                <img src="${escapeHtml(v.image_url)}" class="wishlist-thumb" alt="${escapeHtml(v.title)}">
                <div class="wishlist-details">
                    <h4>${escapeHtml(v.title)}</h4>
                    <p>${formatINR(v.price)}</p>
                    <small style="color: #6b7280;">${v.year} • ${escapeHtml(v.fuel_type)} • ${escapeHtml(v.location)}</small>
                </div>
                <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="closeModal('wishlistModal'); openVehicleDetails(${v.id})">
                    View
                </button>
                <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px; color: #ef4444;" onclick="removeWishlistItem(${v.id})">
                    ✕
                </button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = `<p style="color: #ef4444;">Failed to load wishlist items.</p>`;
    }
}

async function removeWishlistItem(vehicleId) {
    await toggleWishlist(vehicleId);
    const itemEl = document.getElementById(`wishlist-item-${vehicleId}`);
    if (itemEl) itemEl.remove();

    // Re-render feed heart button if visible
    const feedBtn = document.querySelector(`#car-card-${vehicleId} .heart-btn`);
    if (feedBtn) {
        feedBtn.classList.remove('active');
        feedBtn.innerHTML = '♡';
    }

    if (state.wishlistIds.size === 0) {
        document.getElementById('wishlistItemsContainer').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♡</div>
                <h3>Your Wishlist is Empty</h3>
                <p>Browse cars and click the heart icon to save vehicles you love!</p>
            </div>
        `;
    }
}


// ================= VEHICLE DETAILS MODAL =================
async function openVehicleDetails(vehicleId) {
    const modal = document.getElementById('vehicleDetailsModal');
    const body = document.getElementById('vehicleDetailsBody');

    modal.classList.add('active');
    body.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading vehicle details & seller information...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}/vehicles/${vehicleId}`);
        const result = await response.json();
        const v = result.data;

        const isWishlisted = state.wishlistIds.has(v.id);
        const formattedPrice = formatINR(v.price);
        const formattedKm = Number(v.km_driven).toLocaleString('en-IN') + ' km';

        const featuresHtml = Array.isArray(v.features) && v.features.length > 0
            ? v.features.map(f => `<span class="feature-tag">✓ ${escapeHtml(f)}</span>`).join('')
            : '<span class="feature-tag">✓ Full Inspection Certified</span><span class="feature-tag">✓ Non-Accidental</span>';

        body.innerHTML = `
            <div class="details-modal-grid">
                <div>
                    <div class="details-gallery">
                        <img src="${escapeHtml(v.image_url)}" alt="${escapeHtml(v.title)}" onerror="this.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85'">
                    </div>

                    <div style="margin-top: 18px;">
                        <h2 style="font-size: 24px; font-weight: 800;">${escapeHtml(v.title)}</h2>
                        <div class="details-price-badge">${formattedPrice}</div>
                        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-top: 8px;">
                            ${escapeHtml(v.description || 'No description provided by seller.')}
                        </p>
                    </div>

                    <h4 style="margin-top: 20px; font-size: 14px; font-weight: 700;">Key Features & Equipment</h4>
                    <div class="features-list">
                        ${featuresHtml}
                    </div>
                </div>

                <div>
                    <div class="specs-grid">
                        <div class="spec-chip">
                            <small>Year</small>
                            <strong>${v.year}</strong>
                        </div>
                        <div class="spec-chip">
                            <small>KM Driven</small>
                            <strong>${formattedKm}</strong>
                        </div>
                        <div class="spec-chip">
                            <small>Fuel</small>
                            <strong>${escapeHtml(v.fuel_type)}</strong>
                        </div>
                        <div class="spec-chip">
                            <small>Transmission</small>
                            <strong>${escapeHtml(v.transmission)}</strong>
                        </div>
                        <div class="spec-chip">
                            <small>Body Type</small>
                            <strong>${escapeHtml(v.body_type)}</strong>
                        </div>
                        <div class="spec-chip">
                            <small>Location</small>
                            <strong>${escapeHtml(v.location)}</strong>
                        </div>
                    </div>

                    <div class="seller-box">
                        <div class="seller-avatar">🏢</div>
                        <div>
                            <strong style="font-size: 14px; display: block;">${escapeHtml(v.seller_name || 'Verified Seller')}</strong>
                            <small style="color: #6b7280;">📞 ${escapeHtml(v.seller_phone || '+91 98765 43210')}</small>
                            <small style="color: #6b7280; display: block;">✉️ ${escapeHtml(v.seller_email || 'contact@gearflip.com')}</small>
                        </div>
                    </div>

                    <div class="inquiry-form-card">
                        <h4>Book a Test Drive / Contact Seller</h4>
                        <form onsubmit="handleInquirySubmit(event, ${v.id})">
                            <div class="form-group" style="margin-bottom: 10px;">
                                <label>Your Full Name *</label>
                                <input type="text" id="inqName" value="${state.currentUser ? escapeHtml(state.currentUser.name) : ''}" placeholder="Rahul Sharma" required>
                            </div>
                            <div class="form-group" style="margin-bottom: 10px;">
                                <label>Mobile Number *</label>
                                <input type="tel" id="inqPhone" value="${state.currentUser ? escapeHtml(state.currentUser.phone || '') : ''}" placeholder="+91 98765 43210" required>
                            </div>
                            <div class="form-group" style="margin-bottom: 10px;">
                                <label>Email Address *</label>
                                <input type="email" id="inqEmail" value="${state.currentUser ? escapeHtml(state.currentUser.email) : ''}" placeholder="rahul@example.com" required>
                            </div>
                            <div class="form-group" style="margin-bottom: 14px;">
                                <label>Preferred Test Drive Date</label>
                                <input type="date" id="inqDate">
                            </div>
                            <button type="submit" class="btn-primary full-width">
                                Submit Test Drive Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Error fetching vehicle detail:', e);
        body.innerHTML = `<p style="color: #ef4444;">Failed to load vehicle details.</p>`;
    }
}

async function handleInquirySubmit(event, vehicleId) {
    event.preventDefault();
    const name = document.getElementById('inqName').value.trim();
    const phone = document.getElementById('inqPhone').value.trim();
    const email = document.getElementById('inqEmail').value.trim();
    const date = document.getElementById('inqDate').value;

    try {
        const response = await fetch(`${API_BASE}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vehicle_id: vehicleId,
                user_name: name,
                user_phone: phone,
                user_email: email,
                preferred_date: date,
                type: 'test_drive'
            })
        });

        const result = await response.json();
        if (result.success) {
            showToast('Test drive booked! The seller has been notified.', 'success');
            closeModal('vehicleDetailsModal');
        } else {
            showToast(result.message || 'Could not submit inquiry', 'error');
        }
    } catch (e) {
        showToast('Error submitting request to backend', 'error');
    }
}


// ================= SELL VEHICLE FUNCTIONALITY =================
function openSellModal() {
    const modal = document.getElementById('sellVehicleModal');
    modal.classList.add('active');

    // Pre-fill seller name & phone if logged in
    if (state.currentUser) {
        document.getElementById('sellSellerName').value = state.currentUser.name;
        document.getElementById('sellSellerPhone').value = state.currentUser.phone || '';
    }
}

async function handleSellVehicleSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('sellSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing Listing...';

    const payload = {
        title: document.getElementById('sellTitle').value.trim(),
        brand: document.getElementById('sellBrand').value.trim(),
        model: document.getElementById('sellModel').value.trim(),
        year: Number(document.getElementById('sellYear').value),
        price: Number(document.getElementById('sellPrice').value),
        km_driven: Number(document.getElementById('sellKm').value),
        fuel_type: document.getElementById('sellFuel').value,
        transmission: document.getElementById('sellTransmission').value,
        body_type: document.getElementById('sellBodyType').value,
        category: document.getElementById('sellCategory').value,
        location: document.getElementById('sellLocation').value.trim(),
        image_url: document.getElementById('sellImageUrl').value.trim() || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85',
        description: document.getElementById('sellDescription').value.trim(),
        seller_name: document.getElementById('sellSellerName').value.trim(),
        seller_phone: document.getElementById('sellSellerPhone').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            showToast('🎉 Vehicle listed successfully on GearFlip!', 'success');
            document.getElementById('sellVehicleForm').reset();
            closeModal('sellVehicleModal');
            // Refresh inventory feed
            fetchVehicles();
        } else {
            showToast(result.message || 'Error listing vehicle', 'error');
        }
    } catch (e) {
        console.error('Error posting vehicle:', e);
        showToast('Failed to connect to server', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Vehicle Listing';
    }
}


// ================= AUTH MODAL (Login / Register / Profile) =================
function openAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');

    if (state.currentUser) {
        // Show Profile View
        document.querySelector('.auth-tabs').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('userProfileView').style.display = 'block';

        document.getElementById('profileName').textContent = state.currentUser.name;
        document.getElementById('profileEmail').textContent = state.currentUser.email;
        document.getElementById('profilePhone').textContent = state.currentUser.phone || 'Phone not set';
        document.getElementById('profileWishlistCount').textContent = state.wishlistIds.size;
    } else {
        // Show Login View
        document.querySelector('.auth-tabs').style.display = 'flex';
        document.getElementById('userProfileView').style.display = 'none';
        switchAuthTab('login');
    }
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById('tabLogin');
    const regTab = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');

    if (tab === 'login') {
        loginTab.classList.add('active');
        regTab.classList.remove('active');
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
    } else {
        regTab.classList.add('active');
        loginTab.classList.remove('active');
        regForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
}

function fillDemoLogin() {
    document.getElementById('loginEmail').value = 'demo@gearflip.com';
    document.getElementById('loginPassword').value = 'demo1234';
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (result.success) {
            state.currentUser = result.user;
            localStorage.setItem('gearflip_user', JSON.stringify(result.user));
            localStorage.setItem('gearflip_token', result.token);
            updateUserHeaderUI();
            closeModal('authModal');
            syncWishlistIds();
            showToast(result.message || 'Logged in successfully!', 'success');
        } else {
            showToast(result.message || 'Invalid credentials', 'error');
        }
    } catch (e) {
        showToast('Server error during login', 'error');
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        const result = await response.json();
        if (result.success) {
            state.currentUser = result.user;
            localStorage.setItem('gearflip_user', JSON.stringify(result.user));
            localStorage.setItem('gearflip_token', result.token);
            updateUserHeaderUI();
            closeModal('authModal');
            syncWishlistIds();
            showToast('Account created successfully!', 'success');
        } else {
            showToast(result.message || 'Registration failed', 'error');
        }
    } catch (e) {
        showToast('Server error during registration', 'error');
    }
}

function handleLogout() {
    state.currentUser = null;
    localStorage.removeItem('gearflip_user');
    localStorage.removeItem('gearflip_token');
    updateUserHeaderUI();
    closeModal('authModal');
    syncWishlistIds();
    showToast('Signed out successfully', 'info');
}


// ================= LOCATION PICKER =================
function openLocationModal() {
    document.getElementById('locationModal').classList.add('active');
}

function selectLocation(city) {
    state.filters.location = city === 'All India' ? '' : city;
    document.getElementById('currentLocationText').textContent = city;
    document.getElementById('filterLocationLabel').textContent = city === 'All India' ? 'Location' : city;
    closeModal('locationModal');
    fetchVehicles();
    showToast(`Location set to ${city}`, 'info');
}


// ================= MODAL UTILITIES =================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleBackdropClick(event, modalId) {
    if (event.target.id === modalId) {
        closeModal(modalId);
    }
}

function resetAllAndHome() {
    clearAllFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ================= TOAST NOTIFICATION SYSTEM =================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}


// ================= HELPER UTILITIES =================
function formatINR(number) {
    if (!number) return '₹ 0';
    return '₹ ' + Number(number).toLocaleString('en-IN');
}

function getTagClass(tag) {
    if (!tag) return 'tag-good-price';
    const clean = tag.toLowerCase();
    if (clean.includes('best')) return 'tag-best-price';
    if (clean.includes('feature')) return 'tag-featured';
    if (clean.includes('verify')) return 'tag-verified';
    if (clean.includes('premium')) return 'tag-premium';
    return 'tag-good-price';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}