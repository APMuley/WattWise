import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

const Tenants = () => {
    const [tenants, setTenants] = useState([]);

    const router = useRouter();

    // Get all the tenants to load on the page first
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await fetch('http://ip_address:8000/get_tenants');

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
        <ScrollView>
            {tenants.map((t) => (
                <Pressable
                    key={t.tenant_id}
                    onPress={() => console.log("hehe")}
                    style={{ padding: 20, borderBottomWidth: 1 }}
                >
                    <Text>{t.tenant_name}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

export default Tenants;