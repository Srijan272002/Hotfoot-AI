import { View } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      { <Redirect href="/(tabs)/home" /> }
      {/* <Redirect href="/home" /> */}
    </View>
  );
}