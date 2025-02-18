import { Stack } from "expo-router";
import { GroceryListProvider } from './groceryListContext';
import { IDListProvider } from './idListContext';
export default function RootLayout() {
  return (
    <GroceryListProvider>
      <IDListProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="allergy" options={{ headerShown: false }} />
        <Stack.Screen name="diet" options={{ headerShown: false }} />
        <Stack.Screen name="meals" options={{ headerShown: false }} />
        <Stack.Screen name="mealDetails" options={{ headerShown: true, headerTitle: "" }} />
        <Stack.Screen name="groceryList" options={{ headerShown: true, headerTitle: "" }} />
        </Stack>
      </IDListProvider>
    </GroceryListProvider>
  );
}
