import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { GlobalDataContext } from "./GlobalDataContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = "http://192.168.100.152:3000/api/auth";

  const [isLoading, setIsLoading] = useState(true);
  const [haveChange, setHaveChange] = useState(false);
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    console.log('it has changed from configuration')
    loadUserData();
  }, [haveChange]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem("@token");
      const storedUserData = await AsyncStorage.getItem("@userData");

      if (storedToken && storedUserData) {
        setToken(storedToken);
        setUserData(JSON.parse(storedUserData));
      }

      setIsLoading(false);
      return;
    } catch (error) {
      setIsLoading(false); // Cambia el estado a falso en caso de error
      console.error("Error al cargar el token y los datos del usuario:", error);
    }
  };

  const login = async (formData, setFormData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, formData);

      if (response.data.error) {
        Toast.show({
          type: "error",
          text1: response.data.error,
          text2: "Ingresa las credenciales correctas para iniciar sesión",
          position: "top",
        });

        return;
      }

      setIsLoading(true);
      setToken(response.data.token);
      setUserData(response.data.user);

      await AsyncStorage.setItem("@token", response.data.token);
      await AsyncStorage.setItem(
        "@userData",
        JSON.stringify(response.data.user)
      );

      Toast.show({
        type: "success",
        text1: "Inicio de sesión exitoso",
        text2: "¡Bienvenido de nuevo!",
        position: "top",
      });

      setFormData({ usernameOrEmail: "", password: "" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error al Iniciar sesion:", error);
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
    }
  };

  const register = async (formData, navigation) => {
    try {
      setIsLoading(true);

      const response = await axios.post(`${API_URL}/register`, formData);

      if (response.data.error) {
        Toast.show({
          type: "error",
          text1: "Error en el servidor",
          text2: response.data.error,
          position: "top",
          autoHide: true,
          hideAfter: 3000,
        });
        setIsLoading(false);
      }

      Toast.show({
        type: "success",
        text1: "Usuario registrado correctamente",
        text2: "ya puedes ingresar a tu cuenta",
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });

      console.log(response);
      console.log(response.data);

      navigation.navigate("login");

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error al registrarse:", error);
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
    }
  };

  const sendCode = async (code, email, reason) => {
    try {
      const response = await axios.post(
        `${API_URL}/emailVerification/${email}`,
        { code: code, reason: reason }
      );
      console.log(response);
    } catch (error) {
      setIsLoading(false);
      console.log("Error al registrarse:", error);
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
    }
  };

  const resetPassword = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_URL}/changePassword/${email}`, {
        password: password,
      });

      if (response.data.error) {
        Toast.show({
          type: "error",
          text1: "Oops huno un error al actualizar los datos",
          text2: response.data.error,
          position: "top",
          autoHide: true,
          hideAfter: 3000,
        });
        setIsLoading(false);
      }

      Toast.show({
        type: "success",
        text1: "Contraseña actualizada",
        text2: "Ya puedes ingresar a tu cuenta con la nueva contraseña",
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error al registrarse:", error);
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("@token");
      setToken(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        token,
        logout,
        register,
        sendCode,
        userData,
        isLoading,
        setIsLoading,
        resetPassword,
        haveChange,
        setHaveChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
