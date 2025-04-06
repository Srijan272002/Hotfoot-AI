import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PlaceAutocomplete = ({
    visible,
    onClose,
    onSelect,
    onSearch,
    suggestions,
    loading,
    error
}) => {
    const [searchText, setSearchText] = useState('');
    const [localError, setLocalError] = useState(null);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setSearchText('');
            setLocalError(null);
        }
    }, [visible]);

    // Handle external errors
    useEffect(() => {
        if (error) {
            setLocalError(error);
        }
    }, [error]);

    const handleTextChange = (text) => {
        setSearchText(text);
        setLocalError(null);
        
        if (text.length >= 2) {
            onSearch(text);
        }
    };

    const handleSelectItem = (item) => {
        onSelect(item);
        setSearchText('');
        setLocalError(null);
        onClose();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelectItem(item)}
        >
            <View style={styles.suggestionContent}>
                <View style={[styles.locationImage, styles.placeholderImage]}>
                    <Search size={24} color="#666" />
                </View>
                <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{item.name}</Text>
                    {item.description && (
                        <Text style={styles.locationAddress} numberOfLines={1}>
                            {item.description}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => {
        if (loading) return null;
        
        if (localError) {
            return (
                <View style={styles.emptyContainer}>
                    <AlertCircle size={24} color="#FF385C" />
                    <Text style={styles.errorText}>{localError}</Text>
                </View>
            );
        }

        if (searchText.length < 2) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Type at least 2 characters to search</Text>
                </View>
            );
        }

        if (!suggestions || suggestions.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No destinations found</Text>
                </View>
            );
        }

        return null;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Select Destination</Text>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Search size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for a city"
                            value={searchText}
                            onChangeText={handleTextChange}
                            autoFocus
                            clearButtonMode="while-editing"
                        />
                        {loading && (
                            <ActivityIndicator 
                                size="small" 
                                color="#FF385C"
                                style={styles.loader}
                            />
                        )}
                    </View>
                </View>

                <FlatList
                    data={suggestions}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    style={styles.suggestionsList}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={renderEmptyComponent}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    searchContainer: {
        padding: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    loader: {
        marginLeft: 8,
    },
    suggestionsList: {
        flex: 1,
    },
    suggestionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    suggestionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderImage: {
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 14,
        color: '#666',
    },
    typeBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    typeText: {
        fontSize: 12,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF385C',
        textAlign: 'center',
        marginTop: 8,
    },
}); 