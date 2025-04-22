// Top 5 most populous US cities with their coordinates
const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, population: 8336817 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3979576 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298, population: 2693976 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698, population: 2320268 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740, population: 1680992 }
];

let map;
let markers = [];
let sidebar = document.getElementById('sidebar');
let newsContainer = document.getElementById('news-container');
let cityNameElement = document.getElementById('city-name');
let closeSidebarButton = document.getElementById('close-sidebar');

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of US
        zoom: 4
    });

    // Add markers for each city
    cities.forEach(city => {
        const marker = new google.maps.Marker({
            position: { lat: city.lat, lng: city.lng },
            map: map,
            title: city.name
        });

        marker.addListener('click', () => {
            showCityNews(city.name);
        });

        markers.push(marker);
    });
}

// Fetch news for a city
async function fetchNews(city) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${city}&apiKey=${process.env.NEWS_API_KEY}&pageSize=8`);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// Display news in the sidebar
async function showCityNews(city) {
    cityNameElement.textContent = city;
    newsContainer.innerHTML = '<p>Loading news...</p>';
    sidebar.classList.add('open');

    const articles = await fetchNews(city);
    
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news articles found for this city.</p>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <div class="news-article">
            <h3>${article.title}</h3>
            <p>${article.description || ''}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        </div>
    `).join('');
}

// Close sidebar
closeSidebarButton.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Initialize the application
document.addEventListener('DOMContentLoaded', initMap); 