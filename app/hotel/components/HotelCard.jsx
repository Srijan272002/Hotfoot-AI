import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Star, MapPin, Heart } from 'lucide-react-native';
import useHotelStore from '../../store/hotelStore';

export const HotelCard = ({ hotel }) => {
    const { favoriteHotels, addToFavorites, removeFromFavorites } = useHotelStore();
    
    const {
        id,
        name,
        address,
        thumbnail,
        rating,
        reviews,
        price,
        amenities,
        propertyToken
    } = hotel;

    const isFavorite = favoriteHotels.some(h => h.id === id);

    // Format price to currency format
    const formatPrice = (priceValue) => {
        if (!priceValue) return '$0';
        if (typeof priceValue === 'string') {
            return priceValue.startsWith('$') ? priceValue : `$${priceValue}`;
        }
        return `$${priceValue}`;
    };

    const handleFavoritePress = (e) => {
        e.preventDefault(); // Prevent navigation
        if (isFavorite) {
            removeFromFavorites(id);
        } else {
            addToFavorites(hotel);
        }
    };

    return (
        <Link
            href={{
                pathname: `/hotel/${id}`,
                params: { property_token: propertyToken || id }
            }}
            asChild
        >
            <TouchableOpacity style={styles.container}>
                <Image
                    source={{ uri: thumbnail }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={handleFavoritePress}
                >
                    <Heart 
                        size={24} 
                        color={isFavorite ? '#FF385C' : '#fff'} 
                        fill={isFavorite ? '#FF385C' : 'none'}
                    />
                </TouchableOpacity>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name} numberOfLines={1}>
                            {name}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Star size={16} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.rating}>{rating}</Text>
                        </View>
                    </View>

                    <View style={styles.locationContainer}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.address} numberOfLines={1}>
                            {address}
                        </Text>
                    </View>

                    {amenities?.length > 0 && (
                        <View style={styles.amenitiesContainer}>
                            {amenities.slice(0, 3).map((amenity, index) => (
                                <View key={index} style={styles.amenityBadge}>
                                    <Text style={styles.amenityText}>
                                        {amenity}
                                    </Text>
                                </View>
                            ))}
                            {amenities.length > 3 && (
                                <Text style={styles.moreAmenities}>
                                    +{amenities.length - 3} more
                                </Text>
                            )}
                        </View>
                    )}

                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.reviews}>
                                {reviews} reviews
                            </Text>
                        </View>
                        <View style={styles.priceContainer}>
                            {price?.discounted && price?.original && (
                                <Text style={styles.originalPrice}>
                                    {formatPrice(price.original)}
                                </Text>
                            )}
                            <Text style={styles.price}>
                                {formatPrice(price?.current)}
                            </Text>
                            <Text style={styles.perNight}>
                                / night
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: 200,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
        zIndex: 1,
    },
    content: {
        padding: 12
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        marginRight: 8
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rating: {
        marginLeft: 4,
        fontWeight: '600'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    address: {
        marginLeft: 4,
        color: '#666',
        flex: 1
    },
    amenitiesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap'
    },
    amenityBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8
    },
    amenityText: {
        fontSize: 12,
        color: '#666'
    },
    moreAmenities: {
        fontSize: 12,
        color: '#666'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    reviews: {
        color: '#666',
        fontSize: 12
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    originalPrice: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'line-through',
        marginRight: 4
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF385C'
    },
    perNight: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666'
    }
}); 