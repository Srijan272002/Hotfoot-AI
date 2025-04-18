import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Search, MessageCircle } from 'lucide-react-native'

// Mock data for messages
const mockMessages = [
  {
    id: '1',
    name: 'Hotel Artemis',
    avatar: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000',
    lastMessage: 'Your reservation has been confirmed',
    time: '2m ago',
    unread: true
  },
  {
    id: '2',
    name: 'Paradise Resort',
    avatar: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000',
    lastMessage: 'Thank you for your booking',
    time: '1h ago',
    unread: true
  },
  {
    id: '3',
    name: 'Sunset Beach Hotel',
    avatar: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000',
    lastMessage: 'We look forward to your stay',
    time: '2h ago',
    unread: false
  },
  {
    id: '4',
    name: 'Mountain View Lodge',
    avatar: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000',
    lastMessage: 'Your check-in details',
    time: '1d ago',
    unread: false
  }
];

const MessageItem = ({ item }) => (
  <TouchableOpacity style={styles.messageItem}>
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    {item.unread && <View style={styles.unreadDot} />}
    <View style={styles.messageContent}>
      <View style={styles.messageHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={[styles.lastMessage, item.unread && styles.unreadText]}>
        {item.lastMessage}
      </Text>
    </View>
  </TouchableOpacity>
);

const EmptyMessages = () => (
  <View style={styles.emptyContainer}>
    <MessageCircle size={48} color="#ccc" />
    <Text style={styles.emptyTitle}>No messages yet</Text>
    <Text style={styles.emptySubtitle}>Your messages from hotels and hosts will appear here</Text>
  </View>
);

const Messages = () => {
  const [messages] = useState(mockMessages);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyMessages}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
  },
  searchButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  unreadDot: {
    position: 'absolute',
    left: 38,
    top: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF385C',
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadText: {
    color: '#000',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Messages