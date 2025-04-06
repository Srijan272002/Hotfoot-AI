export const API_CONFIG = {
    SERP_API_KEY: process.env.EXPO_PUBLIC_SERP_API_KEY || 'YOUR_SERP_API_KEY',
};

export const TRENDING_SEARCHES = [
    {
        id: 1,
        title: 'Luxury resorts in Maldives',
        type: 'Hotels',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
        percentage: '96%'
    },
    {
        id: 2,
        title: 'Direct flights to Bali',
        type: 'Flights',
        image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1',
        percentage: '85%'
    },
    {
        id: 3,
        title: 'Best coffee shops in Rome',
        type: 'Experiences',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
        percentage: '78%'
    },
    {
        id: 4,
        title: 'Hidden beaches in Greece',
        type: 'Beaches',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077',
        percentage: '92%'
    }
];

export const TRENDING_DESTINATIONS = [
    {
        id: 1,
        city: 'Kyoto',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'
    },
    {
        id: 2,
        city: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff'
    },
    {
        id: 3,
        city: 'London',
        country: 'United Kingdom',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
    }
]; 