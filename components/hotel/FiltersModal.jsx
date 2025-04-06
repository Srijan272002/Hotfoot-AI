import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const FiltersModal = ({ visible, onClose, filters, onApplyFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const amenitiesList = [
        'Free WiFi',
        'Free Breakfast',
        'Pool',
        'Spa',
        'Fitness Center',
        'Restaurant',
        'Bar',
        'Room Service',
        'Free Parking',
        'Airport Shuttle',
    ];

    const handleAmenityToggle = (amenity) => {
        const updatedAmenities = localFilters.amenities.includes(amenity)
            ? localFilters.amenities.filter((a) => a !== amenity)
            : [...localFilters.amenities, amenity];

        setLocalFilters({
            ...localFilters,
            amenities: updatedAmenities,
        });
    };

    const handleRatingSelect = (rating) => {
        setLocalFilters({
            ...localFilters,
            rating,
        });
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const formatPrice = (price) => `$${price}`;

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
                        <Text style={styles.headerTitle}>Filters</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Price Range */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Price Range</Text>
                            <View style={styles.priceLabels}>
                                <Text style={styles.priceLabel}>
                                    {formatPrice(localFilters.priceRange[0])}
                                </Text>
                                <Text style={styles.priceLabel}>
                                    {formatPrice(localFilters.priceRange[1])}
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1000}
                                step={50}
                                values={localFilters.priceRange}
                                onValuesChange={(values) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        priceRange: values,
                                    })
                                }
                                minimumTrackTintColor="#000"
                                maximumTrackTintColor="#ddd"
                            />
                        </View>

                        {/* Rating */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Rating</Text>
                            <View style={styles.ratingButtons}>
                                {[0, 3, 4, 5].map((rating) => (
                                    <TouchableOpacity
                                        key={rating}
                                        style={[
                                            styles.ratingButton,
                                            localFilters.rating === rating &&
                                                styles.ratingButtonSelected,
                                        ]}
                                        onPress={() => handleRatingSelect(rating)}
                                    >
                                        <Text
                                            style={[
                                                styles.ratingButtonText,
                                                localFilters.rating === rating &&
                                                    styles.ratingButtonTextSelected,
                                            ]}
                                        >
                                            {rating === 0 ? 'Any' : `${rating}+`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Amenities */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Amenities</Text>
                            <View style={styles.amenitiesGrid}>
                                {amenitiesList.map((amenity) => (
                                    <TouchableOpacity
                                        key={amenity}
                                        style={[
                                            styles.amenityButton,
                                            localFilters.amenities.includes(amenity) &&
                                                styles.amenityButtonSelected,
                                        ]}
                                        onPress={() => handleAmenityToggle(amenity)}
                                    >
                                        <Text
                                            style={[
                                                styles.amenityButtonText,
                                                localFilters.amenities.includes(amenity) &&
                                                    styles.amenityButtonTextSelected,
                                            ]}
                                        >
                                            {amenity}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() =>
                                setLocalFilters({
                                    priceRange: [0, 1000],
                                    rating: 0,
                                    amenities: [],
                                })
                            }
                        >
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleApply}
                        >
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
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
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 16,
        color: '#666',
    },
    slider: {
        height: 40,
    },
    ratingButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    ratingButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    ratingButtonSelected: {
        backgroundColor: '#000',
    },
    ratingButtonText: {
        fontSize: 16,
        color: '#444',
    },
    ratingButtonTextSelected: {
        color: '#fff',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amenityButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    amenityButtonSelected: {
        backgroundColor: '#000',
    },
    amenityButtonText: {
        fontSize: 14,
        color: '#444',
    },
    amenityButtonTextSelected: {
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        gap: 12,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default FiltersModal; 