export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'API key not configured on server' });
  }

  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ message: 'Request body must contain a payload.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API Error:', errorText);
      return res.status(response.status).json({ message: `Google API Error: ${errorText}` });
    }

    const result = await response.json();
    res.status(200).json(result);

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
