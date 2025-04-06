import React from 'react';
import { View, StyleSheet } from 'react-native';
import TripSearch from '../components/tripSearch/tripSearch';

export default function Home() {
    return (
        <View style={styles.container}>
            <TripSearch />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
}); 