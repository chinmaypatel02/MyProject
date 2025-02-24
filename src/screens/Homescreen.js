
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
} from 'react-native';
import images from '../utils/images';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // Mock data for dance events
  const events = [
    {
      id: '1',
      title: 'ADICTO: Berlin Festival',
      image: require('../../assets/images/event.png'),
      dateRange: '24.02.2022 - 26.02.2022',
      priceRange: '€30 - €100',
      location: 'Berlin, Germany',
      tags: ['Workshop', 'Bachata'],
      liked: true,
    },
    {
      id: '2',
      title: 'Bachata: Open level',
      image: require('../../assets/images/event.png'),                  
      date: '27.02.2022 @8pm',
      price: '€12',
      location: 'Berlin, Germany',
      tags: ['Course', 'Bachata'],
      liked: false,
    },
    {
      id: '3',
      title: 'SSD Rovinj 2022',
      image: require('../../assets/images/event.png'),
      dateRange: '07.06.2022 - 13.06.2022',
      priceRange: '€65 - €450',
      location: 'Rovinj, Croatia',
      tags: ['Festival', 'Bachata'],
      liked: false,
    },
    {
      id: '4',
      title: 'Berlin Sensual Nights',
      image: require('../../assets/images/event.png'),
      date: '29.02.2022 | 21:00 - 04:00',
      priceRange: '€30 - €100',
      location: 'Berlin, Germany',
      tags: ['Party', 'Bachata', 'Salsa', 'Kizz'],
      liked: true,
    },
    {
      id: '5',
      title: 'Salsa & Bachata Night',
      image: require('../../assets/images/event.png'),
      date: '05.03.2022 | 19:00 - 01:00',
      price: '€7',
      location: 'Berlin, Germany',
      tags: ['Course', 'Party', 'Bachata', 'Salsa'],
      liked: false,
    },
    {
      id: '6',
      title: 'Soda Social Club - Salsa, Bachata, ...',
      image: require('../../assets/images/event.png'),
      date: '06.03.2022 | 19:00 - 02:00',
      price: '€8',
      location: 'Berlin, Germany',
      tags: ['Party', 'Bachata', 'Salsa', 'Kiz'],
      liked: false,
    },
  ];

  // Render each event card
  const renderEventCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      {/* Arrow icon positioned at top right */}
      <View style={styles.arrowContainer}>
        <Image 
          source={images.arrow}
          style={styles.arrowIcon} 
        />
      </View>
      
      <View style={styles.eventCardContent}>
        <Image source={item.image} style={styles.eventImage} />
        
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
          
          {/* Date and Location in same row with proper alignment */}
          <View style={styles.dateLocationRow}>
            <Text style={styles.eventDate}>
              {item.dateRange || item.date}
            </Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
          </View>
          
          <Text style={styles.eventPrice}>
            {item.priceRange || item.price}
          </Text>
          
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
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
            <TouchableOpacity style={styles.iconButton}>
              <Image 
                source={item.liked ? images.hfill : images.hout} 
                style={[styles.heartIcon, item.liked && {tintColor: '#4CAF50'}]} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello Renzo!</Text>
          <Text style={styles.subGreeting}>Are you ready to dance?</Text>
        </View>
      </View>
      
      {/* Event List */}
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bottom Navigation Bar is commented out in your code */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
    // backgroundColor:'green'
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
    marginLeft:width*0,
    // backgroundColor:'red'
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