import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { GlobalDataContext } from "../../contexts/GlobalDataContext";

const AddSaleHeader = () => {
  const navigation = useNavigation();
  const { selectedHeaderOption, setSelectedHeaderOption } = useContext(GlobalDataContext);
  return (
    <View style={styles.headerContainer}>
      <Pressable
        style={[
          styles.optionContainer,
          selectedHeaderOption == "details" && styles.activeContainer,
        ]}
        onPress={() => {
          setSelectedHeaderOption("details");
          navigation.navigate("addDetailsScreen");
        }}
      >
        <Text
          style={[
            styles.optionText,
            selectedHeaderOption == "details" && styles.activeOption,
          ]}
        >
          Detalle
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.optionContainer,
          selectedHeaderOption == "closing" && styles.activeContainer,
        ]}
        onPress={() => {
          setSelectedHeaderOption("closing");
          navigation.navigate("addSaleScreen");
        }}
      >
        <Text
          style={[
            styles.optionText,
            selectedHeaderOption == "closing" && styles.activeOption,
          ]}
        >
          Cierre
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
  },
  optionContainer: {
    width: "50%",
    padding: 10,
    position: "relative",
  },
  optionText: {
    textAlign: "center",
  },
  activeContainer: {
    borderBottomWidth: 2,
    borderColor: "#fb7318",
  },
  activeOption: {
    color: "#fb7318",
  },
});

export default AddSaleHeader;
