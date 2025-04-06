import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { Star, MapPin, ChevronLeft, ChevronRight, Wifi, Coffee, Car, Utensils } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HotelDetails = ({ hotel, onClose }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const {
        title,
        images = [],
        rating,
        reviews_count,
        price,
        location,
        amenities = [],
        description,
        reviews = [],
        distance,
    } = hotel;

    const renderImageGallery = () => (
        <View style={styles.galleryContainer}>
            <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                    setActiveImageIndex(newIndex);
                }}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={styles.galleryImage}
                        resizeMode="cover"
                    />
                )}
                keyExtractor={(_, index) => index.toString()}
            />
            <View style={styles.galleryPagination}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeImageIndex && styles.paginationDotActive,
                        ]}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const renderAmenityIcon = (amenity) => {
        const amenityMap = {
            'Free WiFi': <Wifi size={20} color="#666" />,
            'Free Breakfast': <Coffee size={20} color="#666" />,
            'Free Parking': <Car size={20} color="#666" />,
            'Restaurant': <Utensils size={20} color="#666" />,
        };
        return amenityMap[amenity] || null;
    };

    const renderAmenities = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                        {renderAmenityIcon(amenity)}
                        <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderReviews = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                        <View style={styles.reviewUser}>
                            <Text style={styles.reviewName}>{review.user}</Text>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                        <View style={styles.reviewRating}>
                            <Star size={16} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.reviewRatingText}>{review.rating}</Text>
                        </View>
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderImageGallery()}

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.ratingContainer}>
                            <Star size={20} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.ratingText}>{rating}</Text>
                            <Text style={styles.reviewsCount}>
                                ({reviews_count} reviews)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.locationContainer}>
                        <MapPin size={20} color="#666" />
                        <Text style={styles.locationText}>
                            {location}
                            {distance && ` • ${distance}`}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{description}</Text>
                    </View>

                    {renderAmenities()}
                    {renderReviews()}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price per night</Text>
                    <Text style={styles.priceText}>
                        ${price}
                    </Text>
                </View>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    galleryContainer: {
        height: 300,
        position: 'relative',
    },
    galleryImage: {
        width,
        height: 300,
    },
    galleryPagination: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 4,
    },
    reviewsCount: {
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    amenityItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    amenityText: {
        fontSize: 16,
        color: '#444',
        marginLeft: 8,
    },
    reviewItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewUser: {
        flex: 1,
    },
    reviewName: {
        fontSize: 16,
        fontWeight: '600',
    },
    reviewDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewRatingText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceText: {
        fontSize: 24,
        fontWeight: '600',
    },
    bookButton: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 16,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HotelDetails; 