import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Users, Search } from 'lucide-react-native';
import { TRENDING_SEARCHES, TRENDING_DESTINATIONS } from '../../config/api';
import PlaceAutocompleteModal from '../modals/PlaceAutocompleteModal';
import DateRangeModal from '../modals/DateRangeModal';
import TravelersModal from '../modals/TravelersModal';

const HotelSearchPage = () => {
    const router = useRouter();
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showTravelersModal, setShowTravelersModal] = useState(false);
    const [searchParams, setSearchParams] = useState({
        destination: null,
        dates: {
            checkIn: null,
            checkOut: null,
        },
        travelers: {
            adults: 2,
            children: 0,
        },
    });

    const handleSearch = () => {
        if (searchParams.destination && searchParams.dates.checkIn && searchParams.dates.checkOut) {
            router.push({
                pathname: '/hotel/results',
                params: {
                    destination: searchParams.destination.city,
                    checkIn: searchParams.dates.checkIn,
                    checkOut: searchParams.dates.checkOut,
                    adults: searchParams.travelers.adults,
                    children: searchParams.travelers.children
                }
            });
        }
    };

    const formatTravelersText = () => {
        const { adults, children } = searchParams.travelers;
        const total = adults + children;
        return `${total} ${total === 1 ? 'guest' : 'guests'}`;
    };

    const renderSearchForm = () => (
        <View style={styles.searchForm}>
            {/* Destination */}
            <TouchableOpacity
                style={styles.inputButton}
                onPress={() => setShowPlaceModal(true)}
            >
                <MapPin size={20} color="#666" />
                <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Where</Text>
                    <Text style={styles.inputValue}>
                        {searchParams.destination?.city || 'Select destination'}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Dates */}
            <TouchableOpacity
                style={styles.inputButton}
                onPress={() => setShowDateModal(true)}
            >
                <Calendar size={20} color="#666" />
                <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>When</Text>
                    <Text style={styles.inputValue}>
                        {searchParams.dates.checkIn
                            ? `${searchParams.dates.checkIn} - ${searchParams.dates.checkOut}`
                            : 'Select dates'}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Travelers */}
            <TouchableOpacity
                style={styles.inputButton}
                onPress={() => setShowTravelersModal(true)}
            >
                <Users size={20} color="#666" />
                <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Who</Text>
                    <Text style={styles.inputValue}>{formatTravelersText()}</Text>
                </View>
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity
                style={[
                    styles.searchButton,
                    (!searchParams.destination ||
                        !searchParams.dates.checkIn ||
                        !searchParams.dates.checkOut) &&
                        styles.searchButtonDisabled,
                ]}
                onPress={handleSearch}
                disabled={
                    !searchParams.destination ||
                    !searchParams.dates.checkIn ||
                    !searchParams.dates.checkOut
                }
            >
                <Search size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );

    const renderTrendingSearches = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Searches</Text>
            <FlatList
                data={TRENDING_SEARCHES}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.trendingItem}
                        onPress={() =>
                            setSearchParams({
                                ...searchParams,
                                destination: {
                                    city: item.title,
                                    country: item.type,
                                },
                            })
                        }
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={styles.trendingImage}
                        />
                        <View style={styles.trendingContent}>
                            <Text style={styles.trendingTitle}>{item.title}</Text>
                            <Text style={styles.trendingSubtitle}>{item.type}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.trendingList}
            />
        </View>
    );

    const renderTrendingDestinations = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <FlatList
                data={TRENDING_DESTINATIONS}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.destinationItem}
                        onPress={() =>
                            setSearchParams({
                                ...searchParams,
                                destination: {
                                    city: item.city,
                                    country: item.country,
                                },
                            })
                        }
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={styles.destinationImage}
                        />
                        <View style={styles.destinationContent}>
                            <Text style={styles.destinationCity}>{item.city}</Text>
                            <Text style={styles.destinationCountry}>
                                {item.country}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.destinationList}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderSearchForm()}
                {renderTrendingSearches()}
                {renderTrendingDestinations()}
            </ScrollView>

            <PlaceAutocompleteModal
                visible={showPlaceModal}
                onClose={() => setShowPlaceModal(false)}
                onSelectPlace={(place) => {
                    setSearchParams({
                        ...searchParams,
                        destination: place,
                    });
                    setShowPlaceModal(false);
                }}
            />

            <DateRangeModal
                visible={showDateModal}
                onClose={() => setShowDateModal(false)}
                dates={searchParams.dates}
                setDates={(dates) => {
                    setSearchParams({
                        ...searchParams,
                        dates,
                    });
                }}
            />

            <TravelersModal
                visible={showTravelersModal}
                onClose={() => setShowTravelersModal(false)}
                travelers={searchParams.travelers}
                setTravelers={(travelers) => {
                    setSearchParams({
                        ...searchParams,
                        travelers,
                    });
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchForm: {
        padding: 16,
        gap: 12,
    },
    inputButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        gap: 12,
    },
    inputContent: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    inputValue: {
        fontSize: 16,
        color: '#000',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
    },
    searchButtonDisabled: {
        opacity: 0.5,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    trendingList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    trendingItem: {
        width: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    trendingImage: {
        width: '100%',
        height: 120,
    },
    trendingContent: {
        padding: 12,
    },
    trendingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    trendingSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    destinationList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    destinationItem: {
        width: 160,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    destinationImage: {
        width: '100%',
        height: 200,
    },
    destinationContent: {
        padding: 12,
    },
    destinationCity: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    destinationCountry: {
        fontSize: 14,
        color: '#666',
    },
});

export default HotelSearchPage; 