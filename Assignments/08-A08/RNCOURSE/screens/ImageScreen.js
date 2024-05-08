import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../constants/styles';

export default function ImageScreen() {
  const [userPhoto, setUserPhoto] = useState(null);

  const handleUserPhotoSelect = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        throw new Error('Gallery permission is required!');
      }
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (!photoSelected.cancelled && photoSelected.assets && photoSelected.assets.length > 0) {
        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      if (!imageUri) {
        throw new Error('Image URI is null or undefined');
      }
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      throw error;
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        throw new Error('Camera permission is required!');
      }
      const photoTaken = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!photoTaken.cancelled && photoTaken.assets && photoTaken.assets.length > 0) {
        setUserPhoto(photoTaken.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const uploadImage = async () => {
    if (!userPhoto) {
      Alert.alert('Error', 'Please select an image before uploading.');
      return;
    }

    const { uri, filename, type } = userPhoto;
    const base64Image = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    try {
      const uploadResponse = await axios.post('http://167.99.57.236:8084/upload_image', {
        image_base64: base64Image,
        filename,
        file_type: type,
      });

      if (uploadResponse.status === 201) {
        Alert.alert('Success', 'Image uploaded successfully to FTP server');
      } else {
        throw new Error('Failed to upload image to FTP server');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: userPhoto }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <Button title="Select from Gallery" onPress={handleUserPhotoSelect} />
        <Button title="Take Photo" onPress={handleTakePhoto} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Upload Photo" onPress={uploadImage} />
        <Button title="View Previous Photos" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  buttonStyle: {
    marginRight: 40
  }
});