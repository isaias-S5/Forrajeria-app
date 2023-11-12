import React from "react";
import { Feather } from "@expo/vector-icons";
import { View, TextInput, StyleSheet } from "react-native";

const SearchBar = ({ value, setValue }) => {
  return (
    <View style={styles.searchBarcontainer}>
      <Feather
        name="search"
        size={24}
        color="#c43d0a"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        underlineColorAndroid="transparent"
        placeholder="Buscar..."
        value={value}
        onChangeText={(text) => setValue(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarcontainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c43d0a",
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    marginTop: 25,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default SearchBar;
