import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SeparationLine = () => {
  return (
    <View style={styles.container}>
  <View style={styles.line} />
  <Text style={styles.circle}>o</Text>
  <View style={styles.line} />
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'black', // Color de las rayas
  },
  circle: {
    marginHorizontal: 10, // Espacio entre el círculo y las rayas
    fontSize: 24, // Tamaño del círculo
    fontWeight: 'bold', // Estilo del texto "o"
  },
});


export default SeparationLine;
