import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { handleFetchEvents } from '../redux/actions/eventActions'; // Make sure this path matches your file structure
import { handleLogout } from '../redux/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../utils/images';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { events, loading, error } = useSelector(state => state.events);
  
  // Local state
  const [likedEvents, setLikedEvents] = useState({});
  const [debugInfo, setDebugInfo] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Helper to add debug info with timestamp - memoized to prevent re-renders
  const addDebugInfo = useCallback((info) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => `${prev}\n[${timestamp}] ${info}`);
    console.log(`[DEBUG] ${info}`);
  }, []);

  // Function to fetch events data - memoized to prevent re-renders
  const fetchEventsData = useCallback(async () => {
    try {
      addDebugInfo('Fetching events...');
      const result = await handleFetchEvents(dispatch);
      
      addDebugInfo(`API call result: ${result.success ? 'Success' : 'Failed'}`);
      
      if (!result.success) {
        addDebugInfo(`Fetch failed: ${result.error}`);
      }
      
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching events:', error);
      addDebugInfo(`Exception fetching events: ${error.message}`);
      setDataFetched(true);
    }
  }, [dispatch, addDebugInfo]);

  // Check auth token and fetch events when component mounts
  useEffect(() => {
    // Only fetch data once to prevent infinite loops
    if (dataFetched) return;
    
    const checkTokenAndFetchEvents = async () => {
      try {
        // Check if token exists
        const token = await AsyncStorage.getItem('authToken');
        addDebugInfo(`Token check: ${token ? 'Found' : 'Not found'}`);
        
        if (token) {
          addDebugInfo(`Token: ${token.substring(0, 10)}...`);
          fetchEventsData();
        } else {
          addDebugInfo('No token found');
          setDataFetched(true);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        addDebugInfo(`Error checking token: ${error.message}`);
        setDataFetched(true);
      }
    };

    checkTokenAndFetchEvents();
  }, [dataFetched, fetchEventsData, addDebugInfo]);

  // Check token manually - memoized to prevent re-renders
  const checkTokenManually = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      addDebugInfo(`Manual token check: ${token || 'No token found'}`);
      Alert.alert('Token Check', token || 'No token found');
    } catch (error) {
      addDebugInfo(`Error checking token manually: ${error.message}`);
      Alert.alert('Error', `Failed to check token: ${error.message}`);
    }
  }, [addDebugInfo]);

  // Handle logout - memoized to prevent re-renders
  const handleLogoutPress = useCallback(async () => {
    try {
      addDebugInfo('Logout requested');
      await AsyncStorage.removeItem('authToken');
      await handleLogout(dispatch);
      addDebugInfo('Logout successful, navigating to Login');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      addDebugInfo(`Logout error: ${error.message}`);
      Alert.alert('Logout Error', error.message);
    }
  }, [dispatch, navigation, addDebugInfo]);

  // Toggle like status - memoized to prevent re-renders
  const toggleLike = useCallback((eventId) => {
    setLikedEvents(prevState => ({
      ...prevState,
      [eventId]: !prevState[eventId]
    }));
  }, []);

  // Show detailed debug info - memoized to prevent re-renders
  const showDetailedDebug = useCallback(() => {
    Alert.alert(
      'Debug Actions',
      'Choose a debug action:',
      [
        {
          text: 'Show Debug Log',
          onPress: () => setDebugMode(prev => !prev)
        },
        {
          text: 'Check Token',
          onPress: checkTokenManually
        },
        {
          text: 'Force Reload',
          onPress: () => {
            setDataFetched(false); // Allow refetching
            fetchEventsData();
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  }, [checkTokenManually, fetchEventsData]);

  // Render each event card - memoized to prevent re-renders
  const renderEventCard = useCallback(({ item }) => {
    // Format the event data for UI
    const eventData = {
      id: item.id?.toString() || Math.random().toString(),
      title: item.title || item.name || 'Event',
      image: item.image_url ? { uri: item.image_url } : require('../../assets/images/event.png'),
      dateRange: item.date_range || item.date || 'TBA',
      date: item.date || '',
      priceRange: item.price_range || item.price || 'TBA',
      price: item.price || '',
      location: item.location || 'TBA',
      tags: Array.isArray(item.tags) ? item.tags : 
            typeof item.tags === 'string' ? item.tags.split(',').map(tag => tag.trim()) : 
            ['Event'],
      liked: likedEvents[item.id] || false
    };

    return (
      <TouchableOpacity 
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventDetails', { event: eventData })}
      >
        {/* Arrow icon positioned at top right */}
        <View style={styles.arrowContainer}>
          <Image 
            source={images.arrow}
            style={styles.arrowIcon} 
          />
        </View>
        
        <View style={styles.eventCardContent}>
          <Image source={eventData.image} style={styles.eventImage} />
          
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={1}>{eventData.title}</Text>
            
            {/* Date and Location in same row with proper alignment */}
            <View style={styles.dateLocationRow}>
              <Text style={styles.eventDate}>
                {eventData.dateRange || eventData.date}
              </Text>
              <Text style={styles.eventLocation}>{eventData.location}</Text>
            </View>
            
            <Text style={styles.eventPrice}>
              {eventData.priceRange || eventData.price}
            </Text>
            
            <View style={styles.tagsContainer}>
              {eventData.tags.map((tag, index) => (
                <View key={index} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Action buttons in a column at right edge */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.iconButton}>
                <Image 
                  source={images.share}
                  style={styles.shareIcon} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => toggleLike(eventData.id)}
              >
                <Image 
                  source={eventData.liked ? images.hfill : images.hout} 
                  style={[styles.heartIcon, eventData.liked && {tintColor: '#4CAF50'}]} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation, toggleLike, likedEvents]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Greeting */}
      <View style={styles.header}>
        <TouchableOpacity onPress={showDetailedDebug}>
          <View>
            <Text style={styles.greeting}>Hello {user?.name || 'Dancer'}!</Text>
            <Text style={styles.subGreeting}>Are you ready to dance?</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Debug log display */}
      {debugMode && (
        <ScrollView style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Log:</Text>
          <Text style={styles.debugText}>{debugInfo || 'No debug info yet'}</Text>
          
          <Text style={styles.debugTitle}>Redux State:</Text>
          <Text style={styles.debugText}>
            Events: {Array.isArray(events) ? `${events.length} items` : typeof events}{'\n'}
            Loading: {loading ? 'true' : 'false'}{'\n'}
            Error: {error || 'none'}{'\n'}
          </Text>
          
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => setDebugMode(false)}
          >
            <Text style={styles.debugButtonText}>Hide Debug</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      
      {/* Loading indicator */}
      {loading && !debugMode && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      )}
      
      {/* Error message */}
      {error && !loading && !debugMode && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setDataFetched(false); // Allow refetching
              fetchEventsData();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Event List - Hide when debug is showing */}
      {!debugMode && !loading && events && events.length > 0 && (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.eventList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => {
            setDataFetched(false); // Allow refetching
            fetchEventsData();
          }}
        />
      )}
      
      {/* No Data State */}
      {!debugMode && !loading && (!events || events.length === 0) && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No events found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setDataFetched(false); // Allow refetching
              fetchEventsData();
            }}
          >
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.01,
  },
  greeting: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#000',
  },
  subGreeting: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: height * 0.005,
  },
  logoutButton: {
    padding: width * 0.02,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: width * 0.05,
    color: '#666',
    marginBottom: height * 0.02,
  },
  errorContainer: {
    padding: width * 0.05,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.01,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  debugContainer: {
    flex: 1,
    padding: width * 0.03,
    backgroundColor: '#f8f8f8',
  },
  debugTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginTop: height * 0.01,
    marginBottom: height * 0.005,
  },
  debugText: {
    fontSize: width * 0.035,
    fontFamily: 'monospace',
    color: '#333',
  },
  debugButton: {
    backgroundColor: '#4CAF50',
    padding: width * 0.03,
    borderRadius: width * 0.01,
    alignSelf: 'center',
    marginVertical: height * 0.02,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  eventList: {
    paddingHorizontal: width * 0.02,
    paddingBottom: height * 0.1, // Space for the bottom nav
  },
  eventCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: width * 0.03,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.02,
    overflow: 'hidden',
    position: 'relative', // For absolute positioning of the arrow
  },
  arrowContainer: {
    position: 'absolute',
    top: width * 0.03,
    right: width * 0.03,
    zIndex: 1,
  },
  arrowIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#666',
  },
  eventCardContent: {
    flexDirection: 'row',
    padding: width * 0.03,
  },
  eventImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.01,
  },
  eventInfo: {
    flex: 1,
    marginLeft: width * 0.03,
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.005,
  },
  dateLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '130%',
    marginBottom: height * 0.005,
  },
  eventDate: {
    fontSize: width * 0.035,
    color: '#4CAF50',
    flex: 1,
  },
  eventLocation: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'right',
    marginLeft: width*0,
  },
  eventPrice: {
    fontSize: width * 0.035,
    color: '#333',
  },
  actionButtonsContainer: {
    justifyContent: 'flex-end',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 'auto', // Push to bottom
  },
  iconButton: {
    padding: width * 0.01,
    marginLeft: width * 0.02,
  },
  shareIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#666',
  },
  heartIcon: {
    width: width * 0.04, // Smaller heart icon
    height: width * 0.04, // Smaller heart icon
    tintColor: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: height * 0.005,
  },
  tagPill: {
    backgroundColor: '#E0E0E0',
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.003,
    marginRight: width * 0.02,
    marginBottom: height * 0.005,
  },
  tagText: {
    fontSize: width * 0.03,
    color: '#666',
  },
});

export default HomeScreen;