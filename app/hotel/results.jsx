import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import HotelSearchResults from '../../components/hotel/HotelSearchResults';

export default function HotelResultsPage() {
    const params = useLocalSearchParams();
    
    return (
        <HotelSearchResults 
            searchParams={params}
            onClose={() => router.back()}
        />
    );
} 