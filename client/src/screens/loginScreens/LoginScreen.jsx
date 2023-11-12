import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../../assets/logo.png";
import Wave from "../../components/LoginComponents/Wave";
import SeparationLine from "../../components/LoginComponents/SeparationLine";
import AuthSocialMediaButton from "../../components/LoginComponents/AuthSocialMediaButton";
import AuthInput from "../../components/LoginComponents/AuthInput";
import AuthButton from "../../components/LoginComponents/AuthButton";
//import Wave from "react-wavify";
import Svg, { Path } from "react-native-svg";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [usernameOrEmailError, setusernameOrEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    let error = false;
    if (!formData.usernameOrEmail) {
      setusernameOrEmailError("El nombre de usuario o email son obligatorios");
      error = true;
    }

    if (!formData.password) {
      setPasswordError("La contraseña es obligatoria");
      error = true;
    }

    if (error) return;

    await login(formData, setFormData);
  };

  const goToRegister = () => {
    navigation.navigate("singup");
  };

  const goToForgotPassword = () => {
    navigation.navigate("forgotPassword");
  };

  return (
    <LinearGradient colors={["#ffdca5", "#fff"]} style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, height: "100%" }}
      >
        <View style={styles.header}>
          <Wave
            customStyles={styles.svgCurve}
            customHeight={(windowHeight * 0.30)}
            customTop={(windowHeight * 0.25)}
            customBgColor="#ff7b37"
            customWavePattern="M0,288L60,256C120,224,240,160,360,144C480,128,600,160,720,186.7C840,213,960,235,1080,213.3C1200,192,1320,128,1380,96L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />

          <Image style={styles.logo} source={logo} />
        </View>

        <View style={styles.form}>
          <Text style={styles.loginText}>Iniciar Sesión</Text>
          <AuthInput
            value={formData.usernameOrEmail}
            setValue={(text) => {
              setFormData({ ...formData, usernameOrEmail: text });
              setusernameOrEmailError("");
            }}
            icon={"user"}
            desc={"Email o Username"}
          />
          {usernameOrEmailError ? (
            <Text style={styles.errorText}>{usernameOrEmailError}</Text>
          ) : null}

          <AuthInput
            value={formData.password}
            setValue={(text) => {
              setFormData({ ...formData, password: text });
              setPasswordError("");
            }}
            icon={"lock"}
            desc={"Contraseña"}
            inputType={"password"}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <Pressable onPress={goToForgotPassword}>
            <Text style={styles.forgotPasswordtext}>
              ¿Olvidaste la contraseña?
            </Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <AuthButton
            type={"PRIMARY"}
            text={"Iniciar Sesion"}
            onPress={handleLogin}
          />

          <SeparationLine />

          <View>
            <AuthButton
              type={"TERTIARY"}
              text={"¿No tienes cuenta? Crea una"}
              onPress={goToRegister}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8ec",
  },
  svgCurve: {
    position: "absolute",
    top: 0,
    width: windowWidth,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight * 0.4
  },
  logo: {
    minWidth: 200,
    maxWidth: 300,
    height: 200,
    aspectRatio: 1,
  },
  loginText: {
    fontSize: 36, // Tamaño de fuente grande
    fontWeight: "bold", // Fuente en negrita
    color: "#9e1b0e", // Color del texto
    marginBottom: 10,
  },
  form: {
    padding: 15,
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    marginBottom: 4,
  },
  forgotPasswordtext: {
    textAlign: "right",
    fontFamily: "Roboto",
    fontSize: 15,
    marginBottom: 5,
  },

  buttonContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
  },
});

export default LoginScreen;
