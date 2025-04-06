import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { X, MapPin } from 'lucide-react-native';
import { SerpApiService } from '../../services/SerpApiService';

const PlaceAutocompleteModal = ({ visible, onClose, onSelectPlace }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const serpApi = new SerpApiService();
                const results = await serpApi.searchTrendingDestinations(searchQuery);
                setSuggestions(results);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSelectPlace = (place) => {
        onSelectPlace(place);
        onClose();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelectPlace(item)}
        >
            <MapPin size={20} color="#666" />
            <View style={styles.suggestionText}>
                <Text style={styles.placeName}>{item.city}</Text>
                <Text style={styles.placeDetails}>{item.country}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Search Destination</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Where are you going?"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>

                    {/* Loading Indicator */}
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#000" />
                        </View>
                    )}

                    {/* Suggestions List */}
                    <FlatList
                        data={suggestions}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.suggestionsList}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={() => (
                            !loading && searchQuery.length >= 2 && (
                                <View style={styles.noResults}>
                                    <Text style={styles.noResultsText}>
                                        No destinations found
                                    </Text>
                                </View>
                            )
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    suggestionsList: {
        flex: 1,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    suggestionText: {
        marginLeft: 12,
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        fontWeight: '600',
    },
    placeDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    noResults: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: '#666',
    },
});

export default PlaceAutocompleteModal; 