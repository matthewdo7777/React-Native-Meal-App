import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useGroceryList } from "./groceryListContext";
import NavBar from "./navigationbar";

const GroceryList = () => {
  const { groceryList } = useGroceryList();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Grocery List</Text>
      <FlatList
        data={groceryList}
        renderItem={({ item }) => (
          <View style={styles.mealContainer}>
            <Text style={styles.mealName}>{item.name}</Text>

            <FlatList
              data={item.ingredients}
              renderItem={({ item: ingredient }) => (
                <Text style={styles.ingredient}>- {ingredient}</Text>
              )}
              keyExtractor={(ingredient, index) => `${item.id}-${index}`}
            />
          </View>
        )}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  mealContainer: {
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  mealName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 18,
    color: "#555",
    marginLeft: 10,
  },
});

export default GroceryList;
