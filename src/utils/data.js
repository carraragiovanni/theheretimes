// Mock data for the 5 most populous cities in the US
export const mockCities = [{
  id: 1,
  name: "New York City",
  lat: 40.7128,
  lng: -74.0060,
  population: 8804190
}, {
  id: 2,
  name: "Los Angeles",
  lat: 34.0522,
  lng: -118.2437,
  population: 3898747
}, {
  id: 3,
  name: "Chicago",
  lat: 41.8781,
  lng: -87.6298,
  population: 2746388
}, {
  id: 4,
  name: "Houston",
  lat: 29.7604,
  lng: -95.3698,
  population: 2304580
}, {
  id: 5,
  name: "Phoenix",
  lat: 33.4484,
  lng: -112.0740,
  population: 1608139
}];
// Mock news data
export const mockNews = [
// New York news
{
  id: 101,
  cityId: 1,
  title: "New York City Announces Major Infrastructure Project",
  summary: "The city plans to invest $2 billion in upgrading subway lines across all five boroughs.",
  date: "2023-07-15",
  source: "NYC Times",
  language: "en",
  relevance: 9.5,
  url: "https://example.com/news/101"
}, {
  id: 102,
  cityId: 1,
  title: "Central Park Summer Festival Dates Announced",
  summary: "Annual summer festival will feature over 50 performers across three weekends in August.",
  date: "2023-07-10",
  source: "Manhattan Daily",
  language: "en",
  relevance: 8.7,
  url: "https://example.com/news/102"
}, {
  id: 103,
  cityId: 1,
  title: "New Restaurant Row Opens in Brooklyn",
  summary: "Ten new restaurants featuring diverse cuisines have opened on renovated waterfront property.",
  date: "2023-07-05",
  source: "Brooklyn Eats",
  language: "en",
  relevance: 7.9,
  url: "https://example.com/news/103"
}, {
  id: 104,
  cityId: 1,
  title: "Nuevo programa de arte comunitario en el Bronx",
  summary: "Un programa de $5 millones llevará arte y cultura a vecindarios desatendidos.",
  date: "2023-07-02",
  source: "El Diario NY",
  language: "es",
  relevance: 7.2,
  url: "https://example.com/news/104"
}, {
  id: 105,
  cityId: 1,
  title: "City Council Debates New Housing Legislation",
  summary: "Controversial bill aims to increase affordable housing requirements for new developments.",
  date: "2023-06-28",
  source: "NYC Politics",
  language: "en",
  relevance: 9.1,
  url: "https://example.com/news/105"
}, {
  id: 106,
  cityId: 1,
  title: "Staten Island Ferry Schedule Changes",
  summary: "New summer schedule adds late night service on weekends through September.",
  date: "2023-06-25",
  source: "SI Advance",
  language: "en",
  relevance: 6.8,
  url: "https://example.com/news/106"
}, {
  id: 107,
  cityId: 1,
  title: "Queens Night Market Returns with 100+ Vendors",
  summary: "Popular food and crafts market opens for the season with expanded offerings.",
  date: "2023-06-20",
  source: "Queens Chronicle",
  language: "en",
  relevance: 7.5,
  url: "https://example.com/news/107"
}, {
  id: 108,
  cityId: 1,
  title: "Local Tech Startup Raises $50M in Funding",
  summary: "Manhattan-based AI company becomes city's newest unicorn after latest investment round.",
  date: "2023-06-15",
  source: "NY Business Journal",
  language: "en",
  relevance: 8.3,
  url: "https://example.com/news/108"
},
// Los Angeles news
{
  id: 201,
  cityId: 2,
  title: "LA Metro Expands Rail Service to Airport",
  summary: "New line connecting downtown to LAX will begin service next month after years of construction.",
  date: "2023-07-14",
  source: "LA Times",
  language: "en",
  relevance: 9.7,
  url: "https://example.com/news/201"
}, {
  id: 202,
  cityId: 2,
  title: "Hollywood Film Production Reaches Record High",
  summary: "Local film industry sees 25% increase in productions following new tax incentives.",
  date: "2023-07-12",
  source: "Hollywood Reporter",
  language: "en",
  relevance: 8.9,
  url: "https://example.com/news/202"
}, {
  id: 203,
  cityId: 2,
  title: "Drought Measures Implemented Across County",
  summary: "Water restrictions go into effect as reservoir levels reach historic lows.",
  date: "2023-07-08",
  source: "SoCal News",
  language: "en",
  relevance: 9.2,
  url: "https://example.com/news/203"
}, {
  id: 204,
  cityId: 2,
  title: "Festival de Música Latina Anuncia Programación",
  summary: "El evento anual contará con artistas internacionales y locales durante tres días.",
  date: "2023-07-03",
  source: "LA Opinión",
  language: "es",
  relevance: 7.6,
  url: "https://example.com/news/204"
}, {
  id: 205,
  cityId: 2,
  title: "Venice Beach Cleanup Initiative Launches",
  summary: "Community volunteers remove over two tons of trash in weekend environmental effort.",
  date: "2023-06-30",
  source: "Beach Cities News",
  language: "en",
  relevance: 6.5,
  url: "https://example.com/news/205"
}, {
  id: 206,
  cityId: 2,
  title: "New Restaurant Week Features 200+ Venues",
  summary: "Annual culinary event expands with special menus at restaurants across the city.",
  date: "2023-06-25",
  source: "LA Eater",
  language: "en",
  relevance: 7.8,
  url: "https://example.com/news/206"
}, {
  id: 207,
  cityId: 2,
  title: "Tech Company Relocates Headquarters to Silicon Beach",
  summary: "Major employer brings 500 jobs to westside tech corridor with new campus.",
  date: "2023-06-20",
  source: "LA Business",
  language: "en",
  relevance: 8.1,
  url: "https://example.com/news/207"
}, {
  id: 208,
  cityId: 2,
  title: "City Council Approves New Housing Development",
  summary: "Controversial project will add 3,000 units, with 25% designated as affordable housing.",
  date: "2023-06-15",
  source: "LA City News",
  language: "en",
  relevance: 8.5,
  url: "https://example.com/news/208"
},
// Add similar mock data for the other cities (Chicago, Houston, Phoenix)
// Chicago news
{
  id: 301,
  cityId: 3,
  title: "Lakefront Trail Extension Opens to Public",
  summary: "The 2-mile extension connects the south side to the museum campus with protected bike lanes.",
  date: "2023-07-13",
  source: "Chicago Tribune",
  language: "en",
  relevance: 8.8,
  url: "https://example.com/news/301"
}, {
  id: 302,
  cityId: 3,
  title: "Chicago Public Schools Announce New Curriculum",
  summary: "District-wide changes focus on STEM education and practical skills development.",
  date: "2023-07-09",
  source: "Chicago Education News",
  language: "en",
  relevance: 9.0,
  url: "https://example.com/news/302"
},
// Houston news
{
  id: 401,
  cityId: 4,
  title: "Houston Expands Green Space Initiative",
  summary: "City plans to add 500 acres of new parks and trails over the next five years.",
  date: "2023-07-14",
  source: "Houston Chronicle",
  language: "en",
  relevance: 8.4,
  url: "https://example.com/news/401"
}, {
  id: 402,
  cityId: 4,
  title: "Energy Conference Brings Industry Leaders to Downtown",
  summary: "Annual event focuses on renewable energy transition strategies for oil and gas companies.",
  date: "2023-07-10",
  source: "Energy Daily",
  language: "en",
  relevance: 9.3,
  url: "https://example.com/news/402"
},
// Phoenix news
{
  id: 501,
  cityId: 5,
  title: "Phoenix Implements New Water Conservation Plan",
  summary: "Amid ongoing drought, city launches comprehensive water management strategy.",
  date: "2023-07-15",
  source: "Arizona Republic",
  language: "en",
  relevance: 9.6,
  url: "https://example.com/news/501"
}, {
  id: 502,
  cityId: 5,
  title: "Downtown Arts District Receives $10M Revitalization Grant",
  summary: "Federal funding will support local artists and renovate historic buildings in the area.",
  date: "2023-07-08",
  source: "Phoenix Arts Weekly",
  language: "en",
  relevance: 7.7,
  url: "https://example.com/news/502"
}];