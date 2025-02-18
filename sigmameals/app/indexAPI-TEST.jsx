import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";

const App = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("localhost:3000/api/recipes");
      if (response.ok) {
        setStatus("API is working!");
      } else {
        setStatus(`Error: ${response.status}`);
      }
    } catch (error) {
      setStatus("API request failed: " + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>{status}</Text>
      )}
      <Button title="Retry" onPress={checkAPI} />
    </View>
  );
};

export default App;
