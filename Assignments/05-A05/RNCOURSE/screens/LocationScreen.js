import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState('');
    const [modalVisible, setModalVisible] = useState(false);



    const shareLocation = async () => {
        if (location && username) {
            // Implement the API call to your backend to share the location
            // This will include the location data and the username
            console.log('Sharing location with:', username, 'Location:', location);
            // You might use fetch or axios to post this data to your server
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Your Location"
                    />
                </MapView>
            ) : (
                <Text>{text}</Text>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={{ fontSize: 24 }}>×</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.modalText}
                            placeholder="Enter friend's username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <Button
                            title="Submit"
                            onPress={() => {
                                // Here, you'd implement the function to share the location
                                // For simplicity, we're just closing the modal
                                console.log('Location shared with:', username);
                                setModalVisible(!modalVisible);
                                setUsername(''); // Resetting username input for next use
                            }}
                        />
                    </View>
                </View>
            </Modal>
            <Button title="Share Location" onPress={() => setModalVisible(true)} />
        </View>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 10, // Makes it easier to tap
        color: 'gray',
        opacity: .3,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        width: 200, // or use a fixed pixel value like 200
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        backgroundColor: '#DDDDDD',
    },

});

export default LocationScreen;
