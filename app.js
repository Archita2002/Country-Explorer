const countryList = document.getElementById('country-list');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const searchSuggestions = document.getElementById('search-suggestions');
const showMoreBtn = document.getElementById('show-more');
let currentPage = 1;
const pageSize = 10;
let countriesData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch countries from API and initialize list
async function fetchCountries() {
    const response = await fetch(`https://restcountries.com/v3.1/all`);
    const data = await response.json();
    countriesData = data;
    displayCountries(data.slice(0, pageSize));
}

// Display countries in grid format with favorite button and details section
function displayCountries(countries) {
    countryList.innerHTML = ''; // Clear previous country cards
    countries.forEach(country => {
        const isFavorited = favorites.includes(country.name.common);
        const card = document.createElement('div');
        card.className = 'country-card';
        
        card.innerHTML = `
            <h3>${country.name.common}</h3>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                    onclick="toggleFavorite('${country.name.common}', this)">
                ${isFavorited ? '⭐' : '☆'}
            </button>
            <button class="details-btn" onclick="toggleDetails(this)">Show Details</button>
            <div class="country-details" style="display: none;">
                <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Area:</strong> ${country.area} km²</p>
                <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
            </div>
        `;
        
        countryList.appendChild(card);
    });
}

// Toggle visibility of the country details section
function toggleDetails(button) {
    const details = button.nextElementSibling;
    if (details.style.display === 'none') {
        details.style.display = 'block';
        button.textContent = 'Hide Details';
    } else {
        details.style.display = 'none';
        button.textContent = 'Show Details';
    }
}

// Show more countries on button click
showMoreBtn.addEventListener('click', () => {
    currentPage++;
    const start = currentPage * pageSize;
    const end = start + pageSize;
    displayCountries(countriesData.slice(start, end));
});

// Handle search button click
searchButton.addEventListener('click', searchCountries);

// Search for countries on button click
function searchCountries() {
    const query = searchInput.value.toLowerCase();
    const filtered = countriesData.filter(country =>
        country.name.common.toLowerCase().includes(query)
    );
    displayCountries(filtered); // Display the filtered results
}

// Show search suggestions while typing
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = countriesData.filter(country =>
        country.name.common.toLowerCase().includes(query)
    );
    showSuggestions(filtered.slice(0, 5));
});

// Show search suggestions
function showSuggestions(countries) {
    searchSuggestions.innerHTML = '';
    countries.forEach(country => {
        const suggestion = document.createElement('div');
        suggestion.textContent = country.name.common;
        suggestion.addEventListener('click', () => {
            searchInput.value = country.name.common;
            searchSuggestions.innerHTML = '';
            displayCountries([country]);
        });
        searchSuggestions.appendChild(suggestion);
    });
}

// Toggle favorite status and update UI
function toggleFavorite(countryName, btn) {
    if (favorites.includes(countryName)) {
        favorites = favorites.filter(fav => fav !== countryName);
        btn.classList.remove('favorited');
        btn.textContent = '☆'; // Empty star for non-favorited
    } else if (favorites.length < 5) {
        favorites.push(countryName);
        btn.classList.add('favorited');
        btn.textContent = '⭐'; // Filled star for favorited
    } else {
        alert("You can only have 5 favorites.");
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Initial function calls
fetchCountries();
