// api/hourly.js
export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const apiKey = process.env.MET_OFFICE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key in environment variables." });
  }

  const url = `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=${lat}&longitude=${lon}&includeLocationName=true`;

  try {
    const fetchResponse = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).json({ error: 'Failed to fetch hourly weather data from Met Office' });
    }

    const data = await fetchResponse.json();
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
