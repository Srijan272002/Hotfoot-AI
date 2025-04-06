import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react-native';
import HotelCard from './HotelCard';
import HotelDetails from './HotelDetails';
import FiltersModal from './FiltersModal';
import { SerpApiService } from '../../services/SerpApiService';
import { API_CONFIG } from '../../config';

const HotelSearchResults = ({ searchParams }) => {
    const router = useRouter();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: [0, 1000],
        rating: 0,
        amenities: [],
    });
    const [sortBy, setSortBy] = useState('recommended');

    useEffect(() => {
        fetchHotels();
    }, [searchParams, filters, sortBy]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const serpApi = new SerpApiService(API_CONFIG.SERP_API_KEY);
            const results = await serpApi.searchHotels({
                query: searchParams.destination,
                checkInDate: searchParams.checkIn,
                checkOutDate: searchParams.checkOut,
                adults: parseInt(searchParams.adults),
                children: parseInt(searchParams.children),
                priceMin: filters.priceRange[0],
                priceMax: filters.priceRange[1],
                minRating: filters.rating,
                amenities: filters.amenities,
                sortBy,
            });
            setHotels(results);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHotelPress = (hotel) => {
        router.push({
            pathname: `/hotel/${hotel.id}`,
            params: { hotel: JSON.stringify(hotel) }
        });
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowFilters(true)}
            >
                <SlidersHorizontal size={20} color="#000" />
                <Text style={styles.headerButtonText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowSortOptions(true)}
            >
                <ArrowUpDown size={20} color="#000" />
                <Text style={styles.headerButtonText}>Sort</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSortModal = () => (
        <Modal
            visible={showSortOptions}
            transparent
            animationType="slide"
            onRequestClose={() => setShowSortOptions(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Sort By</Text>
                    {[
                        { id: 'recommended', label: 'Recommended' },
                        { id: 'price_low', label: 'Price: Low to High' },
                        { id: 'price_high', label: 'Price: High to Low' },
                        { id: 'rating', label: 'Rating' },
                    ].map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.sortOption,
                                sortBy === option.id && styles.sortOptionSelected,
                            ]}
                            onPress={() => {
                                setSortBy(option.id);
                                setShowSortOptions(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.sortOptionText,
                                    sortBy === option.id && styles.sortOptionTextSelected,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (selectedHotel) {
        return (
            <HotelDetails
                hotel={selectedHotel}
                onClose={() => setSelectedHotel(null)}
            />
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}

            <FlatList
                data={hotels}
                renderItem={({ item }) => (
                    <HotelCard hotel={item} onPress={handleHotelPress} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No hotels found matching your criteria
                        </Text>
                    </View>
                )}
            />

            <FiltersModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
            />

            {renderSortModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    headerButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    sortOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sortOptionSelected: {
        backgroundColor: '#f5f5f5',
    },
    sortOptionText: {
        fontSize: 16,
        color: '#444',
    },
    sortOptionTextSelected: {
        fontWeight: '600',
        color: '#000',
    },
});

export default HotelSearchResults; 