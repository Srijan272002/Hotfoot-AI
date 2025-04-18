import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HotelCard } from './components/HotelCard';
import useHotelStore from '../store/hotelStore';

export default function HotelSearchResultsScreen() {
    const { searchResults, error } = useHotelStore();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Search Results</Text>
                    <Text style={styles.resultCount}>{searchResults.length} hotels found</Text>
                </View>

                <View style={styles.resultsContainer}>
                    {searchResults.length > 0 ? (
                        searchResults.map((hotel, index) => (
                            <HotelCard key={hotel.id || index} hotel={hotel} />
                        ))
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>
                                {error || 'No hotels found'}
                            </Text>
                            <Text style={styles.noResultsSubtext}>
                                Try adjusting your search criteria
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    resultCount: {
        fontSize: 16,
        color: '#666',
    },
    resultsContainer: {
        padding: 16,
    },
    noResultsContainer: {
        padding: 32,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#666',
    },
}); 