import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

export const DateSelection = ({ visible, onClose, onSelect, initialDates }) => {
    const [selectedDates, setSelectedDates] = useState({
        checkIn: initialDates?.startDate || null,
        checkOut: initialDates?.endDate || null
    });

    const handleDayPress = (day) => {
        const date = day.dateString;

        if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
            // Start new selection
            setSelectedDates({
                checkIn: date,
                checkOut: null
            });
        } else {
            // Selecting checkout date
            if (date <= selectedDates.checkIn) {
                // If selected date is before or equal to check-in, start new selection
                setSelectedDates({
                    checkIn: date,
                    checkOut: null
                });
            } else {
                // Set checkout date
                setSelectedDates(prev => ({
                    ...prev,
                    checkOut: date
                }));
            }
        }
    };

    const handleConfirm = () => {
        if (selectedDates.checkIn && selectedDates.checkOut) {
            onSelect({
                startDate: selectedDates.checkIn,
                endDate: selectedDates.checkOut
            });
        }
    };

    const getMarkedDates = () => {
        const markedDates = {};
        
        if (selectedDates.checkIn) {
            markedDates[selectedDates.checkIn] = {
                selected: true,
                startingDay: true,
                color: '#2196F3',
                textColor: 'white'
            };
        }

        if (selectedDates.checkOut) {
            markedDates[selectedDates.checkOut] = {
                selected: true,
                endingDay: true,
                color: '#2196F3',
                textColor: 'white'
            };

            // Mark dates in between
            if (selectedDates.checkIn) {
                let currentDate = new Date(selectedDates.checkIn);
                const endDate = new Date(selectedDates.checkOut);

                while (currentDate < endDate) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    const dateString = format(currentDate, 'yyyy-MM-dd');
                    if (dateString !== selectedDates.checkOut) {
                        markedDates[dateString] = {
                            selected: true,
                            color: '#E3F2FD',
                            textColor: '#2196F3'
                        };
                    }
                }
            }
        }

        return markedDates;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select your dates</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.datesContainer}>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <Text style={styles.dateValue}>
                                {selectedDates.checkIn 
                                    ? format(new Date(selectedDates.checkIn), 'MMM dd, yyyy')
                                    : 'Select date'}
                            </Text>
                        </View>

                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <Text style={styles.dateValue}>
                                {selectedDates.checkOut 
                                    ? format(new Date(selectedDates.checkOut), 'MMM dd, yyyy')
                                    : 'Select date'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={handleDayPress}
                            markedDates={getMarkedDates()}
                            markingType="period"
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#666',
                                selectedDayBackgroundColor: '#2196F3',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#2196F3',
                                dayTextColor: '#333',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#2196F3',
                                monthTextColor: '#333',
                                textMonthFontWeight: 'bold',
                                textDayFontSize: 14,
                                textMonthFontSize: 14,
                                textDayHeaderFontSize: 14
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
                        <Text style={styles.confirmButtonText}>Confirm Dates</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    closeButton: {
        padding: 5
    },
    datesContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 15
    },
    dateBox: {
        flex: 1
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    calendarContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        borderColor: '#eee',
        borderWidth: 1
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20
    },
    confirmButtonDisabled: {
        backgroundColor: '#B3E5FC'
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
}); 