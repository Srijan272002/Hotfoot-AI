import axios from 'axios';

const SERP_API_BASE_URL = 'https://serpapi.com/search.json';

export class SerpApiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // Search for hotels with various parameters
    async searchHotels({
        query,
        checkInDate,
        checkOutDate,
        adults = 2,
        children = 0,
        currency = 'USD',
        language = 'en',
        country = 'us'
    }) {
        try {
            const response = await axios.get(SERP_API_BASE_URL, {
                params: {
                    api_key: this.apiKey,
                    engine: 'google_hotels',
                    q: query,
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate,
                    adults,
                    children,
                    currency,
                    hl: language,
                    gl: country
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching hotels:', error);
            throw error;
        }
    }

    // Get detailed information about a specific hotel
    async getHotelDetails(propertyToken) {
        try {
            const response = await axios.get(SERP_API_BASE_URL, {
                params: {
                    api_key: this.apiKey,
                    engine: 'google_hotels',
                    property_token: propertyToken
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting hotel details:', error);
            throw error;
        }
    }

    // Search for trending destinations
    async searchTrendingDestinations() {
        try {
            const destinations = [
                { query: 'Kyoto hotels', country: 'Japan' },
                { query: 'Santorini hotels', country: 'Greece' },
                { query: 'London hotels', country: 'UK' }
            ];

            const results = await Promise.all(
                destinations.map(dest => 
                    this.searchHotels({
                        query: dest.query,
                        checkInDate: this.getDefaultCheckInDate(),
                        checkOutDate: this.getDefaultCheckOutDate()
                    })
                )
            );

            return results.map((result, index) => ({
                ...result,
                destination: destinations[index]
            }));
        } catch (error) {
            console.error('Error fetching trending destinations:', error);
            throw error;
        }
    }

    // Helper method to get default check-in date (tomorrow)
    getDefaultCheckInDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    // Helper method to get default check-out date (day after tomorrow)
    getDefaultCheckOutDate() {
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        return dayAfterTomorrow.toISOString().split('T')[0];
    }
} 