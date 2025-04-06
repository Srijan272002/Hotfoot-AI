import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { ArrowLeft, Plus, Minus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const TravelersModal = ({
    visible,
    onClose,
    travelers,
    onUpdate
}) => {
    const handleIncrement = (type) => {
        if (type === 'adults' && travelers.adults < 8) {
            onUpdate({ ...travelers, adults: travelers.adults + 1 });
        } else if (type === 'children' && travelers.children < 6) {
            onUpdate({ ...travelers, children: travelers.children + 1 });
        }
    };

    const handleDecrement = (type) => {
        if (type === 'adults' && travelers.adults > 1) {
            onUpdate({ ...travelers, adults: travelers.adults - 1 });
        } else if (type === 'children' && travelers.children > 0) {
            onUpdate({ ...travelers, children: travelers.children - 1 });
        }
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
                    <Text style={styles.title}>Select Travelers</Text>
                </View>

                <View style={styles.content}>
                    {/* Adults Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Adults</Text>
                            <Text style={styles.sectionSubtitle}>Ages 13 or above</Text>
                        </View>
                        <View style={styles.counter}>
                            <TouchableOpacity
                                style={[styles.button, travelers.adults <= 1 && styles.buttonDisabled]}
                                onPress={() => handleDecrement('adults')}
                                disabled={travelers.adults <= 1}
                            >
                                <Minus size={20} color={travelers.adults <= 1 ? "#ccc" : "#000"} />
                            </TouchableOpacity>
                            <Text style={styles.count}>{travelers.adults}</Text>
                            <TouchableOpacity
                                style={[styles.button, travelers.adults >= 8 && styles.buttonDisabled]}
                                onPress={() => handleIncrement('adults')}
                                disabled={travelers.adults >= 8}
                            >
                                <Plus size={20} color={travelers.adults >= 8 ? "#ccc" : "#000"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Children Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Children</Text>
                            <Text style={styles.sectionSubtitle}>Ages 0-12</Text>
                        </View>
                        <View style={styles.counter}>
                            <TouchableOpacity
                                style={[styles.button, travelers.children <= 0 && styles.buttonDisabled]}
                                onPress={() => handleDecrement('children')}
                                disabled={travelers.children <= 0}
                            >
                                <Minus size={20} color={travelers.children <= 0 ? "#ccc" : "#000"} />
                            </TouchableOpacity>
                            <Text style={styles.count}>{travelers.children}</Text>
                            <TouchableOpacity
                                style={[styles.button, travelers.children >= 6 && styles.buttonDisabled]}
                                onPress={() => handleIncrement('children')}
                                disabled={travelers.children >= 6}
                            >
                                <Plus size={20} color={travelers.children >= 6 ? "#ccc" : "#000"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
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
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    sectionHeader: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        borderColor: '#ccc',
        backgroundColor: '#F5F5F5',
    },
    count: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    doneButton: {
        margin: 16,
        backgroundColor: '#FF385C',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 