import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import AuthInput from "../../components/LoginComponents/AuthInput";
import AuthButton from "../../components/LoginComponents/AuthButton";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import Toast from "react-native-toast-message";

const SingUpScreen = () => {

  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    realName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    realName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });



  const handleRegister = async () => {

    // Validaciones
    const { realName, username, email, password, confirmPassword } = formData;
    let hasError = false;

    const newErrors = {};

    if (!realName || realName.length < 6) {
      newErrors.realName = "Debes escribir tu nombre completo";
      hasError = true;
    } else if (/\d/.test(realName)) {
      newErrors.realName = "Tu nombre no debe incluir números";
      hasError = true;
    }

    if (username.length < 3) {
      newErrors.username =
        "El nombre de usuario debe tener al menos 3 caracteres.";
      hasError = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El correo electrónico no es válido.";
      hasError = true;
    }

    if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    verifyExistingUser()

  };

  const verifyExistingUser = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/verifyExistingUser`, {
        username: formData.username,
        email: formData.email,
      });
  
      if (response.data.emailExists) {
        Toast.show({
          type: "error",
          text1: "Email already in use",
          text2: "The provided email is already associated with an account.",
          position: "top",
          autoHide: true,
          hideAfter: 3000,
        });
      } else if (response.data.usernameExists) {
        Toast.show({
          type: "error",
          text1: "Username already in use",
          text2: "The provided username is already in use.",
          position: "top",
          autoHide: true,
          hideAfter: 3000,
        });
      } else {
        // If neither email nor username is in use, proceed with navigation.
        navigation.navigate("authEmail", { formData });
      }
    } catch (error) {
      console.error("Error in verifyExistingUser:", error);
      Toast.show({
        type: "error",
        text1: "Error in request",
        text2: error.message,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
    }
  };  

  const goBack = () => {
    navigation.navigate("login");
  };

  return (
    <KeyboardAwareScrollView behavior="padding">
      <LinearGradient colors={["#ffdca5", "#fff"]} style={styles.container}>
        <LinearGradient colors={["#ff8047", "#ffc26d"]} style={styles.header}>
          <Feather
            name="user-plus"
            size={90}
            color="#a1310b"
            style={styles.icon}
          />
          <Text style={styles.title}>Crea una Cuenta</Text>
        </LinearGradient>

        <View style={styles.form}>
          <Text style={[styles.title, { marginBottom: 20 }]}>
            Ingresa tus datos
          </Text>

          <AuthInput
            value={formData.realName}
            setValue={(text) => {
              setFormData({ ...formData, realName: text });
              setErrors({ ...errors, realName: "" });
            }}
            icon={"user"}
            desc={"Nombre completo"}
          />
          <Text style={styles.errorText}>{errors.realName}</Text>

          <AuthInput
            value={formData.username}
            setValue={(text) => {
              setFormData({ ...formData, username: text });
              setErrors({ ...errors, username: "" });
            }}
            icon={"user"}
            desc={"Username"}
          />
          <Text style={styles.errorText}>{errors.username}</Text>

          <AuthInput
            value={formData.email}
            setValue={(text) => {
              setFormData({ ...formData, email: text });
              setErrors({ ...errors, email: "" });
            }}
            icon={"mail"}
            desc={"user@gmail.com"}
          />
          <Text style={styles.errorText}>{errors.email}</Text>

          <AuthInput
            value={formData.password}
            setValue={(text) => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: "" });
            }}
            icon={"lock"}
            desc={"Contraseña"}
            inputType={"password"}
          />
          <Text style={styles.errorText}>{errors.password}</Text>

          <AuthInput
            value={formData.confirmPassword}
            setValue={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              setErrors({ ...errors, confirmPassword: "" });
            }}
            icon={"lock"}
            desc={"Confirme contraseña"}
            inputType={"password"}
          />
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AuthButton
            type={"PRIMARY"}
            text={"Rregistrarse"}
            onPress={handleRegister}
          />
          
          <View style={{ marginVertical: 15 }} />

          <AuthButton type={"TRANSPARENT"} text={"Cancelar"} onPress={goBack} />
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
    minHeight: "20%",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  icon: {
    marginRight: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#a1310b",
  },
  form: {
    paddingHorizontal: 15,
    marginVertical: 20,
    marginTop: 30,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    marginBottom: 4,
  },
  buttonContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
});

export default SingUpScreen;



// const verifyExistingUser = async () => {
//   try {
//     const response = await axios.post(`http://localhost:3000/api/auth/verifyExistingUser`, {
//       username: formData.username,
//       email: formData.email,
//     });

//     if(response.data.error){
//       setErrors({...errors, errors. })
//     }

   
    
//   } catch (error) {
//     console.log("Error al registrarse:", error);
//     Toast.show({
//       type: "error",
//       text1: "Error en la solicitud",
//       text2: error,
//       position: "top",
//       autoHide: true,
//       hideAfter: 3000,
//     });
//   }
// };
