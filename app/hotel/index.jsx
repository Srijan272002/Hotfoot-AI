import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    Alert,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHotelSearch } from './hooks/useHotelSearch';
import { HotelCard } from './components/HotelCard';
import { Calendar, Users, Search, ChevronLeft } from 'lucide-react-native';
import { PlaceAutocomplete } from './components/PlaceAutocomplete';
import { TravelersModal } from './components/TravelersModal';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { DateSelection } from './components/DateSelection';
import { router, Stack } from 'expo-router';

// Trending searches data
const trendingSearches = [
    {
        title: 'Luxury resorts in Maldives',
        type: 'Hotels',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000'
    },
    {
        title: 'Direct flights to Bali',
        type: 'Flights',
        image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1000'
    },
    {
        title: 'Best coffee shops in Rome',
        type: 'Experiences',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000'
    },
    {
        title: 'Hidden beaches in Greece',
        type: 'Beaches',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000'
    }
];

// Trending destinations data
const trendingDestinations = [
    {
        city: 'Kyoto',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000'
    },
    {
        city: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000'
    },
    {
        city: 'London',
        country: 'England',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000'
    }
];

export default function HotelSearchScreen() {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isDestinationModalVisible, setIsDestinationModalVisible] = useState(false);
    const [isTravelersModalVisible, setIsTravelersModalVisible] = useState(false);
    const [showDateSelection, setShowDateSelection] = useState(false);
    const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
    
    const {
        loading,
        error,
        handleSearch,
        locationSuggestions,
        fetchLocationSuggestions
    } = useHotelSearch();

    const handleDestinationSelect = (location) => {
        setSelectedLocation(location);
        setIsDestinationModalVisible(false);
    };

    const handleDateSelect = (dates) => {
        setSelectedDates({
            startDate: dates.startDate,
            endDate: dates.endDate
        });
        setShowDateSelection(false);
    };

    const handleTravelersUpdate = (newTravelers) => {
        setTravelers(newTravelers);
    };

    const handleSearchPress = async () => {
        console.log('Search button pressed');
        console.log('Selected Location:', selectedLocation);
        console.log('Selected Dates:', selectedDates);
        console.log('Travelers:', travelers);

        if (!selectedLocation || !selectedDates.startDate || !selectedDates.endDate) {
            Alert.alert(
                'Missing Information',
                'Please select a destination and dates before searching.'
            );
            return;
        }

        try {
            const searchParams = {
                location: selectedLocation, // Use the full location object
                checkIn: selectedDates.startDate,
                checkOut: selectedDates.endDate,
                guests: {
                    adults: travelers.adults,
                    children: travelers.children
                }
            };

            console.log('Calling search with params:', searchParams);
            await handleSearch(searchParams);
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert(
                'Search Error',
                error.message || 'An error occurred while searching. Please try again.'
            );
        }
    };

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: false,
                }} 
            />
            <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
                <StatusBar barStyle="dark-content" />
                
                {/* Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Navigation Tabs */}
                <View style={styles.navigationBar}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => router.push('/places')}
                    >
                        <Text style={styles.navText}>Places</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => router.push('/flights')}
                    >
                        <Text style={styles.navText}>Flights</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.navItem, styles.activeNavItem]}
                    >
                        <Text style={[styles.navText, styles.activeNavText]}>Hotels</Text>
                        <View style={styles.activeIndicator} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Search Form */}
                    <View style={styles.searchForm}>
                        {/* Destination Input */}
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setIsDestinationModalVisible(true)}
                        >
                            <Text style={styles.inputLabel}>Where to?</Text>
                            <Text style={styles.inputValue}>
                                {selectedLocation ? selectedLocation.name : 'Select destination'}
                            </Text>
                        </TouchableOpacity>

                        {/* Date Selection */}
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setShowDateSelection(true)}
                        >
                            <Text style={styles.inputLabel}>When?</Text>
                            <Text style={styles.inputValue}>
                                {selectedDates.startDate && selectedDates.endDate
                                    ? `${format(new Date(selectedDates.startDate), 'MMM d')} - ${format(new Date(selectedDates.endDate), 'MMM d')}`
                                    : 'Select dates'}
                            </Text>
                        </TouchableOpacity>

                        {/* Travelers Selection */}
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setIsTravelersModalVisible(true)}
                        >
                            <Text style={styles.inputLabel}>Who's going?</Text>
                            <Text style={styles.inputValue}>
                                {`${travelers.adults} Adult${travelers.adults !== 1 ? 's' : ''}, ${travelers.children} Child${travelers.children !== 1 ? 'ren' : ''}`}
                            </Text>
                        </TouchableOpacity>

                        {/* Search Button */}
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearchPress}
                            disabled={loading}
                        >
                            <Text style={styles.searchButtonText}>
                                {loading ? 'Searching...' : 'Search Hotels'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Trending Searches */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trending Searches</Text>
                        <FlatList
                            data={trendingSearches}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.trendingCard}>
                                    <Image source={{ uri: item.image }} style={styles.trendingImage} />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.trendingGradient}
                                    />
                                    <View style={styles.trendingContent}>
                                        <Text style={styles.trendingType}>{item.type}</Text>
                                        <Text style={styles.trendingTitle}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.title}
                        />
                    </View>

                    {/* Trending Destinations */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trending Destinations</Text>
                        <FlatList
                            data={trendingDestinations}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.destinationCard}>
                                    <Image source={{ uri: item.image }} style={styles.destinationImage} />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.destinationGradient}
                                    />
                                    <View style={styles.destinationContent}>
                                        <Text style={styles.destinationCity}>{item.city}</Text>
                                        <Text style={styles.destinationCountry}>{item.country}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.city}
                        />
                    </View>
                </ScrollView>

                {/* Modals */}
                <PlaceAutocomplete
                    visible={isDestinationModalVisible}
                    onClose={() => setIsDestinationModalVisible(false)}
                    onSelect={handleDestinationSelect}
                    suggestions={locationSuggestions}
                    onSearch={fetchLocationSuggestions}
                />

                <DateSelection
                    visible={showDateSelection}
                    onClose={() => setShowDateSelection(false)}
                    onSelect={handleDateSelect}
                    initialDates={selectedDates}
                />

                <TravelersModal
                    visible={isTravelersModalVisible}
                    onClose={() => setIsTravelersModalVisible(false)}
                    travelers={travelers}
                    onUpdate={handleTravelersUpdate}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButton: {
        padding: 4,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'white',
    },
    navItem: {
        paddingVertical: 16,
        position: 'relative',
        minWidth: 60,
        alignItems: 'center',
    },
    navText: {
        fontSize: 16,
        color: '#666',
        opacity: 0.6,
    },
    activeNavText: {
        color: '#000',
        fontWeight: '600',
        opacity: 1,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
    },
    searchForm: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 12,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    inputValue: {
        fontSize: 18,
        color: '#000',
        fontWeight: '600',
    },
    searchButton: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        margin: 16,
        padding: 12,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
    },
    errorText: {
        color: '#FF385C',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    trendingCard: {
        width: 280,
        height: 180,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    trendingImage: {
        width: '100%',
        height: '100%',
    },
    trendingGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    trendingContent: {
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    trendingType: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.8,
        marginBottom: 4,
    },
    trendingTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    destinationCard: {
        width: 200,
        height: 250,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    destinationImage: {
        width: '100%',
        height: '100%',
    },
    destinationGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    destinationContent: {
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    destinationCity: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    destinationCountry: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
}); 