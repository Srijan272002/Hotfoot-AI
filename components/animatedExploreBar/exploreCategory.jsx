import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import {
    Mic,
    Search,
    X,
    Sparkles,
    Plane,
    Hotel,
    Castle,
    Palmtree,
    MapPin,
    Compass,
    Utensils,
    Heart,
    ArrowLeft
} from 'lucide-react-native';
import TripSearchPage from '../tripSearch/tripSearch';
import modalVisibility from '../modalVisiblity/modalvisiblity';
import * as Haptics from 'expo-haptics';
import { SearchModal } from './SearchModal';
import { useRouter } from 'expo-router';

// Create an AnimatedLinearGradient component
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ExploreCategory = ({
    onCategorySelect,
    //   selectedCategory,
    //   style
}) => {
    const handleCategorySelect = (category) => {
        if (onCategorySelect) {
            onCategorySelect(category);
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');
    const router = useRouter();

    const handlePress = (tabName) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (tabName === 'Hotels') {
            router.push('/hotel');
        } else {
            setSelectedTab(tabName);
            setModalVisible(true);
        }
    };

    const categories = [
        {
            tab: 'Experiences',
            label: 'Experiences',
            description: 'Unforgettable moments',
            icon: Sparkles,
        },
        {
            tab: 'Flights',
            label: 'Flights',
            description: 'Find the best deals',
            icon: Plane,
        },
        {
            tab: 'Hotels',
            label: 'Hotels',
            description: 'Luxury to budget stays',
            icon: Hotel,
        }
    ];

    return (
        <View style={[styles.categoriesContainer]}>
            {categories.map((category, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.categoryButton}
                    onPress={() => handlePress(category.tab)}
                >
                    <View style={styles.iconContainer}>
                        {category.icon && <category.icon size={22} color="#000000" strokeWidth={2} />}
                    </View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
            ))}

            <SearchModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                tabName={selectedTab} />
        </View>
    );
};

const styles = StyleSheet.create({
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    categoryButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 4,
        textAlign: 'center',
    },
    categoryDescription: {
        fontSize: 11,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 14,
    },
});

export default ExploreCategory;