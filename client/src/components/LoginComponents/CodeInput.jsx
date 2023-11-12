import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CodeInput = ({ code, setCode }) => {

  const codeInputs = Array(6).fill(null);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < code.length - 1) {
      codeInputs[index + 1].focus();
    } else if (text === '' && index > 0) {
      codeInputs[index - 1].focus();
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Codigo de Verificación</Text>
      <View style={styles.codeContainer}>
        {code.map((value, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            value={value}
            maxLength={1}
            inputMode='numeric'
            onChangeText={(text) => handleCodeChange(text, index)}
            ref={(input) => (codeInputs[index] = input)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: "#ff6600",
      marginBottom: 30
    },
    codeContainer: {
      flexDirection: 'row',
    },
    codeInput: {
      flex: 1,
      width: "25%",
      height: 45,
      borderWidth: 1,
      borderColor: '#351601',
      borderRadius: 5,
      textAlign: 'center',
      marginHorizontal: 5, // Agrega espacio horizontal entre los cuadros de entrada
    },
  });
  
  export default CodeInput;
