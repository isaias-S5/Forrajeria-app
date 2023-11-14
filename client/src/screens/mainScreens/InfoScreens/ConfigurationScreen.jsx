import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { SimpleLineIcons } from '@expo/vector-icons';
import { AuthContext } from "../../../contexts/AuthContext";
import { FontAwesome5, AntDesign, Feather } from "@expo/vector-icons";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "../../../api/api";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const ConfigurationScreen = () => {
  const { userData, logout, token, haveChange, setHaveChange, setIsLoading  } = useContext(AuthContext);

  const navigation = useNavigation()

  const [newUserProfile, setNewUserProfile] = useState({
    userName: userData.userName,
    email: userData.email,
    password: userData.password,
    realName: userData.realName,
    userPhone: userData.userPhone,
    userPhoto: userData.userPhoto,
  });

  const [isEditing, setIsEditing] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewUserProfile({ ...newUserProfile, userPhoto: result.uri });
    }
  };

  const handleSave = async () => {
    setIsLoading(true)
    await updateUser(userData.userID, newUserProfile, token);
    setHaveChange(!haveChange);
    setIsEditing(false);
    setIsLoading(false)
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePictureContainer}>
          {newUserProfile.userPhoto ? (
            <Image
              source={{ uri: newUserProfile.userPhoto }}
              style={styles.profilePicture}
            />
          ) : (
            <FontAwesome5
              name="user-circle"
              size={windowWidth * 0.3}
              color="#f86e12"
            />
          )}
          {isEditing && (
            <TouchableOpacity
              onPress={pickImage}
              style={styles.editProfileButton}
            >
              <AntDesign name="camerao" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.usernameText}> {newUserProfile.userName}</Text>
        <Text style={styles.emailText}> {newUserProfile.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Tu información</Text>
      {isEditing ? (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <AntDesign name="mail" size={24} color="#f86e12" />
            <TextInput
              style={styles.input}
              value={newUserProfile.email}
              onChangeText={(text) =>
                setNewUserProfile({ ...newUserProfile, email: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={24} color="#f86e12" />
            <TextInput
              style={styles.input}
              value={newUserProfile.userName}
              onChangeText={(text) =>
                setNewUserProfile({ ...newUserProfile, userName: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={24} color="#f86e12" />
            <TextInput
              style={styles.input}
              value={newUserProfile.realName}
              onChangeText={(text) =>
                setNewUserProfile({ ...newUserProfile, realName: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <AntDesign name="phone" size={24} color="#f86e12" />
            <TextInput
              style={styles.input}
              value={newUserProfile.userPhone}
              onChangeText={(text) =>
                setNewUserProfile({ ...newUserProfile, userPhone: text })
              }
            />
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.infoText}>
            <AntDesign name="user" size={18} color="#f86e12" />{" "}
            {newUserProfile.userName}
          </Text>
          <Text style={styles.infoText}>
            <AntDesign name="user" size={18} color="#f86e12" />{" "}
            {newUserProfile.realName}
          </Text>
          <Text style={styles.infoText}>
            <AntDesign name="mail" size={18} color="#f86e12" />{" "}
            {newUserProfile.email}
          </Text>
          <Text style={styles.infoText}>
            <AntDesign name="phone" size={18} color="#f86e12" />{" "}
            {newUserProfile.userPhone
              ? newUserProfile.userPhone
              : "No tienes un teléfono"}
          </Text>
        </View>
      )}

      <View style={styles.userInfo}>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            if (isEditing) {
              handleSave(); // Llamar a handleSave solo cuando se está editando
            } else {
              setIsEditing(!isEditing); // Alternar el estado si no se está editando
            }
          }}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Guardar" : "Editar"}
          </Text>
        </Pressable>
      </View>

      {isEditing && (
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            setIsEditing(!isEditing);
          }}
        >
          <Text style={styles.saveButtonText}>Cancelar</Text>
        </Pressable>
      )}

      {
        userData.role === "Administrador" && (
          <Pressable
        onPress={() => navigation.navigate("usersScreen")}
        style={({ pressed }) => [
          styles.usersButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Feather name="users" size={26} color="orange" />
        <Text style={styles.usersButtonText}>Administrar Usuarios</Text>
      </Pressable>
        )
      }

      <Pressable
        onPress={() => logout()}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <SimpleLineIcons name="logout" size={24} color="#f8530d" />
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </Pressable>
   
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFA65D",
    paddingTop: 30,
  },
  profilePictureContainer: {
    position: "relative",
  },
  profilePicture: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
    borderRadius: windowWidth * 0.15,
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f86e12",
    padding: 10,
    borderRadius: windowWidth * 0.08,
  },
  usernameText: {
    color: "#111",
    fontSize: 30,
    fontWeight: "600",
    color: "#fff0d3",
  },
  emailText: {
    color: "#ffdca5",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 20,
    color: "#f86e12",
  },
  form: {
    padding: 20,
    backgroundColor: "#ffdca7",
    borderRadius: 20,
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: "#cc4902",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "f86e12",
    flex: 1,
    marginLeft: 10,
    marginVertical: 10,
  },
  editButton: {
    width: windowWidth * 0.9,
    backgroundColor: "#f86e12",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  editButtonText: {
    color: "white",
    fontSize: 18,
  },
  saveButton: {
    width: windowWidth * 0.9,
    borderWidth: 1,
    borderColor: "#f86e12",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#333",
    fontSize: 18,
  },
  usersButton: {
    backgroundColor: "#fff2d5",
    marginVertical:10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: windowWidth * 0.2
  },
usersButtonText: {
  color: "orange",
  marginLeft: 10,
  fontSize: 20,
  fontWeight: "600"
},
  logoutButton: {
    flexDirection:"row",
    width: windowWidth * 0.9,
    borderWidth: 3,
    borderColor: "#f8530d",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  logoutButtonText: {
    color: "#f8530d",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10
  },
});

export default ConfigurationScreen;
