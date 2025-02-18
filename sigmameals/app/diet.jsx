import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Octicons } from '@expo/vector-icons';


export default function Diet() {
    const navigation = useNavigation();
    const route = useRoute();
    const { all_ids, original_ids } = route.params; // ids fetched from GET /api/food?ingredients=anything

    const [selectedDiets, setSelectedDiets] = useState([]);

    const handleDietSelection = (diet) => {
        if (diet === 'None') {
            // If "None" is selected, deselect all other options
            if (selectedDiets.includes('None')) {
                setSelectedDiets([]); // Deselect all
            } else {
                setSelectedDiets(['None']); // Only select "None"
            }
        } else {
            // Deselect "None" if another diet is selected
            setSelectedDiets((prevSelected) =>
                prevSelected.includes(diet)
                    ? prevSelected.filter((item) => item !== diet) // Deselect the selected diet
                    : [...prevSelected.filter((item) => item !== 'None'), diet] // Select new diet and deselect "None"
            );
        }
    };

    const handleSubmit = async () => {

        // If no diets are selected, set dietsString to 'none'
        const dietsString = selectedDiets.length === 0 ? 'none' : selectedDiets.join(',').toLowerCase();
        const apiUrl = `http://localhost:3000/api/diets?ids=${all_ids}&diets=${dietsString}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                // Extract only the id values
                const ids = data.map(item => item.id);

                // Convert the ID array to a string
                const idString = ids.join(','); // e.g., "256,543"
                navigation.navigate('meals', { all_ids: idString });
            } else {
                // Handle the case where no data return, {"ids": []}
                navigation.navigate('meals', { all_ids: '999' });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSkip = async () => {
        const apiUrl = `http://localhost:3000/api/diets?ids=${all_ids}&diets=none`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                // Extract only the id values
                const ids = data.map(item => item.id);

                // Convert the ID array to a string
                const idString = ids.join(','); // e.g., "256,543"
                navigation.navigate('meals', { all_ids: idString });
            } else {
                // Handle the case where no data return, {"ids": []}
                navigation.navigate('meals', { all_ids: '999' });
            }

        } catch (error) {
            console.error('Error fetching data for Skip:', error);
        }
    };

    const displayDietButtons = (dietsInRow, includePlaceholder = false) => (
        <View style={styles.row}>
            {dietsInRow.map((diet) => (
                <TouchableOpacity
                    key={diet}
                    style={[
                        styles.dietButton,
                        selectedDiets.includes(diet) && styles.selectedDietButton, // Highlight selected button
                        !selectedDiets.includes(diet) && selectedDiets.includes("None") && { opacity: 0.3 }, // Grey-out only if "None" is selected
                    ]}
                    onPress={() => handleDietSelection(diet)}
                >
                    <Text
                        style={[
                            styles.dietText,
                            selectedDiets.includes(diet) && styles.selectedDietText,
                        ]}
                    >
                        {diet}
                    </Text>
                </TouchableOpacity>
            ))}
            {includePlaceholder && <View style={styles.placeholder} />}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Dots & Skip button */}
            <View style={styles.header}>
                <View style={styles.progressDots}>
                    <Octicons name="dot-fill" size={30} color="#EAEAEA" />
                    <Octicons name="dot-fill" size={30} color="#6FD151" />
                </View>
                <View style={styles.skipContainer}>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.title}>Do you follow any of these diets?</Text>
            <Text style={styles.subtitle}>To offer you the best personalized meal experience, we need to know more information about you.</Text>

            {/* Diet buttons */}
            <View style={styles.dietContainer}>
                <View style={styles.dietContainer}>
                    {/* First row */}
                    {displayDietButtons(['Gluten Free', 'Dairy Free', 'Healthy'])}

                    {/* Second row */}
                    {displayDietButtons(['Vegan', 'Vegetarian', 'High Protein'])}

                    {/* Third row */}
                    {displayDietButtons(['Low Calorie', 'Low Fat', 'Low Carb'])}

                    {/* Fourth row */}
                    {displayDietButtons(['Egg Free', 'Low Sugar', 'Nut Free'])}

                    {/* Fifth row with a placeholder */}
                    {displayDietButtons(['High Fibre', 'None'], true)}
                </View>
            </View>

            {/* Previous & next buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={() => navigation.navigate('allergy', { all_ids, original_ids})}
                >
                    <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 34,
    },
    skipContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    skipText: {
        color: '#6FD151',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 150,
        marginBottom: 22,
        paddingHorizontal: 10
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        lineHeight: 25,
        letterSpacing: 0.2,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    dietContainer: {
        flex: 1,
        paddingHorizontal: 5,
        marginTop: 10,
        alignItems: 'flex-start',
    },
    dietButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        width: '100%',
    },
    placeholder: {
        flexBasis: '30%',
        marginHorizontal: 5,
    },
    noneRow: {
        justifyContent: 'flex-start',
        marginBottom: 0,
    },
    noneButton: {
        minWidth: 'auto',
        paddingHorizontal: 20,
        marginLeft: 2,
    },

    selectedDietButton: {
        backgroundColor: '#6FD151',
        borderColor: '#6FD151',
    },
    dietText: {
        fontSize: 16,
        color: '#000',
    },
    selectedDietText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    spacer: {
        flexBasis: '30%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 50,
    },
    previousButton: {
        backgroundColor: '#EAEAEA',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    previousButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    nextButton: {
        backgroundColor: '#6FD151',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});