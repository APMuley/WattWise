import { Text, TouchableOpacity, View } from "react-native";

// information about user to be fetched 
// and displayed here
const Profile = () => {

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TouchableOpacity>
                <Text>
                    name + number of tenants
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default Profile;
