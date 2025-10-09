import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

// fetches list of all tenants and displays them
// lets user click on them to pull up their details
const Tenants = () => {
    const [tenants, setTenants] = useState([]);

    const router = useRouter();

    // Get all the tenants to load on the page first
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await fetch('http://192.168.31.124:8000/get_tenants');

                if (!response.ok) {
                    alert("hey error!");
                }

                const data = await response.json();
                setTenants(data);
            } catch (error) {
                console.log(error.message);
            }
        }

        fetchTenants();
    }, [])

    return (
        <ScrollView
            style={styles.container}
        >
            {tenants.map((t) => (
                <Pressable
                    key={t.tenant_id}
                    onPress={() => router.push({
                        pathname: "/tenantdetails/[id]",
                        params: {tenant_id : t.tenant_id}
                    })}
                    style={({ pressed }) => [
                        styles.tenantCard,
                        pressed && styles.tenantCardPressed
                    ]}
                >

                    <Text
                        style={styles.tenantText}
                    >{t.tenant_name}</Text>
                    
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#ffffff",
    },
    tenantCard: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 12,
      backgroundColor: "#384959",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3, 
    },
    tenantCardPressed: {
      backgroundColor: "#d1e0ff",
    },
    tenantText: {
      fontSize: 16,
      fontWeight: "500",
      color: "white",
    },
});
  

export default Tenants;