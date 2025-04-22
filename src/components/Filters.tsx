import React from 'react';
export function Filters({
  onFilterChange
}) {
  const handleDateChange = e => {
    onFilterChange({
      date: e.target.value
    });
  };
  const handleLanguageChange = e => {
    onFilterChange({
      language: e.target.value
    });
  };
  const handleSortChange = e => {
    onFilterChange({
      sortBy: e.target.value
    });
  };
  return <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg space-y-3 w-64">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Date</label>
        <select className="w-full p-2 border rounded bg-white shadow-sm" onChange={handleDateChange} defaultValue="all">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Language</label>
        <select className="w-full p-2 border rounded bg-white shadow-sm" onChange={handleLanguageChange} defaultValue="all">
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Sort By</label>
        <select className="w-full p-2 border rounded bg-white shadow-sm" onChange={handleSortChange} defaultValue="relevance">
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>;
}