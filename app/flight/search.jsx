import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FlightSearch() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Flight Search Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
    },
}); 