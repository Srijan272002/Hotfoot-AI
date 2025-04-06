import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { getHotelDetails } from './api/serpApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, MapPin, Wifi, Pool, Dumbbell, UtensilsCrossed, Spa, Car, BellRing, Wind, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const amenityIcons = {
    'Wi-Fi': Wifi,
    'Swimming Pool': Pool,
    'Gym': Dumbbell,
    'Restaurant': UtensilsCrossed,
    'Spa': Spa,
    'Parking': Car,
    'Room Service': BellRing,
    'Air Conditioning': Wind
};

export default function HotelDetailsScreen() {
    const { property_token } = useLocalSearchParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [expandedDescription, setExpandedDescription] = useState(false);

    useEffect(() => {
        fetchHotelDetails();
    }, [property_token]);

    const fetchHotelDetails = async () => {
        try {
            const data = await getHotelDetails({
                propertyToken: property_token,
                apiKey: process.env.EXPO_PUBLIC_SERP_API_KEY
            });
            setHotel(data);
        } catch (error) {
            console.error('Error fetching hotel details:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderAmenity = ({ item }) => {
        const IconComponent = amenityIcons[item] || Wifi;
        return (
            <View style={styles.amenityItem}>
                <IconComponent size={24} color="#333" />
                <Text style={styles.amenityText}>{item}</Text>
            </View>
        );
    };

    const renderReview = ({ item }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: item.avatar }} style={styles.reviewerAvatar} />
                <View>
                    <Text style={styles.reviewerName}>{item.name}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.reviewRating}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
            <Text style={styles.reviewText}>{item.comment}</Text>
        </View>
    );

    if (loading || !hotel) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
            >
                <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>

            <ScrollView>
                {/* Image Gallery */}
                <View style={styles.imageGallery}>
                    {hotel.images && hotel.images.length > 0 ? (
                        <>
                            <Image 
                                source={{ uri: hotel.images[currentImageIndex]?.original_image }}
                                style={styles.mainImage}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                style={styles.imageGradient}
                            />
                            <TouchableOpacity 
                                style={styles.viewAllPhotos}
                                onPress={() => setShowGallery(true)}
                            >
                                <Text style={styles.viewAllPhotosText}>
                                    View all photos
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={[styles.mainImage, styles.noImageContainer]}>
                            <Text style={styles.noImageText}>No images available</Text>
                        </View>
                    )}
                </View>

                {/* Hotel Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <View style={styles.locationContainer}>
                        <MapPin size={16} color="#666" />
                        <Text style={styles.location}>{hotel.address || 'Location information not available'}</Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingScore}>{hotel.overall_rating || 'N/A'}</Text>
                        </View>
                        <Text style={styles.reviewCount}>
                            ({hotel.reviews || 0} reviews)
                        </Text>
                    </View>

                    {/* Description */}
                    {hotel.description && (
                        <View style={styles.descriptionContainer}>
                            <Text 
                                style={styles.description}
                                numberOfLines={expandedDescription ? undefined : 3}
                            >
                                {hotel.description}
                            </Text>
                            <TouchableOpacity onPress={() => setExpandedDescription(!expandedDescription)}>
                                <Text style={styles.readMore}>
                                    {expandedDescription ? 'Read less' : 'Read more'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <View style={styles.amenitiesContainer}>
                            <Text style={styles.sectionTitle}>Amenities</Text>
                            <View style={styles.amenitiesGrid}>
                                {hotel.amenities.map((amenity, index) => {
                                    const IconComponent = amenityIcons[amenity] || Wifi;
                                    return (
                                        <View key={index} style={styles.amenityItem}>
                                            <IconComponent size={24} color="#333" />
                                            <Text style={styles.amenityText}>{amenity}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Price Info */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.sectionTitle}>Price Information</Text>
                        <Text style={styles.price}>
                            {hotel.rate_per_night?.lowest || '$0'}
                            <Text style={styles.perNight}> / night</Text>
                        </Text>
                        {hotel.deal_description && (
                            <Text style={styles.dealDescription}>
                                {hotel.deal_description}
                            </Text>
                        )}
                    </View>

                    {/* Location Features */}
                    {hotel.nearby_places && hotel.nearby_places.length > 0 && (
                        <View style={styles.locationFeaturesContainer}>
                            <Text style={styles.sectionTitle}>Nearby Places</Text>
                            {hotel.nearby_places.map((place, index) => (
                                <View key={index} style={styles.nearbyPlace}>
                                    <Text style={styles.placeName}>{place.name}</Text>
                                    {place.distance && (
                                        <Text style={styles.distanceText}>Distance: {place.distance}</Text>
                                    )}
                                    {place.transportations?.map((transport, idx) => (
                                        <Text key={idx} style={styles.transportInfo}>
                                            {transport.type} - {transport.duration}
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Book Now Button */}
            <View style={styles.bookingContainer}>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>

            {/* Gallery Modal */}
            <Modal
                visible={showGallery}
                animationType="slide"
                onRequestClose={() => setShowGallery(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setShowGallery(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    {hotel.images && hotel.images.length > 0 ? (
                        <FlatList
                            data={hotel.images}
                            renderItem={({ item }) => (
                                <Image 
                                    source={{ uri: item.original_image }}
                                    style={styles.galleryImage}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <View style={styles.noImagesContainer}>
                            <Text>No images available</Text>
                        </View>
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageGallery: {
        height: 300,
        position: 'relative'
    },
    mainImage: {
        width: '100%',
        height: '100%'
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%'
    },
    viewAllPhotos: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20
    },
    viewAllPhotosText: {
        color: '#333',
        fontWeight: '600'
    },
    infoContainer: {
        padding: 16
    },
    hotelName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    location: {
        marginLeft: 8,
        color: '#666',
        flex: 1
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    ratingBadge: {
        backgroundColor: '#FF385C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8
    },
    ratingScore: {
        color: 'white',
        fontWeight: '600'
    },
    reviewCount: {
        color: '#666'
    },
    descriptionContainer: {
        marginBottom: 24
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333'
    },
    readMore: {
        color: '#FF385C',
        marginTop: 8,
        fontWeight: '600'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16
    },
    amenitiesContainer: {
        marginBottom: 24,
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 12,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -8,
    },
    amenityItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    amenityText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#333',
    },
    priceContainer: {
        marginBottom: 24
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF385C'
    },
    perNight: {
        fontSize: 16,
        color: '#666'
    },
    dealDescription: {
        color: '#FF385C',
        marginTop: 8
    },
    locationFeaturesContainer: {
        marginBottom: 100
    },
    nearbyPlace: {
        marginBottom: 16
    },
    placeName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    transportInfo: {
        color: '#666'
    },
    bookingContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    bookButton: {
        backgroundColor: '#FF385C',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    closeButton: {
        padding: 16
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16
    },
    galleryImage: {
        width: width,
        height: width,
        marginBottom: 2
    },
    noImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    noImageText: {
        fontSize: 16,
        color: '#666',
    },
    noImagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
}); 