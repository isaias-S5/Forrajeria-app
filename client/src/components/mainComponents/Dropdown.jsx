import React from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";

const windowWidth = Dimensions.get("window").width;

const Dropdown = ({ currentValue, data, setSelectedValue, icon, label, }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={windowWidth * 0.06} color="#a1390b" />
      </View>
      <View style={styles.DropdownContainer}>
        <SelectList
          placeholder={currentValue}
          setSelected={(val) => setSelectedValue(val)}
          data={data}
          save="key"
          boxStyles={styles.dropdown}
          notFoundText="No encontrado"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Para que los elementos se coloquen en fila
    borderWidth: 1,
    borderColor: "#ff2600",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal: 10,
  },
  label: {
    position: "absolute",
    top: -37,
    left: -9,
    margin: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    margingRight: 10, // Espacio entre el icono y el select
    borderRightWidth: 1,
    borderColor: "#ff2600",
    padding: 10,
  },
  DropdownContainer: {
    flex: 1, // El select ocupará todo el espacio restante
  },
  dropdown: {
    width: "95%",
    borderColor: "transparent",
    borderRadius: 0,
    marginLeft: windowWidth * 0.09,
  },
});

export default Dropdown;
