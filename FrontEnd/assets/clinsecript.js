// Constants
const API_BASE_URL = 'http://localhost:5678/api';
const DEFAULT_CATEGORY = 'Tous';

// Elements
const filtersContainer = document.getElementById('filters');
const gallery = document.querySelector('.gallery');
const logoutButton = document.querySelector('#logout');

// Authentication
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    location.href = 'login.html';
}

// Initialize App
(async function initialize() {
    try {
        await loadCategories();
        await loadWorks();
        setupLogoutButton();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
})();

// Fetch Data Function
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
}

// Load Categories and Setup Filters
async function loadCategories() {
    const url = `${API_BASE_URL}/categories`;
    const categories = await fetchData(url);

    // Clear and add default category button
    filtersContainer.innerHTML = '';
    filtersContainer.appendChild(createCategoryButton(DEFAULT_CATEGORY));

    // Add buttons for each category
    categories.forEach(category => {
        filtersContainer.appendChild(createCategoryButton(category.name, category.id));
    });
}

function createCategoryButton(name, categoryId = null) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.classList.add('filter-button');

    button.addEventListener('click', () => {
        filterWorks(categoryId);
    });

    return button;
}

// Load Works
async function loadWorks() {
    const url = `${API_BASE_URL}/works`;
    const works = await fetchData(url);
    displayWorks(works);
}

function displayWorks(works) {
    gallery.innerHTML = '';
    works.forEach(work => {
        gallery.appendChild(createWorkCard(work));
    });
}

function createWorkCard(work) {
    const card = document.createElement('figure');
    card.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
    `;
    return card;
}

// Filter Works
async function filterWorks(categoryId) {
    const url = `${API_BASE_URL}/works`;
    const works = await fetchData(url);

    const filteredWorks = categoryId
        ? works.filter(work => work.categoryId === categoryId)
        : works;

    displayWorks(filteredWorks);
}

// Logout Functionality
function setupLogoutButton() {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        location.href = 'login.html';
    });
}