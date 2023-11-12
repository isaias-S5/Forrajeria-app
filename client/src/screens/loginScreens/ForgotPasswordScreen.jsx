import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AuthButton from "../../components/LoginComponents/AuthButton";
import AuthInput from "../../components/LoginComponents/AuthInput";
import { Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      setEmailError("Debe ingresar un email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("El correo electrónico no es válido.");
      return;
    }

    navigation.navigate("resetPassword", { email });
  };

  const goBack = () => {
    navigation.navigate("login");
  };

  return (
    <LinearGradient colors={["#ffdca5", "#fff"]} style={styles.container}>
      <StatusBar backgroundColor="#fff" />

      <LinearGradient colors={["#ff8047", "#ffc26d"]} style={styles.header}>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico para restablecer tu contraseña
        </Text>
      </LinearGradient>

      <Entypo
        name="emoji-sad"
        size={150}
        color="rgba(247, 136, 0, 0.7)"
        style={{ alignSelf: "center", paddingVertical: 25 }}
      />

      <View style={styles.form}>
        <AuthInput
          icon={"mail"}
          desc={"user@gmail.com"}
          value={email}
          setValue={setEmail}
        />
        <Text style={styles.errorText}>{emailError}</Text>

        <View style={{ marginVertical: 10 }} />

        <AuthButton
          text={"Enviar codigo"}
          type={"PRIMARY"}
          onPress={handleResetPassword}
        />

        <View style={{ marginVertical: 10 }} />

        <AuthButton text={"Cancelar"} type={"TRANSPARENT"} onPress={goBack} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8ec",
  },
  header: {
    minHeight: "20%",
    borderBottomRightRadius: 100,
    backgroundColor: "#ff8047",
    padding: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#82310c",
    textAlign: "left",
    marginVertical: 15,
    marginHorizontal: 5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#cc4902",
    marginVertical: 15,
    marginHorizontal: 5,
  },
  form: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  errorText: {
    fontSize: 20,
    color: "red",
    marginLeft: 5,
    marginBottom: 4,
  },
});

export default ForgotPasswordScreen;
