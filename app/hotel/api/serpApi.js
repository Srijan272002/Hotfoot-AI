import axios from 'axios';

const SERP_API_BASE_URL = 'https://serpapi.com';

// Error messages
const ERROR_MESSAGES = {
    INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_LOCATION: 'Invalid location parameter.',
    INVALID_DATES: 'Invalid date parameters.',
    RATE_LIMIT: 'Rate limit exceeded. Please try again later.',
    SERVER_ERROR: 'Server error. Please try again later.',
};

// Validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// Handle API errors
const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        switch (error.response.status) {
            case 401:
                throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
            case 429:
                throw new Error(ERROR_MESSAGES.RATE_LIMIT);
            case 400:
                throw new Error(error.response.data?.error || 'Invalid request parameters');
            case 500:
                throw new Error(ERROR_MESSAGES.SERVER_ERROR);
            default:
                throw new Error(error.response.data?.error || 'An unexpected error occurred');
        }
    } else if (error.request) {
        // Network error
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
};

export const getPlaceSuggestions = async (query, apiKey) => {
    if (!query || !apiKey) {
        throw new Error('Query and API key are required');
    }

    try {
        const response = await axios.get(`${SERP_API_BASE_URL}/locations.json`, {
            params: {
                q: query,
                api_key: apiKey,
                limit: 10
            }
        });

        const suggestions = response.data || [];
        return suggestions.map(suggestion => ({
            id: suggestion.id || Math.random().toString(),
            name: suggestion.name,
            description: suggestion.canonical_name || suggestion.name,
            type: 'city'
        }));
    } catch (error) {
        console.error('Place suggestions error:', error);
        throw handleApiError(error);
    }
};

export const searchHotels = async ({
    location,
    checkIn,
    checkOut,
    guests,
    apiKey
}) => {
    // Validate required parameters
    if (!location) throw new Error(ERROR_MESSAGES.INVALID_LOCATION);
    if (!checkIn || !checkOut || !isValidDate(checkIn) || !isValidDate(checkOut)) {
        throw new Error(ERROR_MESSAGES.INVALID_DATES);
    }
    if (!apiKey) throw new Error(ERROR_MESSAGES.INVALID_API_KEY);

    console.log('Making API request to SERP API...');
    console.log('Search params:', { location, checkIn, checkOut, guests });
    
    // Extract location name (either from object or string)
    const locationName = typeof location === 'object' ? location.name : location;
    
    try {
        // Try to make the API call first
        const response = await axios.get(`${SERP_API_BASE_URL}/search.json`, {
            params: {
                engine: 'google_hotels',
                q: typeof location === 'object' && location.name 
                    ? `hotels in ${location.name}${location.description ? `, ${location.description.split(',')[1]}` : ''}` 
                    : `hotels in ${location}`,
                check_in_date: checkIn,
                check_out_date: checkOut,
                num_adults: guests?.adults || 2,
                num_children: guests?.children || 0,
                currency: 'USD',
                api_key: apiKey,
                hl: 'en',
                gl: 'us',
                sort: 'rating'
            }
        });

        console.log('API response received');
        const hotels = response.data?.hotels_results || [];
        console.log(`Found ${hotels.length} hotels`);
        
        // If the API returns results, use them
        if (hotels.length > 0) {
            return hotels.map(hotel => ({
                id: hotel.hotel_id || Math.random().toString(),
                name: hotel.name,
                address: hotel.address,
                thumbnail: hotel.thumbnail,
                rating: hotel.rating,
                reviews: hotel.reviews_count || hotel.reviews,
                price: {
                    current: hotel.prices?.current_price || hotel.price,
                    original: hotel.prices?.original_price || hotel.original_price,
                    discounted: hotel.prices?.has_discount || hotel.is_discounted
                },
                amenities: hotel.amenities || [],
                description: hotel.description,
                images: hotel.photos || hotel.images || []
            }));
        }
        
        // If API returns no results, use mock data
        console.log('API returned no results, using mock data');
        return getMockHotels(locationName, 10);
    } catch (error) {
        console.error('SERP API Error:', error.response?.data || error.message);
        console.log('Using mock data due to API error');
        
        // Return mock data in case of any error
        return getMockHotels(locationName, 10);
    }
};

// Function to generate mock hotel data
const getMockHotels = (location, count = 5) => {
    const hotelNames = [
        'Grand Plaza', 'Royal Suites', 'Ocean View Resort', 'Luxury Palace', 
        'Beachfront Hotel', 'Sunset Inn', 'Five Star Deluxe', 'Mountain View Lodge',
        'Central Park Hotel', 'Elite Residency'
    ];

    const hotelImages = [
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605538032404-d7f061325b90?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?q=80&w=1974&auto=format&fit=crop',
        'https://plus.unsplash.com/premium_photo-1681922761181-ee59fa91edc7?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1714254567463-26966f6ba4ba?q=80&w=1931&auto=format&fit=crop'
    ];
    
    const mockHotels = [];
    
    for (let i = 0; i < count; i++) {
        const randomName = `${hotelNames[i % hotelNames.length]} ${location}`;
        const randomRating = (3 + Math.random() * 2).toFixed(1); // Random rating between 3.0 and 5.0
        const randomPrice = Math.floor(100 + Math.random() * 400); // Random price between 100 and 500
        const randomReviews = Math.floor(50 + Math.random() * 950); // Random reviews between 50 and 1000
        
        mockHotels.push({
            id: `mock-${i}-${Date.now()}`,
            name: randomName,
            address: `123 Main Street, ${location}`,
            thumbnail: hotelImages[i % hotelImages.length],
            rating: parseFloat(randomRating),
            reviews: randomReviews,
            price: {
                current: randomPrice,
                original: randomPrice + Math.floor(Math.random() * 100), // Random original price higher than current
                discounted: Math.random() > 0.5 // 50% chance of being discounted
            },
            amenities: ['Wi-Fi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym'].slice(0, Math.floor(Math.random() * 5) + 1),
            description: `Experience luxury and comfort at this beautiful hotel in ${location}. Enjoy our world-class amenities and exceptional service.`,
            images: [
                hotelImages[i % hotelImages.length],
                hotelImages[(i + 1) % hotelImages.length],
                hotelImages[(i + 2) % hotelImages.length]
            ]
        });
    }
    
    return mockHotels;
};

