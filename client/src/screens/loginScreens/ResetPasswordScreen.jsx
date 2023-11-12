import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import CodeInput from "../../components/LoginComponents/CodeInput";
import AuthInput from "../../components/LoginComponents/AuthInput";
import changePasswordIcon from "../../../assets/change-password.png";
import AuthButton from "../../components/LoginComponents/AuthButton";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ResetPasswordScreen = ({ route }) => {
  const { resetPassword, sendCode } = useContext(AuthContext);

  const email = route.params.email;

  const navigation = useNavigation();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sentCode, setSentCode] = useState(0);

  const [errors, setErrors] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    handleSendCode();
  }, []);

  const handleResetPassword = async () => {
    const verificationCode = code.join("");
    const newErrors = {};

    if (parseInt(verificationCode) !== parseInt(sentCode)) {
      newErrors.code = "El código ingresado no coincide con el código enviado.";
    }

    if (newPassword.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (newErrors.code || newErrors.password || newErrors.confirmPassword) {
      // Mostrar errores en el estado
      setErrors(newErrors);
    } else {
      // No hay errores, continuar con el proceso de restablecimiento
      await resetPassword(email, newPassword);
    }
  };

  const handleSendCode = async () => {
    const newRandomCode = generateRandomNumber();
    setSentCode(newRandomCode);

    await sendCode(newRandomCode, email, "Cambio de contraseña");
  };

  const generateRandomNumber = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const goBack = () => {
    navigation.navigate("forgotPassword");
  };

  const goToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ff8047", "#ffc26d"]} style={styles.header}>
        <Image source={changePasswordIcon} style={styles.passwordIcon} />
        <Text style={styles.title}>Restablecer Contraseña</Text>
      </LinearGradient>

      <View style={styles.codeContainer}>
        <CodeInput code={code} setCode={setCode} sendCode={sendCode} />
        <Text style={styles.errorText}>{errors.code}</Text>
      </View>

      <View style={styles.form}>
        <AuthInput
          icon={"lock"}
          desc={"Nueva contraseña"}
          inputType={"password"}
          value={newPassword}
          setValue={setNewPassword}
        />
        <Text style={styles.errorText}>{errors.password}</Text>

        <AuthInput
          icon={"lock"}
          desc={"Repite la nueva contraseña"}
          inputType={"password"}
          value={confirmPassword}
          setValue={setConfirmPassword}
        />
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>

        <View style={{ marginVertical: 15 }} />

        <AuthButton
          type={"PRIMARY"}
          text="Restablecer Contraseña"
          onPress={handleResetPassword}
        />

        <View style={{ marginVertical: 15 }} />

        <AuthButton
          type={"TRANSPARENT"}
          text="Cambiar Email"
          onPress={goBack}
        />

        <View style={{ marginVertical: 15 }} />

        <AuthButton type={"TERTIARY"} text="cancelar" onPress={goToLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8ec",
    display: "flex",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    minHeight: "20%",
    borderBottomLeftRadius: 100,
    backgroundColor: "#ff8047",
    padding: 30,
    alignItems: "center",
    justifyContent: "space-around",
  },
  passwordIcon: {
    width: windowWidth * 0.2,
    height: windowHeight * 0.1,
    marginLeft: 35,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#82310c",
    textAlign: "right",
  },
  codeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffdca5",
    margin: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 15,
    marginVertical: 30,
  },
  form: {
    marginHorizontal: 15,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    marginBottom: 4,
  },
});

export default ResetPasswordScreen;
