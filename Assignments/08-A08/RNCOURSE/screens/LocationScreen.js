import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = () => {
    const [location, setLocation] = useState(null);
    const [userLocation, setUserLocation] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState('');
    const [trigger, setTrigger] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setLocation(null);
                setUserLocation([]);
                setErrorMsg(null);
                setUsername('');
                setTrigger(false);
            };
        }, [])
    );
    
    useEffect(() => {
        axios.get('http://167.99.57.236:8084/users_with_locations')
          .then((response) => {
            setUserLocation(response.data);
          }) 
          .catch((error) => {
            Alert.alert(
              'Failed!',
              'Failed to get data.'
            );
          });
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            try {
                let currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);
            } catch (error) {
                setErrorMsg('Failed to get location: ' + error.message);
            }
        })();
    }, [trigger]);

    const handleButtonClick = () => {
        setTrigger(!trigger);
    };

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            {location ? ( // Check if location is available and map is ready
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
                    {userLocation.map((user, index) => (
                        <Marker
                            key={index} 
                            coordinate={{
                                latitude: user.lat,
                                longitude: user.lon,
                            }}
                            title={`${user.first},${user.last}`}
                        />
                    ))}
                </MapView>
            ) : (
                <Text>{text}</Text>
            )}
            <Button title="Reload Location" onPress={handleButtonClick} />
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
    map: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1
    }
});

export default LocationScreen;
