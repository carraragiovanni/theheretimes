// Settings functionality
const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');
const dateRangeSelect = document.getElementById('date-range');
const sortOrderSelect = document.getElementById('sort-order');
const languageSelect = document.getElementById('language');

// Toggle settings panel
settingsButton.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
});

closeSettings.addEventListener('click', () => {
    settingsPanel.classList.remove('open');
});

// Save settings to localStorage
function saveSettings() {
    const settings = {
        dateRange: dateRangeSelect.value,
        sortOrder: sortOrderSelect.value,
        language: languageSelect.value
    };
    localStorage.setItem('newsSettings', JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('newsSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dateRangeSelect.value = settings.dateRange;
        sortOrderSelect.value = settings.sortOrder;
        languageSelect.value = settings.language;
    }
}

// Add event listeners to settings selects
[dateRangeSelect, sortOrderSelect, languageSelect].forEach(select => {
    select.addEventListener('change', () => {
        saveSettings();
        fetchNews(); // Refresh news with new settings
    });
});

// Modify fetchNews function to use settings
async function fetchNews() {
    const settings = {
        dateRange: dateRangeSelect.value,
        sortOrder: sortOrderSelect.value,
        language: languageSelect.value
    };

    // Calculate from date based on dateRange
    let fromDate = new Date();
    switch(settings.dateRange) {
        case 'week':
            fromDate.setDate(fromDate.getDate() - 7);
            break;
        case 'month':
            fromDate.setMonth(fromDate.getMonth() - 1);
            break;
        default: // today
            fromDate.setHours(0, 0, 0, 0);
    }

    const fromDateStr = fromDate.toISOString().split('T')[0];
    
    // Add language parameter if not 'all'
    const languageParam = settings.language !== 'all' ? `&language=${settings.language}` : '';
    
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=*&from=${fromDateStr}&sortBy=${settings.sortOrder}${languageParam}&apiKey=YOUR_API_KEY`);
        const data = await response.json();
        
        // Update news display with new data
        updateNewsDisplay(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Initialize settings when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
}); 