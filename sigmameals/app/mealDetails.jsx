import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useGroceryList } from "./groceryListContext";

const mealDetails = () => {
  const route = useRoute();
  const { item } = route.params;

  const ingredientList = JSON.parse(item.ingredients);
  const ingredientSteps = JSON.parse(item.steps);
  const { addToGroceryList } = useGroceryList();
  // ingredientList.forEach(element => {
  //   console.log(element)
  // });

  const handlePress = () => {
    const meal = {
      id: item.id,
      name: item.name,
      ingredients: JSON.parse(item.ingredients),
    };
    // Add to grocery list
    addToGroceryList(meal);
  };

  return (
    <View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <FlatList
            scrollEnabled={false}
            ListHeaderComponent={
              <View>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.ingredientsServes}>
                  Serves: {item.serves}
                </Text>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
              </View>
            }
            data={ingredientList}
            // keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsDescription}>{item}</Text>
              </View>
            )}
          />

          <FlatList
            style={styles.stepsFlatlistContainer}
            scrollEnabled={false}
            ListHeaderComponent={
              <View>
                <Text style={styles.ingredientsTitle}>Steps</Text>
              </View>
            }
            data={ingredientSteps}
            // keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsDescription}>
                  <Text style={styles.number}>{index + 1}. </Text>
                  {item}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handlePress}>
          <Text style={styles.addButtonText}>Add to grocery list</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default mealDetails;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  ingredientsSection: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  ingredientsDescription: {
    fontSize: 18,
    padding: 1,
    marginLeft: 15,
  },
  ingredientsServes: {
    fontSize: 18,
    textAlign: "center",
    margin: 5,
    color: "grey",
  },
  ingredientsContainer: {
    flex: 1,
    margin: 2,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  number: {
    fontWeight: "bold",
  },
  stepsFlatlistContainer: {
    marginBottom: 100,
  },
  arrowPng: {
    position: "absolute", // Enables absolute positioning
    top: 0, // Aligns the component to the top
    left: 0, // Aligns the component to the left
    width: 50, // Set the width of your image
    height: 50, // Set the height of your image
  },
});
