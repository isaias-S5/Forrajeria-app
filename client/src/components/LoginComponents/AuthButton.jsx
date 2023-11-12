import React from "react";
import { Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";

const AuthButton = ({ type, text, onPress }) => {
  const handlePress =  () => {
    onPress()
  };

  return (
    <Pressable style={({ pressed })=> [styles.button, styles[`button_${type}`], pressed && { opacity : 0.7}]} onPress={handlePress}>
      <Text style={[styles.buttonText, styles[`buttonText_${type}`]]}>
        {text}
      </Text>
    </Pressable>
  );
};



const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 0
  },

  buttonText: {
    color: "#fff5ed", // Cambia el color del texto si es necesario
    fontSize: 15,
    textAlignVertical: "center",
  },

  button_PRIMARY: {
    backgroundColor: "#ff4b0f",
  },

  buttonText_TERTIARY: {
    color: "#440e06",
    fontWeight: "normal",
  },

  button_TRANSPARENT: {
    borderColor: "#ef4307",
    borderWidth: 2,
  },
  buttonText_TRANSPARENT: {
    color: "#ef4307",
  },
});

export default AuthButton;
