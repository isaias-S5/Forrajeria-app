import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useContext } from "react";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import {
  AntDesign,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { deleteUser, updateUser } from "../../../api/api";
import { AuthContext } from "../../../contexts/AuthContext";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserScreen() {
  const { token, userData } = useContext(AuthContext);
  const { users, haveChange, setHaveChange } = useContext(GlobalDataContext);

  const handleUserAdmin = async (user) => {
    let newRole;
    if (user.role === "Administrador") {
      newRole = "Empleado";
    } else {
      newRole = "Administrador";
    }
    await updateUser(user.userID, { role: newRole }, token);
    setHaveChange(!haveChange);
    console.log("admin maker or unmaker");
  };

  const handleDeleteUser = async (id) => {
    await updateUser(id,{active:0, username: "", password: "", email: "" }, token, true)
    setHaveChange(!haveChange);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administrar Usuarios</Text>
        <Feather name="users" size={26} color="orange" />
      </View>

      <ScrollView style={styles.usersContainer}>
        {users.map(
          (user) =>
            userData.userID !== user.userID && user.active === 1 && (
              <View key={user.userID} style={styles.userContainer}>
                <View style={styles.card}>
                  {user.userPhoto ? (
                    <Image
                      source={{ uri: user.userPhoto }}
                      style={styles.profilePicture}
                    />
                  ) : (
                    <FontAwesome5
                      name="user-circle"
                      size={windowWidth * 0.16}
                      color="#9a4712"
                    />
                  )}
                  <View style={styles.userInfoContainer}>
                    <Text style={[styles.userInfoText, { fontWeight: "800" }]}>
                      {user.userName}
                    </Text>
                    <Text style={styles.userInfoText}>{user.email}</Text>
                    <Text style={styles.userInfoText}>{user.realName}</Text>
                    <Text style={styles.userInfoText}>{user.userPhone}</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={() => handleUserAdmin(user)}
                    style={styles.button}
                  >
                    <AntDesign name="adduser" size={24} color="green" />
                    <Text style={styles.buttonText}>
                      {user.role === "Administrador"
                        ? "Deshacer Admin"
                        : "Hacer Admin"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteUser(user.userID)}
                    style={styles.button}
                  >
                    <AntDesign name="deleteuser" size={24} color="red" />
                    <Text style={styles.buttonText}>Eliminar usuario</Text>
                  </Pressable>
                </View>
              </View>
            )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "orange",
  },
  usersContainer: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3d5",
    padding: 10,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fee3aa",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 15,
  },
  button: {
    width: windowWidth * 0.5,
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#666",
    fontSize: 14,
  },
});
