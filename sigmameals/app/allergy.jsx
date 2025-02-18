import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Allergy() {
    const navigation = useNavigation();

    const route = useRoute();

    let { all_ids, original_ids } = route.params; // ids fetched from GET /api/food?ingredients=anything

    const all_ids2 = all_ids;

    const [selectedAllergies, setSelectedAllergies] = useState([]);

    if (all_ids === '999'){
        all_ids = original_ids
    }

    const handleAllergySelection = (allergy) => {
        if (allergy === 'None') {
            // If "None" is selected, deselect all other options
            if (selectedAllergies.includes('None')) {
                setSelectedAllergies([]); // Deselect all
            } else {
                setSelectedAllergies(['None']); // Only select "None"
            }
        } else {
            // Deselect "None" if another diet is selected
            setSelectedAllergies((prevSelected) =>
                prevSelected.includes(allergy)
                    ? prevSelected.filter((item) => item !== allergy) // Deselect the selected diet
                    : [...prevSelected.filter((item) => item !== 'None'), allergy] // Select new diet and deselect "None"
            );
        }
    };

    const handleSubmit = async () => {

        // If no allergies are selected, set allergiesString to 'none'
        const allergiesString = selectedAllergies.length === 0 ? 'none' : selectedAllergies.join(',').toLowerCase();
        const apiUrl = `http://localhost:3000/api/allergies?ids=${all_ids}&allergies=${allergiesString}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                // Extract only the `id` values
                const ids = data.map(item => item.id);

                // Convert the ID array to a string
                const idString = ids.join(','); // e.g., "256,543"
                navigation.navigate('diet', { all_ids: idString });


            } else {
                // Handle the case where no data return, {"ids": []}
                navigation.navigate('diet', { all_ids: '999', original_ids: all_ids2 });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSkip = async () => {

        const apiUrl = `http://localhost:3000/api/allergies?ids=${all_ids}&allergies=none`;

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
                // Navigate to diet screen with the filtered IDs by allergy
                navigation.navigate('diet', { all_ids: idString });
            } else {
                // Handle the case where no data return, {"ids": []}
                navigation.navigate('diet', { all_ids: '999' });
            }

        } catch (error) {
            console.error('Error fetching data for Skip:', error);
        }
    };

    const displayAllergyButtons = (allergies) => (
        <View style={styles.row}>
            {allergies.map((allergy) => (
                <TouchableOpacity
                    key={allergy}
                    style={[
                        styles.allergyButton,
                        selectedAllergies.includes(allergy) && styles.selectedAllergyButton, // Highlight selected button
                        !selectedAllergies.includes(allergy) && selectedAllergies.includes("None") && { opacity: 0.3 }, // Grey-out only if "None" is selected
                    ]}
                    onPress={() => handleAllergySelection(allergy)}
                >
                    <Text
                        style={[
                            styles.allergyText,
                            selectedAllergies.includes(allergy) && styles.selectedAllergyText,
                        ]}
                    >
                        {allergy}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );


    return (
        <View style={styles.container}>
            {/* Dots & Skip button */}
            <View style={styles.header}>
                <View style={styles.progressDots}>
                    <Octicons name="dot-fill" size={30} color="#6FD151" />
                    <Octicons name="dot-fill" size={30} color="#EAEAEA" />
                </View>
                <View style={styles.skipContainer}>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.title}>Any ingredient allergies?</Text>
            <Text style={styles.subtitle}>To offer you the best personalized meal experience, we need to know more information about you.</Text>

            {/* Allergy buttons */}
            <View style={styles.allergyContainer}>
                {/* First row */}
                {displayAllergyButtons(['Tree Nut', 'Egg', 'Soy', 'Shellfish'])}

                {/* Second row*/}
                {displayAllergyButtons(['Peanut', 'Fish', 'Gluten', 'Dairy'])}

                {/* Third row with "None" */}
                <View style={[styles.row, styles.noneRow]}>
                    <TouchableOpacity
                        key="None"
                        style={[
                            styles.allergyButton,
                            styles.noneButton,
                            selectedAllergies.includes('None') && styles.selectedAllergyButton,
                        ]}
                        onPress={() => handleAllergySelection('None')}
                    >
                        <Text
                            style={[
                                styles.allergyText,
                                selectedAllergies.includes('None') && styles.selectedAllergyText,
                            ]}
                        >
                            None
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Previous & next buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('index', { all_ids })}
                    style={styles.previousButton}
                >
                    <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>

        </View >
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
        top: 60,
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
        marginTop: 200,
        marginBottom: 22,
        paddingHorizontal: 10
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        lineHeight: 25,
        letterSpacing: 0.2,
        marginBottom: 30,
        paddingHorizontal: 10
    },
    allergyContainer: {
        flex: 1,
        paddingHorizontal: 5,
        marginTop: 20,
        alignItems: 'flex-start',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        width: '100%',
    },
    allergyButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
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
    selectedAllergyButton: {
        backgroundColor: '#6FD151',
        borderColor: '#6FD151',
    },
    allergyText: {
        fontSize: 16,
        color: '#000',
    },
    selectedAllergyText: {
        color: '#fff',
        fontWeight: 'bold',
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
