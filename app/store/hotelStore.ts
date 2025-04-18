import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
interface Hotel {
    id: string;
    name: string;
    address: string;
    thumbnail: string;
    rating: number;
    reviews: number;
    price: {
        current: number;
        original?: number;
        discounted: boolean;
    };
    amenities: string[];
    description?: string;
    images: string[];
}

interface SearchParams {
    location: any;
    checkIn: string | null;
    checkOut: string | null;
    guests: {
        adults: number;
        children: number;
    };
}

interface HotelState {
    // Search state
    searchParams: SearchParams;
    searchResults: Hotel[];
    locationSuggestions: any[];
    loading: boolean;
    error: string | null;
    
    // Selected hotel state
    selectedHotel: Hotel | null;
    
    // Favorite hotels
    favoriteHotels: Hotel[];
    
    // Actions
    setSearchParams: (params: Partial<SearchParams>) => void;
    setSearchResults: (results: Hotel[]) => void;
    setLocationSuggestions: (suggestions: any[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSelectedHotel: (hotel: Hotel | null) => void;
    addToFavorites: (hotel: Hotel) => void;
    removeFromFavorites: (hotelId: string) => void;
    clearSearchResults: () => void;
}

const useHotelStore = create<HotelState>()(
    persist(
        (set) => ({
            // Initial state
            searchParams: {
                location: null,
                checkIn: null,
                checkOut: null,
                guests: {
                    adults: 2,
                    children: 0,
                },
            },
            searchResults: [],
            locationSuggestions: [],
            loading: false,
            error: null,
            selectedHotel: null,
            favoriteHotels: [],

            // Actions
            setSearchParams: (params) =>
                set((state) => ({
                    searchParams: { ...state.searchParams, ...params },
                })),

            setSearchResults: (results) =>
                set(() => ({
                    searchResults: results,
                    error: null,
                })),

            setLocationSuggestions: (suggestions) =>
                set(() => ({
                    locationSuggestions: suggestions,
                })),

            setLoading: (loading) =>
                set(() => ({
                    loading,
                })),

            setError: (error) =>
                set(() => ({
                    error,
                })),

            setSelectedHotel: (hotel) =>
                set(() => ({
                    selectedHotel: hotel,
                })),

            addToFavorites: (hotel) =>
                set((state) => ({
                    favoriteHotels: [...state.favoriteHotels, hotel],
                })),

            removeFromFavorites: (hotelId) =>
                set((state) => ({
                    favoriteHotels: state.favoriteHotels.filter((h) => h.id !== hotelId),
                })),

            clearSearchResults: () =>
                set(() => ({
                    searchResults: [],
                    error: null,
                })),
        }),
        {
            name: 'hotel-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useHotelStore; 