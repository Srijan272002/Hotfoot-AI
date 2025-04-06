import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { X } from 'lucide-react-native';
import { format, addDays } from 'date-fns';

const DateRangeModal = ({ visible, onClose, dates, setDates }) => {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        if (dates.checkIn && dates.checkOut) {
            const marked = {};
            let currentDate = new Date(dates.checkIn);
            const endDate = new Date(dates.checkOut);

            while (currentDate <= endDate) {
                const dateString = format(currentDate, 'yyyy-MM-dd');
                if (dateString === dates.checkIn) {
                    marked[dateString] = {
                        startingDay: true,
                        color: '#000',
                        textColor: '#fff'
                    };
                } else if (dateString === dates.checkOut) {
                    marked[dateString] = {
                        endingDay: true,
                        color: '#000',
                        textColor: '#fff'
                    };
                } else {
                    marked[dateString] = {
                        color: '#000',
                        textColor: '#fff'
                    };
                }
                currentDate = addDays(currentDate, 1);
            }
            setMarkedDates(marked);
        }
    }, [dates]);

    const onDayPress = (day) => {
        if (!dates.checkIn || (dates.checkIn && dates.checkOut)) {
            // Start new range
            setDates({
                checkIn: day.dateString,
                checkOut: null
            });
            setMarkedDates({
                [day.dateString]: {
                    startingDay: true,
                    color: '#000',
                    textColor: '#fff'
                }
            });
        } else {
            // Complete the range
            if (new Date(day.dateString) < new Date(dates.checkIn)) {
                setDates({
                    checkIn: day.dateString,
                    checkOut: dates.checkIn
                });
            } else {
                setDates({
                    ...dates,
                    checkOut: day.dateString
                });
            }
        }
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return 'Select date';
        return format(new Date(dateString), 'EEE, MMM d, yyyy');
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
                        <Text style={styles.headerTitle}>Select Dates</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Selected Dates Display */}
                    <View style={styles.selectedDates}>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <Text style={styles.dateValue}>
                                {formatDisplayDate(dates.checkIn)}
                            </Text>
                        </View>
                        <View style={styles.dateSeparator} />
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <Text style={styles.dateValue}>
                                {formatDisplayDate(dates.checkOut)}
                            </Text>
                        </View>
                    </View>

                    {/* Calendar */}
                    <Calendar
                        markingType={'period'}
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        minDate={format(new Date(), 'yyyy-MM-dd')}
                        theme={{
                            todayTextColor: '#000',
                            selectedDayBackgroundColor: '#000',
                            selectedDayTextColor: '#fff',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                            'stylesheet.calendar.header': {
                                monthText: {
                                    fontSize: 18,
                                    fontWeight: '600',
                                    paddingVertical: 10,
                                },
                            },
                        }}
                    />

                    {/* Done Button */}
                    <TouchableOpacity
                        style={[
                            styles.doneButton,
                            (!dates.checkIn || !dates.checkOut) && styles.doneButtonDisabled
                        ]}
                        onPress={onClose}
                        disabled={!dates.checkIn || !dates.checkOut}
                    >
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
        maxHeight: '90%',
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
    selectedDates: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
    },
    dateBox: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateSeparator: {
        width: 1,
        height: '100%',
        backgroundColor: '#ddd',
        marginHorizontal: 15,
    },
    doneButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonDisabled: {
        opacity: 0.5,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DateRangeModal; 