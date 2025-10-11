import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const AddTenants = () => {
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        if (name.trim() === "") {
            Alert.alert("Error", "Please enter a tenant name");
            return;
        }


        try {
            const response = await fetch("http://IP_ADDRESS:8000/create_tenant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tenant_name: name }),
            });

            if (response.ok) {
                Alert.alert("Success", `Added tenant successfully!`);
                router.back();
              } else {
                Alert.alert("Error", data.detail || "Something went wrong");
            } 
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tenant Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={text => setName(text)}
                placeholder="Enter tenant name"
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#384959",
    },
    input: {
        height: 50,
        borderColor: "#384959",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "white",
        color: "#384959",
    },
    button: {
        backgroundColor: "#384959",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#bdddfc",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddTenants;
