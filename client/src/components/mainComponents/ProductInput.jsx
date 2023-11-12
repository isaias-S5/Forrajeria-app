import React, { useState, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
const windowWidth = Dimensions.get("window").width;


const ProductInput = ({ label, value, setValue, icon }) => {
  const transY = useRef(new Animated.Value(value ? -40 : 0));

  const handleFocus = () => {
    Animated.timing(transY.current, {
      toValue: -40,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  const transX = transY.current.interpolate({
    inputRange: [-20, 0],
    outputRange: [-20, 40],
    extrapolate: "clamp",
  });

  const handleBlur = () => {
    if (!value) {
      Animated.timing(transY.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={windowWidth * 0.06} color="#a1390b" />
        </View>
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                { translateY: transY.current },
                { translateX: transX },
              ],
            },
          ]}
        >
          <Text style={styles.labelText}>{label}</Text>
        </Animated.View>
        <TextInput
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={(text) => setValue(text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 30
  },
  inputContainer: {
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff2600",
  },
  iconContainer: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: "#ff2600",
  },
  labelContainer: {
    position: "absolute",
    padding: 20,
  },
  labelText: {
    fontWeight: "500",
  },
  input: {
    padding: 10,
    flex: 1,
  },
});

export default ProductInput;
