// api/weather.js
export default async function handler(req, res) {
  // Grab the latitude and longitude sent from your HTML
  const { lat, lon } = req.query;
  
  // Pull the API key from Vercel's secure environment variables
  const apiKey = process.env.MET_OFFICE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key in environment variables." });
  }

  const url = `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/daily?latitude=${lat}&longitude=${lon}&includeLocationName=true`;

  try {
    const fetchResponse = await fetch(url, {
      headers: { 
        'apikey': apiKey, 
        'Accept': 'application/json' 
      }
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).json({ error: 'Failed to fetch weather data from Met Office' });
    }

    const data = await fetchResponse.json();
    
    // Crucial: Tell Vercel to cache this result globally for 30 minutes (1800 seconds).
    // If 100 people load the site, Vercel only hits the Met Office API once!
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}