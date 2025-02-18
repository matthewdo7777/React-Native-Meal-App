import React, { useState } from 'react';
import { Text, View, TextInput, ImageBackground, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import homeImage from '../assets/images/home.jpg';
import { useIDList } from './idListContext';

export default function Index() {

  const [userInput, setUserInput] = useState(''); //state variable to hold current value as user types
  const navigation = useNavigation();
  const { changeIDList } = useIDList();


  const handleSubmit = async () => {
    const inputArray = userInput.split(',').map(item => item.trim().toLowerCase());
    const queryString = inputArray.join(',');

    if (!userInput.trim()) {
      alert("Oops! You forgot to add ingredients. Enter at least one ingredient.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/food?ingredients=${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Full API Response:', data);

      if (Array.isArray(data)) {
        // Extract only the `id` values
        const ids = data.map(item => item.id);
        // console.log('Extracted IDs:', ids);

        // Convert the ID array to a string
        const idString = ids.join(','); // e.g., "256,543"
        // console.log('IDs as String:', idString);
        changeIDList(idString);
        // Navigate to allergy screen with the extracted IDs
        navigation.navigate('allergy', {all_ids: idString});

      } else {
        changeIDList('999');
        // Handle the case where no data return, {"ids": []}
        navigation.navigate('allergy', {all_ids: '999'});
      }


    } catch (error) {
      console.error('Error fetching ingredient IDs:', error);
    }
  };

  const handleClearInput = () => {
    setUserInput(''); // Clear input field
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <ImageBackground
            source={homeImage}
            style={styles.imageBackground}
          >
            <Text style={styles.headerText}>Discover recipes based on what you have</Text>

            <View style={styles.searchContainer}><TextInput
              style={styles.searchText}
              placeholder="Search ingredients"
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleSubmit}
            />
              {userInput.length > 0 && (
                <TouchableOpacity onPress={handleClearInput}>
                  <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
    marginTop: -230,
    marginBottom: 5,
    paddingHorizontal: 10
  },
  searchText: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
  },
});