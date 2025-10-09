import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

// details page so user can take a picture and 
// make a request to server to store photo get bill etc.
export default function TenantDetail() {

  const { tenant_id } = useLocalSearchParams();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [reading, setReading] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // immediately fetches tenant details when page is rendered
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch(`http://IP_ADDRESS:8000/get_tenant/${tenant_id}`);

        if (!response.ok) {
          console.log("couldn't fetch tenant properly")
        }

        const data = await response.json();
        setTenant(data);

      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchTenant();
  }, [])


  // handling taking pictures and saving them to gallery
  const takePicture = async () => {
    // request permission for camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission Required",
        "Camera access is required to take photos."
      );
      return;
    }

    // launching camera using launch camera async
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);

      getReading(uri);
    }
  };

  // get the reading by giving photo to server
  const getReading = async (uri) => {
    // make a form to append the image to and send to server
    let formData = new FormData();

    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "reading.jpg"
    })

    try {
      const response = await fetch('http://IP_ADDRESS:8000/read_image',
        {
          method: 'POST',
          body: formData
        });

      // set reading equal to result from request
      const result = await response.json();
      console.log(result.reading.toString());
      setReading(result.reading.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  // submit photo, reading and date to serve to be saved
  const handleSubmit = async () => {
    // make form to submit all data to server
    let formData = new FormData();

    formData.append("image", {
      uri: photo, 
      type: "image/jpeg",
      name: "reading.jpg"
    })

    formData.append("tenant_id", tenant.tenant_id.toString());
    formData.append("reading_date", date);
    formData.append("reading", reading.toString());

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    

    try {
      const response = await fetch("http://IP_ADDRESS:8000/create_reading",
      {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log(result.result.toString());
      
    } catch (error) {
      console.log(error.message);
    }
  };

  // let the tenant details be fetched first
  if (loading) return <Text>Loading tenant...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss} accessible={false}>
    <View style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* tenant name */}
      <Text style={styles.title}>{tenant.tenant_name}</Text>

      {/* button for taking picture */}
      <View style={styles.buttonContainer}>
        <Button title="Take A Reading" onPress={takePicture} />
      </View>

      {/* display taken picture */}
      {photo && (
        <Image
          source={{ uri: photo }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {/* reading extracted from image */}
      <TextInput
        style={styles.readingInput}
        value={reading}         
        selectTextOnFocus={false} 
        placeholder="reading"
        onChangeText={text => setReading(text)} 
        keyboardType="numeric"
        returnKeyType="done"
        blurOnSubmit={true}
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      {/* set date to today */}
      <TextInput
        style={styles.dateInput}
        placeholder="date"
        value={date}
        editable={false}          
        selectTextOnFocus={false}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    alignSelf: 'center',
    width: '60%',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#e0e0e0',
  },
  readingInput: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateInput: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#88bdf2',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6a89a7',
    alignItems: 'center',
    shadowColor: '#384959',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

});