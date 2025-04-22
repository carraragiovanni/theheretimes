import { useState, useEffect } from 'react';
const API_KEY = "22f8d579867948f991198b333b9a967d";
const API_BASE_URL = "https://newsapi.org/v2/everything";
export function useNews(city: string | null, filters: any, bounds?: any) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!city && !bounds) {
      setNews([]);
      return;
    }
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!isLocalhost) {
          throw new Error("Not running on localhost");
        }
        let locationQuery = '';
        if (bounds) {
          const centerLat = (bounds.ne.lat + bounds.sw.lat) / 2;
          const centerLng = (bounds.ne.lng + bounds.sw.lng) / 2;
          locationQuery = `local news ${centerLat.toFixed(2)} ${centerLng.toFixed(2)}`;
        } else if (city) {
          locationQuery = `"${city}" local news OR regional OR community`;
        }
        const params = new URLSearchParams({
          apiKey: API_KEY,
          q: locationQuery,
          pageSize: "8",
          language: filters.language === 'all' ? 'en' : filters.language,
          sortBy: filters.sortBy === 'relevance' ? 'relevancy' : 'publishedAt'
        });
        if (filters.date !== 'all') {
          const date = new Date();
          if (filters.date === 'today') {
            date.setDate(date.getDate() - 1);
          } else if (filters.date === 'week') {
            date.setDate(date.getDate() - 7);
          } else if (filters.date === 'month') {
            date.setMonth(date.getMonth() - 1);
          }
          params.append('from', date.toISOString());
        }
        const response = await fetch(`${API_BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'error') {
          throw new Error(data.message);
        }
        const validArticles = data.articles.filter(article => article.title && article.description && !article.title.includes('[Removed]'));
        setNews(validArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [city, filters, bounds]);
  return {
    news,
    loading,
    error
  };
}