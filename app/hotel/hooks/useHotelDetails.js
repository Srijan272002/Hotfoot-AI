import { useState, useEffect } from 'react';
import { getHotelDetails } from '../api/serpApi';

export const useHotelDetails = (propertyToken) => {
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!propertyToken) {
                setError('Property token is required');
                setLoading(false);
                return;
            }

            try {
                const data = await getHotelDetails({
                    propertyToken,
                    apiKey: process.env.EXPO_PUBLIC_SERP_API_KEY
                });
                setHotel(data);
            } catch (err) {
                setError('Failed to fetch hotel details. Please try again.');
                console.error('Error fetching hotel details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [propertyToken]);

    return {
        hotel,
        loading,
        error
    };
}; 