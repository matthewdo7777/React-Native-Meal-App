import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIDList } from './idListContext';

const navbar = () => {
  const navigation = useNavigation();
  const { clearIDList } = useIDList();
  const { idList } = useIDList();
  const handleHomeClick = () => {
    clearIDList();
    navigation.navigate('index');
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleHomeClick} style={styles.navItem}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('meals', { all_ids: idList })} style={styles.navItem}>
          <Text style={styles.navLink}>Meals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('groceryList')} style={styles.navItem}>
          <Text style={styles.navLink}>Grocery List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
});

export default navbar;
