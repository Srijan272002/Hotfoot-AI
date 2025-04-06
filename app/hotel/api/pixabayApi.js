import axios from 'axios';

const PIXABAY_API_BASE_URL = 'https://pixabay.com/api/';

export const getDestinationImages = async ({ query, apiKey }) => {
    if (!query) {
        throw new Error('Search query is required');
    }

    try {
        const response = await axios.get(PIXABAY_API_BASE_URL, {
            params: {
                key: apiKey,
                q: `${query} city landmark`,
                image_type: 'photo',
                orientation: 'horizontal',
                category: 'places',
                safesearch: true,
                per_page: 5,
                min_width: 1000,
                min_height: 800
            }
        });

        return response.data.hits.map(image => ({
            id: image.id,
            thumbnail: image.webformatURL,
            large: image.largeImageURL,
            preview: image.previewURL,
            description: image.tags,
            credit: image.user
        }));
    } catch (error) {
        console.error('Pixabay API error:', error);
        throw new Error('Failed to fetch destination images');
    }
}; 