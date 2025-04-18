import { useCallback, useRef } from 'react';
import { searchHotels, getPlaceSuggestions } from '../api/serpApi';
import { getDestinationImages } from '../api/pixabayApi';
import debounce from 'lodash/debounce';
import { router } from 'expo-router';
import useHotelStore from '../../store/hotelStore';

const DEBOUNCE_DELAY = 300; // milliseconds
const MIN_SEARCH_LENGTH = 2;

export const useHotelSearch = () => {
    const {
        searchParams,
        searchResults,
        locationSuggestions,
        loading,
        error,
        setSearchParams,
        setSearchResults,
        setLocationSuggestions,
        setLoading,
        setError,
        clearSearchResults
    } = useHotelStore();
    
    // Keep track of the latest request
    const lastRequestId = useRef(0);

    const validateApiKeys = useCallback(() => {
        const serpApiKey = process.env.EXPO_PUBLIC_SERP_API_KEY;
        const pixabayApiKey = process.env.EXPO_PUBLIC_PIXABAY_API_KEY;

        if (!serpApiKey) {
            throw new Error('SERP API key is missing. Please check your environment configuration.');
        }
        if (!pixabayApiKey) {
            throw new Error('Pixabay API key is missing. Please check your environment configuration.');
        }

        return { serpApiKey, pixabayApiKey };
    }, []);

    const handleSearch = useCallback(async (params) => {
        try {
            setError(null);
            setLoading(true);
            console.log('Validating API keys...');
            const { serpApiKey } = validateApiKeys();
            console.log('API keys validated, proceeding with search...');

            const results = await searchHotels({
                ...params,
                apiKey: serpApiKey
            });
            
            if (!results || results.length === 0) {
                setError('No hotels found for your search criteria. Please try a different location or dates.');
                setSearchResults([]);
            } else {
                setSearchResults(results);
                setError(null);
                // Navigate to results screen
                router.push('/hotel/results');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Failed to search hotels. Please try again.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [validateApiKeys, setError, setLoading, setSearchResults]);

    // Format location data with images
    const formatLocationData = useCallback(async (suggestion) => {
        try {
            const { pixabayApiKey } = validateApiKeys();
            const images = await getDestinationImages({
                query: `${suggestion.name} ${suggestion.country || ''} landmarks`,
                apiKey: pixabayApiKey
            });

            return {
                name: suggestion.name,
                type: suggestion.type,
                country: suggestion.country,
                code: suggestion.id,
                description: suggestion.description,
                images: images
            };
        } catch (error) {
            console.error('Error fetching images:', error);
            return {
                ...suggestion,
                images: []
            };
        }
    }, [validateApiKeys]);

    const fetchLocationSuggestions = useCallback(async (query) => {
        if (!query || query.length < MIN_SEARCH_LENGTH) {
            setLocationSuggestions([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const { serpApiKey } = validateApiKeys();
            
            const suggestions = await getPlaceSuggestions(query, serpApiKey);
            const formattedSuggestions = suggestions.map(place => ({
                id: place.id || Math.random().toString(),
                name: place.name.split(',')[0].trim(),
                type: 'city',
                description: place.description || place.formatted_address,
                images: place.images || []
            }));
            
            setLocationSuggestions(formattedSuggestions);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setError('Failed to fetch location suggestions. Please try again.');
            setLocationSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, [validateApiKeys, setLocationSuggestions, setLoading, setError]);

    // Debounced version of fetchLocationSuggestions
    const debouncedFetchSuggestions = useCallback(
        debounce(fetchLocationSuggestions, DEBOUNCE_DELAY),
        [fetchLocationSuggestions]
    );

    return {
        searchParams,
        searchResults,
        locationSuggestions,
        loading,
        error,
        handleSearch,
        fetchLocationSuggestions: debouncedFetchSuggestions,
        setSearchParams,
        clearSearchResults,
        setError
    };
}; 