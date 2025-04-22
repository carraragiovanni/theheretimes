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
async function initMap() {
    // Default center (US)
    let center = { lat: 39.8283, lng: -98.5795 };
    
    // Try to get user's location
    try {
        const position = await new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error('Geolocation is not supported by this browser.'));
            }
        });
        
        center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    } catch (error) {
        console.log('Using default center:', error.message);
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    // Add idle event listener to update cities when map stops moving
    map.addListener('idle', () => {
        const bounds = map.getBounds();
        if (bounds) {
            updateCitiesInViewport(bounds);
        }
    });

    // Function to update cities based on current viewport
    async function updateCitiesInViewport(bounds) {
        if (!bounds) {
            console.log('Map bounds not available yet');
            return;
        }

        try {
            const response = await fetch('/api/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bounds: {
                        north: bounds.getNorthEast().lat(),
                        south: bounds.getSouthWest().lat(),
                        east: bounds.getNorthEast().lng(),
                        west: bounds.getSouthWest().lng()
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const newCities = await response.json();
            
            // Clear existing markers
            markers.forEach(marker => marker.setMap(null));
            markers = [];
            
            // Add new markers
            newCities.forEach(city => {
                const marker = new google.maps.Marker({
                    position: { lat: city.lat, lng: city.lng },
                    map: map,
                    title: city.name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#EA4335',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF'
                    }
                });

                marker.addListener('click', () => {
                    // Reset all markers to red
                    markers.forEach(m => {
                        m.setIcon({
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#EA4335',
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: '#FFFFFF'
                        });
                    });
                    // Set clicked marker to blue
                    marker.setIcon({
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF'
                    });
                    showCityNews(city.name);
                });

                markers.push(marker);
            });
        } catch (error) {
            console.error('Error updating cities:', error);
        }
    }

    // Wait for the map to be ready before updating cities
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) {
            updateCitiesInViewport(bounds);
        }
    });
}

// Fetch news for a city
async function fetchNews(city) {
    try {
        const response = await fetch(`/api/news/${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// Get favicon URL from article URL
function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch (error) {
        return '';
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
            <div class="article-header">
                <img src="${getFaviconUrl(article.url)}" alt="Source favicon" class="favicon" onerror="this.style.display='none'">
                <a href="${article.url}" target="_blank" class="article-title">${article.title}</a>
            </div>
            <p>${article.description || ''}</p>
        </div>
    `).join('');
}

// Close sidebar
closeSidebarButton.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Initialize the application
document.addEventListener('DOMContentLoaded', initMap); 