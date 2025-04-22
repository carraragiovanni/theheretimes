import React, { useState } from 'react';
import { Map } from './components/Map';
import { NewsList } from './components/NewsList';
import { Filters } from './components/Filters';
import { mockCities, mockNews } from './utils/data';
import { useNews } from './hooks/useNews';
import { XIcon } from 'lucide-react';
export function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [filters, setFilters] = useState({
    date: 'all',
    language: 'all',
    sortBy: 'relevance'
  });
  const {
    news,
    loading,
    error
  } = useNews(selectedCity ? selectedCity.name : null, filters, mapBounds);
  const handleCityClick = city => {
    setSelectedCity(city);
  };
  const handleFilterChange = newFilters => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  const handleBoundsChange = bounds => {
    setMapBounds(bounds);
  };
  return <main className="flex flex-col h-screen w-full">
      <header className="p-4 z-10 flex justify-center items-center">
        <img src="/the_Here_Times.svg" alt="The Here Times" className="h-8" />
      </header>
      <div className="flex flex-col md:flex-row flex-1 relative">
        <div className={`h-[50vh] md:h-full ${selectedCity ? 'w-full md:w-2/3' : 'w-full'} relative transition-all duration-300`}>
          <Map cities={mockCities} onCityClick={handleCityClick} selectedCity={selectedCity} onFilterChange={handleFilterChange} onBoundsChange={handleBoundsChange} />
        </div>
        {selectedCity && <div className="w-full md:w-1/3 overflow-y-auto bg-white shadow-lg relative">
            <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">
                News from {selectedCity.name}
              </h2>
              <button onClick={() => setSelectedCity(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close news panel">
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <NewsList news={error ? mockNews.filter(n => n.cityId === selectedCity.id) : news} loading={loading} error={null} />
            </div>
          </div>}
      </div>
    </main>;
}