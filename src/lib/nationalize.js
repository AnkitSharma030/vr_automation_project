import axios from 'axios';

const NATIONALIZE_API_URL = 'https://api.nationalize.io';

async function enrichName(name) {
    try {
        const response = await axios.get(NATIONALIZE_API_URL, {
            params: { name: name.trim() },
        });

        const data = response.data;

        // Get the most likely country (highest probability)
        if (data.country && data.country.length > 0) {
            const mostLikely = data.country[0];
            return {
                country: mostLikely.country_id,
                probability: mostLikely.probability,
            };
        }

        // If no country data, return unknown
        return {
            country: 'Unknown',
            probability: 0,
        };
    } catch (error) {
        console.error(`Error enriching name "${name}":`, error.message);
        // Return default values on error
        return {
            country: 'Error',
            probability: 0,
        };
    }
}


export async function processBatch(names) {
    // Remove duplicates and filter empty names
    const uniqueNames = [...new Set(names.filter(name => name && name.trim()))];

    // Process all names concurrently using Promise.all for efficiency
    const promises = uniqueNames.map(name => enrichName(name));

    try {
        const results = await Promise.all(promises);

        return uniqueNames.map((name, index) => ({
            name: name.trim(),
            ...results[index],
        }));
    } catch (error) {
        console.error('Error processing batch:', error);
        throw new Error('Failed to process names batch');
    }
}
