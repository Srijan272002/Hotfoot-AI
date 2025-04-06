import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation, useRouter } from 'expo-router';
import { ChevronRight, Settings as SettingsIcon, User, Map, LogOut } from 'lucide-react-native';

const Settings = () => {
  const router = useRouter();

  const handleTravelPreferences = () => {
    router.push('/preferences/travelPreferences');
  };

  const handlePersonalInfo = () => {
    router.push('/preferences/personalTouch');
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SettingsIcon size={24} color="#000" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={handleTravelPreferences}>
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Map size={20} color="#5f65f7" />
            </View>
            <Text style={styles.menuItemText}>Travel Preferences</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInfo}>
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <User size={20} color="#5f65f7" />
            </View>
            <Text style={styles.menuItemText}>Personal Info</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  section: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4444',
    marginLeft: 12,
  },
});

export default Settings