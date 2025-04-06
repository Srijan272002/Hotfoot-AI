import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, ChevronDown, Users, Search, MapPin, Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TRENDING_SEARCHES, TRENDING_DESTINATIONS } from '../../config/api';
import { SerpApiService } from '../../services/SerpApiService';
import DatePickerModal from '../datePickerModal/datePickerModal';
import PlaceAutocomplete from '../googleAutocomplete/placeAutocomplete';
import TravelersModal from '../modals/TravelersModal';
import { API_CONFIG } from '../../config/api';

const { width } = Dimensions.get('window');

const HotelSearchPage = () => {
    // State management
    const [destination, setDestination] = useState(null);
    const [dates, setDates] = useState({ startDate: null, endDate: null });
    const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isDestinationModalVisible, setIsDestinationModalVisible] = useState(false);
    const [isTravelersModalVisible, setIsTravelersModalVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    // Initialize SerpApi service
    const serpApi = new SerpApiService(API_CONFIG.SERP_API_KEY);

    // Handle destination selection
    const handleDestinationSelect = (place) => {
        setDestination(place);
        setIsDestinationModalVisible(false);
    };

    // Handle date selection
    const handleDateSelect = (selectedDates) => {
        setDates(selectedDates);
        setIsDatePickerVisible(false);
    };

    // Handle search button press
    const handleSearch = async () => {
        if (!destination || !dates.startDate || !dates.endDate) return;

        try {
            const searchResult = await serpApi.searchHotels({
                query: destination.name,
                checkInDate: dates.startDate,
                checkOutDate: dates.endDate,
                adults: travelers.adults,
                children: travelers.children
            });

            // Save to recent searches
            const newSearch = {
                id: Date.now(),
                destination: destination.name,
                dates: `${dates.startDate} - ${dates.endDate}`,
                travelers: travelers.adults + travelers.children
            };
            setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);

            // Navigate to results page with the data
            // navigation.navigate('HotelResults', { searchResult });
        } catch (error) {
            console.error('Search failed:', error);
            // Show error message to user
        }
    };

    // Render trending search item
    const renderTrendingSearchItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.trendingSearchCard}
            onPress={() => handleDestinationSelect({ name: item.title })}
        >
            <Image source={{ uri: item.image }} style={styles.trendingSearchImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            >
                <View style={styles.trendingSearchContent}>
                    <Text style={styles.trendingSearchTitle}>{item.title}</Text>
                    <View style={styles.trendingSearchMeta}>
                        <Text style={styles.trendingSearchType}>{item.type}</Text>
                        {item.percentage && (
                            <Text style={styles.trendingSearchPercentage}>{item.percentage} recommended</Text>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    // Render trending destination item
    const renderTrendingDestination = ({ item }) => (
        <TouchableOpacity 
            style={styles.destinationCard}
            onPress={() => handleDestinationSelect({ name: `${item.city}, ${item.country}` })}
        >
            <Image source={{ uri: item.image }} style={styles.destinationImage} />
            <View style={styles.destinationContent}>
                <Text style={styles.destinationCity}>{item.city}</Text>
                <Text style={styles.destinationCountry}>{item.country}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Search Form */}
                <Animated.View 
                    entering={FadeInDown.delay(200).springify()}
                    style={styles.searchForm}
                >
                    <Text style={styles.title}>Find your perfect stay</Text>

                    {/* Destination Input */}
                    <Pressable
                        style={styles.input}
                        onPress={() => setIsDestinationModalVisible(true)}
                    >
                        <MapPin size={20} color="#666" />
                        <Text style={styles.inputText}>
                            {destination ? destination.name : 'Where are you going?'}
                        </Text>
                    </Pressable>

                    {/* Date Selection */}
                    <Pressable
                        style={styles.input}
                        onPress={() => setIsDatePickerVisible(true)}
                    >
                        <Calendar size={20} color="#666" />
                        <Text style={styles.inputText}>
                            {dates.startDate && dates.endDate
                                ? `${dates.startDate} - ${dates.endDate}`
                                : 'Select dates'}
                        </Text>
                    </Pressable>

                    {/* Travelers Selection */}
                    <Pressable
                        style={styles.input}
                        onPress={() => setIsTravelersModalVisible(true)}
                    >
                        <Users size={20} color="#666" />
                        <Text style={styles.inputText}>
                            {`${travelers.adults + travelers.children} Travelers`}
                        </Text>
                        <ChevronDown size={20} color="#666" />
                    </Pressable>

                    {/* Search Button */}
                    <TouchableOpacity
                        style={[
                            styles.searchButton,
                            (!destination || !dates.startDate || !dates.endDate) && styles.searchButtonDisabled
                        ]}
                        onPress={handleSearch}
                        disabled={!destination || !dates.startDate || !dates.endDate}
                    >
                        <Text style={styles.searchButtonText}>Search Hotels</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Trending Searches */}
                <Animated.View
                    entering={FadeInUp.delay(400).springify()}
                    style={styles.section}
                >
                    <Text style={styles.sectionTitle}>Trending Searches</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.trendingSearchesContainer}
                    >
                        {TRENDING_SEARCHES.map(item => renderTrendingSearchItem({ item }))}
                    </ScrollView>
                </Animated.View>

                {/* Trending Destinations */}
                <Animated.View
                    entering={FadeInUp.delay(600).springify()}
                    style={styles.section}
                >
                    <Text style={styles.sectionTitle}>Trending Destinations</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.destinationsContainer}
                    >
                        {TRENDING_DESTINATIONS.map(item => renderTrendingDestination({ item }))}
                    </ScrollView>
                </Animated.View>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                    <Animated.View
                        entering={FadeInUp.delay(800).springify()}
                        style={styles.section}
                    >
                        <Text style={styles.sectionTitle}>Recent Searches</Text>
                        {recentSearches.map(search => (
                            <TouchableOpacity 
                                key={search.id}
                                style={styles.recentSearchItem}
                                onPress={() => handleDestinationSelect({ name: search.destination })}
                            >
                                <Search size={20} color="#666" />
                                <View style={styles.recentSearchContent}>
                                    <Text style={styles.recentSearchDestination}>{search.destination}</Text>
                                    <Text style={styles.recentSearchDetails}>
                                        {`${search.dates} · ${search.travelers} Travelers`}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}
            </ScrollView>

            {/* Modals */}
            <PlaceAutocomplete
                modalVisible={isDestinationModalVisible}
                setModalVisible={setIsDestinationModalVisible}
                onSelect={handleDestinationSelect}
            />

            <DatePickerModal
                visible={isDatePickerVisible}
                onClose={() => setIsDatePickerVisible(false)}
                onSelectDates={handleDateSelect}
                initialDates={dates}
            />

            <TravelersModal
                visible={isTravelersModalVisible}
                onClose={() => setIsTravelersModalVisible(false)}
                travelers={travelers}
                setTravelers={setTravelers}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchForm: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 15,
    },
    inputText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    searchButtonDisabled: {
        backgroundColor: '#ccc',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    trendingSearchesContainer: {
        paddingRight: 20,
    },
    trendingSearchCard: {
        width: width * 0.8,
        height: 200,
        marginRight: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    trendingSearchImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 15,
    },
    trendingSearchContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    trendingSearchTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    trendingSearchMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendingSearchType: {
        color: '#fff',
        fontSize: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 10,
    },
    trendingSearchPercentage: {
        color: '#fff',
        fontSize: 14,
    },
    destinationsContainer: {
        paddingRight: 20,
    },
    destinationCard: {
        width: 150,
        marginRight: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    destinationImage: {
        width: '100%',
        height: 200,
    },
    destinationContent: {
        padding: 10,
    },
    destinationCity: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    destinationCountry: {
        fontSize: 14,
        color: '#666',
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 10,
    },
    recentSearchContent: {
        marginLeft: 15,
    },
    recentSearchDestination: {
        fontSize: 16,
        fontWeight: '600',
    },
    recentSearchDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default HotelSearchPage; 