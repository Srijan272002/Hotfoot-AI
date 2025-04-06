import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HotelCard = ({ hotel, onPress }) => {
    const {
        title,
        thumbnail,
        rating,
        reviews_count,
        price,
        location,
        amenities = [],
        distance,
    } = hotel;

    const renderRating = () => {
        if (!rating) return null;
        return (
            <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{rating}</Text>
                {reviews_count && (
                    <Text style={styles.reviewsText}>
                        ({reviews_count} reviews)
                    </Text>
                )}
            </View>
        );
    };

    const renderAmenities = () => {
        if (!amenities.length) return null;
        return (
            <View style={styles.amenitiesContainer}>
                {amenities.slice(0, 3).map((amenity, index) => (
                    <View key={index} style={styles.amenityTag}>
                        <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                ))}
                {amenities.length > 3 && (
                    <View style={styles.amenityTag}>
                        <Text style={styles.amenityText}>+{amenities.length - 3}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(hotel)}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: thumbnail }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'transparent']}
                    style={styles.gradient}
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                    {renderRating()}
                </View>

                <View style={styles.locationContainer}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {location}
                        {distance && ` • ${distance}`}
                    </Text>
                </View>

                {renderAmenities()}

                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>
                        ${price}
                        <Text style={styles.priceSubtext}> /night</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: width - 32,
    },
    imageContainer: {
        height: 200,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    contentContainer: {
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    reviewsText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        flex: 1,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
        gap: 8,
    },
    amenityTag: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    amenityText: {
        fontSize: 12,
        color: '#666',
    },
    priceContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    priceText: {
        fontSize: 20,
        fontWeight: '600',
    },
    priceSubtext: {
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
    },
});

export default HotelCard; 