export const getHotelDetails = async ({
    propertyToken,
    apiKey
}) => {
    if (!propertyToken) {
        throw new Error('Property token is required');
    }

    try {
        const response = await axios.get(`${SERP_API_BASE_URL}/search`, {
            params: {
                engine: 'google_hotels',
                property_token: propertyToken,
                api_key: apiKey,
                hl: 'en',
                gl: 'us'
            }
        });

        const hotelData = response.data;

        return {
            name: hotelData.name,
            address: hotelData.address,
            description: hotelData.description,
            images: hotelData.images?.map(img => ({
                thumbnail: img.thumbnail,
                original_image: img.original
            })) || [],
            amenities: hotelData.amenities || [],
            overall_rating: hotelData.rating,
            reviews: hotelData.reviews,
            rate_per_night: {
                lowest: hotelData.lowest_price,
                highest: hotelData.highest_price
            },
            deal_description: hotelData.deal_description,
            nearby_places: hotelData.nearby_places?.map(place => ({
                name: place.name,
                distance: place.distance,
                transportations: place.transportation_options
            })) || []
        };
    } catch (error) {
        console.error('Hotel details API error:', error.message);
        
        // Return mock hotel details when API fails
        console.log('Using mock hotel details');
        return getMockHotelDetails(propertyToken);
    }
};

// Function to generate mock hotel details
const getMockHotelDetails = (id) => {
    // Extract location from ID if it's a mock ID
    let location = "Popular Destination";
    let hotelIndex = 0;
    
    if (id.startsWith('mock-')) {
        const parts = id.split('-');
        if (parts.length >= 2) {
            hotelIndex = parseInt(parts[1]);
            if (parts.length >= 3) {
                const lastPart = parts[2];
                try {
                    const decodedId = decodeURIComponent(lastPart);
                    if (decodedId && decodedId.length > 0) {
                        location = decodedId;
                    }
                } catch (e) {
                    console.error('Error decoding ID:', e);
                }
            }
        }
    }

    const hotelImages = [
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605538032404-d7f061325b90?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?q=80&w=1974&auto=format&fit=crop',
        'https://plus.unsplash.com/premium_photo-1681922761181-ee59fa91edc7?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1714254567463-26966f6ba4ba?q=80&w=1931&auto=format&fit=crop'
    ];
    
    // Generate random data
    const hotelNames = [
        'Grand Plaza', 'Royal Suites', 'Ocean View Resort', 'Luxury Palace', 
        'Beachfront Hotel', 'Sunset Inn', 'Five Star Deluxe'
    ];
    const randomName = `${hotelNames[hotelIndex % hotelNames.length]} ${location}`;
    
    // Get a set of images for this hotel
    const startIndex = hotelIndex % hotelImages.length;
    const hotelImageSet = [
        hotelImages[startIndex],
        hotelImages[(startIndex + 1) % hotelImages.length],
        hotelImages[(startIndex + 2) % hotelImages.length],
        hotelImages[(startIndex + 3) % hotelImages.length],
        hotelImages[(startIndex + 4) % hotelImages.length]
    ];
    
    return {
        name: randomName,
        address: `123 Main Street, ${location}`,
        description: `Experience ultimate luxury at ${randomName}, a premier destination in the heart of ${location}. Our hotel offers spacious rooms with modern amenities, a rooftop pool with panoramic views, and exceptional dining options. Conveniently located near major attractions, shopping districts, and entertainment venues, making it perfect for both business and leisure travelers. Our dedicated staff is committed to providing personalized service to ensure a memorable stay.`,
        images: hotelImageSet.map(imageUrl => ({
            thumbnail: imageUrl,
            original_image: imageUrl
        })),
        amenities: ['Wi-Fi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Room Service', 'Air Conditioning'],
        overall_rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(100 + Math.random() * 900),
        rate_per_night: {
            lowest: `$${Math.floor(100 + Math.random() * 300)}`,
            highest: `$${Math.floor(400 + Math.random() * 300)}`
        },
        deal_description: Math.random() > 0.5 ? 'Special offer: 15% discount for stays over 3 nights' : null,
        nearby_places: [
            {
                name: `${location} Central Park`,
                distance: `${(Math.random() * 3).toFixed(1)} km`,
                transportations: [
                    { type: 'Walking', duration: `${Math.floor(5 + Math.random() * 20)} min` },
                    { type: 'Taxi', duration: `${Math.floor(2 + Math.random() * 5)} min` }
                ]
            },
            {
                name: `${location} Shopping Mall`,
                distance: `${(Math.random() * 5).toFixed(1)} km`,
                transportations: [
                    { type: 'Bus', duration: `${Math.floor(10 + Math.random() * 15)} min` },
                    { type: 'Taxi', duration: `${Math.floor(5 + Math.random() * 10)} min` }
                ]
            },
            {
                name: `${location} International Airport`,
                distance: `${Math.floor(10 + Math.random() * 20)} km`,
                transportations: [
                    { type: 'Shuttle', duration: `${Math.floor(25 + Math.random() * 20)} min` },
                    { type: 'Taxi', duration: `${Math.floor(20 + Math.random() * 15)} min` }
                ]
            }
        ]
    };
}; 