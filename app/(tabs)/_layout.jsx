import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';

const TabLayout = () => {
  return (
    <Tabs options={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: 'Explore',
          tabBarLabel: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  color: 'black',
                }}
              >
                Explore
              </Text>
              {focused && (
                <View
                  style={{
                    width: 7, // Dot size
                    height: 7,
                    backgroundColor: 'black',
                    borderRadius: 3.5, // Circular dot
                    marginTop: 4, // Space between label and dot
                  }}
                />
              )}
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Feather
              name="search"
              size={focused ? 28 : 22} // Zoom effect when focused
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          headerShown: false,
          title: 'Wishlists',
          tabBarLabel: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  color: 'black',
                }}
              >
                Wishlists
              </Text>
              {focused && (
                <View
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: 'black',
                    borderRadius: 3.5,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Feather
              name="heart"
              size={focused ? 28 : 22}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          headerShown: false,
          title: 'Trips',
          tabBarLabel: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  color: 'black',
                }}
              >
                Trips
              </Text>
              {focused && (
                <View
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: 'black',
                    borderRadius: 3.5,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Feather
              name="map-pin"
              size={focused ? 28 : 22}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          headerShown: false,
          title: 'Messages',
          tabBarLabel: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  color: 'black',
                }}
              >
                Messages
              </Text>
              {focused && (
                <View
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: 'black',
                    borderRadius: 3.5,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Feather
              name="message-square"
              size={focused ? 28 : 22}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarLabel: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  color: 'black',
                }}
              >
                Settings
              </Text>
              {focused && (
                <View
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: 'black',
                    borderRadius: 3.5,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Feather
              name="settings"
              size={focused ? 28 : 22}
              color="black"
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout
