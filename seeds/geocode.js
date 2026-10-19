require('dotenv').config({ path: './seedsCredentials.env'})

// Helper delay function to respect Nominatim's rate limit (1 request per second)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCoordinates = async (cityName, stateName) => {
    const query = encodeURIComponent(`${cityName},${stateName},Nepal`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': `YelpCampSeederScript/1.0 (${process.env.DEVELOPER_EMAIL})`
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        } else {
            console.log(`Location not found for: ${cityName}`);
            return null;
        }
    } catch (err) {
        console.error("Geocoding error:", err);
        return null;
    }
};

module.exports = getCoordinates;