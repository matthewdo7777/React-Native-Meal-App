import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import NavBar from "./navigationbar";
import { useIDList } from "./idListContext";
import { useRoute, useNavigation } from "@react-navigation/native";

const MealsList = () => {
  const { idList } = useIDList();
  const [dataid, setdataid] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const { all_ids } = route.params;
  const { changeIDList } = useIDList();


  const fetchMealId = async () => {
    try {

      const responseImg = await axios.get(
        `http://localhost:3000/api/results?ids=${all_ids}`
      ); //uses ids and get images
      const recipesimg = responseImg.data;

      const uniqueMeals = removeDuplicatesByName(recipesimg);

      uniqueMeals.forEach(element => {
        element.image = `${element.image}?quality=90&resize=556,505`;
      });


      setdataid(uniqueMeals);
      changeIDList(all_ids);

      console.log("Fetched Recipes");
    } catch (error) {
      console.error("Error fetching recipes");
    }
  };

  function removeDuplicatesByName(meals) {
    const seen = new Map();
    return meals.filter(meal => {
        if (seen.has(meal.name)) {
            return false;
        } else {
            seen.set(meal.name, true);
            return true;
        }
    });
}
  useEffect(() => {
    fetchMealId();
  }, []);

  if(idList == 999 || idList == []){
    return (
      <View style={styles.container}>
      <Text style={{color: 'red', fontSize: 24, fontWeight: 'bold', fontFamily: 'cursive'}}>Meals not found</Text>
      <NavBar />
    </View>
    );
  }

  else {

  return (
    <View style={styles.container}>
      <Text>Meals</Text>
      <FlatList
        data={dataid}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("mealDetails", { item })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}
      />
      <NavBar />
    </View>
  );
}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  greyBox: {
    backgroundColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  imageContainer: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    flex: 1,
    margin: 10,
  },
  image: {
    width: 400,
    height: 180,
    borderRadius: 10,
  },
});

export default MealsList;
