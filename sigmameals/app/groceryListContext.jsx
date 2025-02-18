import React, { createContext, useState, useContext } from "react";

const GroceryListContext = createContext();

export const GroceryListProvider = ({ children }) => {
  const [groceryList, setGroceryList] = useState([]);

  const addToGroceryList = (meal) => {
    setGroceryList((oldList) => {
      const exists = oldList.some((existingMeal) => existingMeal.name === meal.name);
      if (exists) {
        console.log(`Meal "${meal.name}" is already in the grocery list.`);
        alert(`Meal "${meal.name}" is already in the grocery list.`);
        return oldList;
      } else {
        console.log(`Adding "${meal.name}" to the grocery list.`);
        alert(`Adding "${meal.name}" to the grocery list.`);
        return [...oldList, meal];
      }
    });
  };

  const removeFromGroceryList = (mealId) => {
    setGroceryList((oldList) => {
      const exists = oldList.some((existingMeal) => existingMeal.id === meal.id);
      if (exists) {
        console.log(`Deleting "${meal.name}" from the grocery list.`);
        return oldList.filter((meal) => meal.id !== mealId);
      } else {
        console.log(`Cannot remove "${meal.name}" because it does not exist in the grocery list.`);
        return oldList;
      }
    });
  };

  const clearGroceryList = () => {
    setGroceryList([]);
  };

  return (
    <GroceryListContext.Provider
      value={{ groceryList, addToGroceryList, removeFromGroceryList, clearGroceryList}}
    >
      {children}
    </GroceryListContext.Provider>
  );
};

export const useGroceryList = () => useContext(GroceryListContext);
