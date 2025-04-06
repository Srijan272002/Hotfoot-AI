import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, isValid, parse } from 'date-fns';

// Utility functions for date handling
const formatDisplayDate = (dateString) => {
    try {
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Select date';
    } catch (error) {
        console.warn('Invalid date format:', error);
        return 'Select date';
    }
};

const isValidDateString = (dateString) => {
    if (!dateString) return false;
    try {
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        return isValid(date);
    } catch {
        return false;
    }
};

export const DatePickerModal = ({
    visible,
    onClose,
    onSelect,
    initialCheckIn,
    initialCheckOut
}) => {
    const [selectedDates, setSelectedDates] = useState({
        checkIn: isValidDateString(initialCheckIn) ? initialCheckIn : null,
        checkOut: isValidDateString(initialCheckOut) ? initialCheckOut : null
    });

    // Reset dates when modal opens if no initial dates
    useEffect(() => {
        if (visible && !initialCheckIn && !initialCheckOut) {
            setSelectedDates({
                checkIn: null,
                checkOut: null
            });
        }
    }, [visible]);

    const handleDayPress = (type, day) => {
        const date = day.dateString;
        
        if (!isValidDateString(date)) {
            console.warn('Invalid date selected');
            return;
        }

        if (type === 'checkIn') {
            setSelectedDates(prev => ({
                checkIn: date,
                checkOut: prev.checkOut && date >= prev.checkOut ? null : prev.checkOut
            }));
        } else if (type === 'checkOut') {
            if (date <= selectedDates.checkIn) {
                return; // Cannot select checkout date before checkin
            }
            setSelectedDates(prev => ({
                ...prev,
                checkOut: date
            }));
        }
    };

    const handleConfirm = () => {
        if (selectedDates.checkIn && selectedDates.checkOut) {
            try {
                if (!isValidDateString(selectedDates.checkIn) || !isValidDateString(selectedDates.checkOut)) {
                    console.warn('Invalid dates for confirmation');
                    return;
                }
                
                onSelect({
                    startDate: selectedDates.checkIn,
                    endDate: selectedDates.checkOut
                });
                onClose();
            } catch (error) {
                console.warn('Error confirming dates:', error);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <ScrollView style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Dates</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Check-in Section */}
                    <View style={styles.calendarSection}>
                        <Text style={styles.sectionTitle}>Select Check-in Date</Text>
                        <Text style={styles.dateDisplay}>
                            {selectedDates.checkIn 
                                ? formatDisplayDate(selectedDates.checkIn)
                                : 'Select check-in date'}
                        </Text>
                        <Calendar
                            onDayPress={(day) => handleDayPress('checkIn', day)}
                            markedDates={{
                                [selectedDates.checkIn]: {
                                    selected: true,
                                    color: '#FF385C',
                                    textColor: 'white'
                                }
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                                todayTextColor: '#FF385C',
                                todayBackgroundColor: '#FFE1E7',
                                selectedDayBackgroundColor: '#FF385C',
                                selectedDayTextColor: 'white'
                            }}
                        />
                    </View>

                    {/* Check-out Section */}
                    <View style={styles.calendarSection}>
                        <Text style={styles.sectionTitle}>Select Check-out Date</Text>
                        <Text style={styles.dateDisplay}>
                            {selectedDates.checkOut 
                                ? formatDisplayDate(selectedDates.checkOut)
                                : 'Select check-out date'}
                        </Text>
                        <Calendar
                            onDayPress={(day) => handleDayPress('checkOut', day)}
                            markedDates={{
                                [selectedDates.checkOut]: {
                                    selected: true,
                                    color: '#FF385C',
                                    textColor: 'white'
                                }
                            }}
                            minDate={selectedDates.checkIn || new Date().toISOString().split('T')[0]}
                            theme={{
                                todayTextColor: '#FF385C',
                                todayBackgroundColor: '#FFE1E7',
                                selectedDayBackgroundColor: '#FF385C',
                                selectedDayTextColor: 'white'
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            (!selectedDates.checkIn || !selectedDates.checkOut) && styles.confirmButtonDisabled
                        ]}
                        onPress={handleConfirm}
                        disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                    >
                        <Text style={styles.confirmButtonText}>
                            {!selectedDates.checkIn 
                                ? 'Select check-in date' 
                                : !selectedDates.checkOut 
                                    ? 'Select check-out date' 
                                    : 'Confirm Dates'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '90%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    title: {
        fontSize: 20,
        fontWeight: '600'
    },
    closeButton: {
        fontSize: 16,
        color: '#666'
    },
    calendarSection: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333'
    },
    dateDisplay: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12
    },
    confirmButton: {
        backgroundColor: '#FF385C',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32
    },
    confirmButtonDisabled: {
        backgroundColor: '#FFB3C0'
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
}); 