import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../../types'; // Adjust the import path as necessary
import styles from './password.style';

type PasswordRouteProp = RouteProp<RootStackParamList, 'Password'>;

export default function Password() {
    const route = useRoute<PasswordRouteProp>();
    const { fullName, date } = route.params;

    const [formData, setFormData] = useState({
        // need to create a page
        username: fullName,
        // need to create a page for both
        password: 'Test',
        confirmPassword: 'Test',
        // need to create a page
        email: 'Test@gmail.com',
        age: '',
        dob: date.toISOString().split('T')[0],
        // need to create a page
        sex: 'Test'
    });

    // calculates age
    useEffect(() => {
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let userAge = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                userAge--;
            }
            setFormData(prevState => ({ ...prevState, age: userAge.toString() }));
        }
    }, [formData.dob]);

    const handleSubmit = async () => {
        try {
            console.log('Form Data:', formData);
            const response = await fetch('https://moxy-api.azurewebsites.net/api/User/CreateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(`Failed to create user: ${response.statusText}`);
            }
            const responseData = await response.json();
            console.log('User created successfully:', responseData);
        } catch (error) {
            console.error('Error in account creation:', error);
            alert('Error creating an account. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create User</Text>
            </TouchableOpacity>
        </View>
    );
}