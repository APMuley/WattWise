import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
    const router = useRouter();
    const [numTenants, setNumTenants] = useState(0);
    const [tenants, setTenants] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTenants = async () => {
            const response = await fetch("http://IP_ADDRESS:8000/get_bills");

            const data = await response.json();

            if (response.ok) {
                setTenants(data);
              } else {
                Alert.alert("Something went wrong");
            } 
        };

        const fetchNumTenants = async () => {
            const response = await fetch("http://192.168.31.124:8000/get_number_tenants");

            const data = await response.json();

            if (response.ok) {
                setNumTenants(data.num);
              } else {
                Alert.alert("Something went wrong");
            }
        };
        if (isFocused) {
            fetchTenants();
            fetchNumTenants();
        }
    }, [isFocused]);

    const renderTenant = ({ item }) => (
        <View style={styles.tenantItem}>
            <Text style={styles.tenantName}>{item.tenant_name}</Text>
            <Text style={styles.tenantBill}>₹{item.bill}</Text>
        </View>
    );

    return (
        <FlatList
            data={tenants}
            keyExtractor={item => item.id}
            renderItem={renderTenant}
            contentContainerStyle={styles.container}
            ListHeaderComponent={
                <View style={styles.topSection}>
                    <Text style={styles.welcomeText}>Welcome User!</Text>
                    <Text style={styles.tenantText}>Number Of Tenants: {numTenants}</Text>

                    <Pressable
                        onPress={() => router.push("addTenant")}
                        style={({ pressed }) => [
                            styles.tenantCard,
                            pressed && styles.tenantCardPressed
                        ]}
                    >
                        <Text style={styles.tenantText}>Add Tenant</Text>
                    </Pressable>

                    <Text style={styles.listHeader}>Tenants & Bills</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#f5f5f5",
    },
    topSection: {
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "black",
    },
    tenantText: {
        fontSize: 18,
        color: "#000",
        marginBottom: 20,
    },  
    tenantCard: {
        backgroundColor: "#384959",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    tenantCardPressed: {
        backgroundColor: "#2e3b46",
    },
    listHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#384959",
    },
    tenantItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#e1e8f0",
        borderRadius: 8,
        marginBottom: 10,
    },
    tenantName: {
        fontSize: 16,
        color: "#384959",
    },
    tenantBill: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#384959",
    },
});

export default Profile;
