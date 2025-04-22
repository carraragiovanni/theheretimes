import React from 'react';
export function NewsList({
  news,
  loading,
  error
}) {
  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading news...</div>;
  }
  if (error) {
    return <div className="p-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">
            Unable to Load News
          </h3>
          <p className="text-yellow-700 text-sm">
            {error.includes('localhost') ? <>
                This application needs to run on localhost due to NewsAPI
                restrictions.
                <br />
                <br />
                Please run this application locally using:
                <pre className="bg-yellow-100 p-2 rounded mt-2 text-left">
                  npm start
                </pre>
                or
                <pre className="bg-yellow-100 p-2 rounded mt-2 text-left">
                  yarn start
                </pre>
              </> : <div className="space-y-2">
                <p>{error}</p>
                {error.includes('Secure connection failed') && <p className="text-sm text-yellow-600">
                    This might be due to network security settings or a proxy.
                    Try accessing the site directly or check your network
                    settings.
                  </p>}
                {error.includes('Network error') && <p className="text-sm text-yellow-600">
                    Please check your internet connection and try again.
                  </p>}
              </div>}
          </p>
        </div>
      </div>;
  }
  if (!news || news.length === 0) {
    return <div className="py-8 text-center text-gray-500">
        No news articles available for this location.
      </div>;
  }
  return <div className="space-y-4 mt-4">
      {news.map((article, index) => <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
            {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-lg mb-3" onError={e => e.target.style.display = 'none'} />}
            <h3 className="font-medium text-lg text-blue-700 hover:underline">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {new Date(article.publishedAt).toLocaleDateString()} •{' '}
              {article.source.name}
            </p>
            <p className="mt-2 text-gray-700">{article.description}</p>
          </a>
        </div>)}
    </div>;
}