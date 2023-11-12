import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; // Importa el icono que desees

const AuthInput = ({ desc, icon, inputType = "", value, setValue }) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color="black" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={desc}
        value={value}
        secureTextEntry={inputType == "password" && !isHidden}
        onChangeText={(text) => setValue(text)}
      />
      {inputType == "password" &&
        (isHidden ? (
          <Feather
            name="eye"
            size={24}
            color="black"
            onPress={() => setIsHidden(!isHidden)}
          />
        ) : (
          <Feather
            name="eye-off"
            size={24}
            color="black"
            onPress={() => setIsHidden(!isHidden)}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "rgba(240, 150, 0, 0.2)",
  },
  iconContainer: {
    borderRightWidth: 1,
    borderColor: "#222",
    paddingRight: 12,
  },
  icon: {
    fontSize: 30,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});

export default AuthInput;
