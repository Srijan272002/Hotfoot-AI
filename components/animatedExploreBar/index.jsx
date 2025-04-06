import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Text,
    Image,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchModal } from './SearchModal';
import * as Haptics from 'expo-haptics';
import {

    Search,

    Sparkles,

    MapPin,

    Heart,
    ArrowLeft
} from 'lucide-react-native';
import ExploreCategory from './exploreCategory';
import TripSearchPage from '../tripSearch/tripSearch';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnimatedExploreBar() {
    const inputRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setModalVisible(true);
    };

    const unsplashImages = {
        maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000',
        bali: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1000',
        rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000',
        greece: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000',
        kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000',
        santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000',
        tulum: 'https://images.unsplash.com/photo-1682553264347-fcb536655475?q=80&w=1000',
    };




    return (
        <>
            <TouchableOpacity
                style={styles.searchContainer}
                onPress={handlePress}
                activeOpacity={0.9}
            >
                <View style={styles.inputRow}>
                    <LinearGradient
                        colors={['#5f65f7', '#6f75f8']}
                        style={styles.searchIconContainer}
                    >
                        <Search size={22} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.input}>
                        <TextInput
                            ref={inputRef}
                            style={styles.inputText}
                            placeholder="✨ Plan your trip with AI"
                            placeholderTextColor="#8f8f8f"
                            editable={false}
                            pointerEvents="none"
                        />
                    </View>
                </View>
            </TouchableOpacity>

            <SearchModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                tabName='Places' />
        </>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        width: SCREEN_WIDTH * 0.92,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
        borderColor: "#f0f0f0",
        borderWidth: 1,
        alignSelf: 'center',
        marginHorizontal: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 50,
    },
    searchIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '400',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
    },
   
});