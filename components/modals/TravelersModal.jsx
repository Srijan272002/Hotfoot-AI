import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Pressable
} from 'react-native';
import { Minus, Plus, X } from 'lucide-react-native';

const TravelersModal = ({ visible, onClose, travelers, setTravelers }) => {
    const updateTravelerCount = (type, increment) => {
        const newCount = increment ? travelers[type] + 1 : travelers[type] - 1;
        if (newCount < 0) return;
        if (type === 'adults' && newCount === 0) return;
        if (type === 'children' && newCount > 4) return;

        setTravelers({
            ...travelers,
            [type]: newCount
        });
    };

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
                        <Text style={styles.headerTitle}>Travelers</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Adults */}
                    <View style={styles.travelerType}>
                        <View>
                            <Text style={styles.travelerTitle}>Adults</Text>
                            <Text style={styles.travelerSubtitle}>Ages 13 or above</Text>
                        </View>
                        <View style={styles.counter}>
                            <Pressable
                                style={[styles.counterButton, travelers.adults <= 1 && styles.counterButtonDisabled]}
                                onPress={() => updateTravelerCount('adults', false)}
                                disabled={travelers.adults <= 1}
                            >
                                <Minus size={20} color={travelers.adults <= 1 ? '#ccc' : '#000'} />
                            </Pressable>
                            <Text style={styles.counterText}>{travelers.adults}</Text>
                            <Pressable
                                style={styles.counterButton}
                                onPress={() => updateTravelerCount('adults', true)}
                            >
                                <Plus size={20} color="#000" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Children */}
                    <View style={styles.travelerType}>
                        <View>
                            <Text style={styles.travelerTitle}>Children</Text>
                            <Text style={styles.travelerSubtitle}>Ages 0-12</Text>
                        </View>
                        <View style={styles.counter}>
                            <Pressable
                                style={[styles.counterButton, travelers.children <= 0 && styles.counterButtonDisabled]}
                                onPress={() => updateTravelerCount('children', false)}
                                disabled={travelers.children <= 0}
                            >
                                <Minus size={20} color={travelers.children <= 0 ? '#ccc' : '#000'} />
                            </Pressable>
                            <Text style={styles.counterText}>{travelers.children}</Text>
                            <Pressable
                                style={[styles.counterButton, travelers.children >= 4 && styles.counterButtonDisabled]}
                                onPress={() => updateTravelerCount('children', true)}
                                disabled={travelers.children >= 4}
                            >
                                <Plus size={20} color={travelers.children >= 4 ? '#ccc' : '#000'} />
                            </Pressable>
                        </View>
                    </View>

                    {/* Done Button */}
                    <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
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
    travelerType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    travelerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    travelerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButtonDisabled: {
        opacity: 0.5,
    },
    counterText: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 24,
        textAlign: 'center',
    },
    doneButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TravelersModal; 