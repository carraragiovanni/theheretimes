# US Cities News Map

A simple web application that displays a map of the US with markers for the top 5 most populous cities. Clicking on a city marker opens a sidebar with recent news articles for that city.

## Features

- Interactive Google Map centered on the US
- Markers for the top 5 most populous US cities
- News articles displayed in a responsive sidebar
- Clean, modern UI with smooth animations

## Setup

1. Clone this repository
2. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
3. Get a News API key from [NewsAPI.org](https://newsapi.org/)
4. Create a `.env` file in the root directory and add your API keys:
   ```
   NEWS_API_KEY=your_news_api_key_here
   ```
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` with your actual Google Maps API key
6. Open `index.html` in a web browser

## Usage

- Click on any city marker to view news articles for that city
- The sidebar will slide in from the right showing 8 recent news articles
- Click the × button to close the sidebar
- Click on "Read more" to open the full article in a new tab

## Technologies Used

- Vanilla JavaScript
- Google Maps JavaScript API
- NewsAPI
- CSS3 for styling
- HTML5 for structure

## Browser Support

The application works best in modern browsers that support ES6+ features and CSS3. 