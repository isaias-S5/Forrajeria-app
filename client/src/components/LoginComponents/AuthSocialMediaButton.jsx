import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const AuthSocialMediaButton = () => {
  return (
    <Pressable style={styles.button}>
      <AntDesign name="google" size={28} color="#ffead4" style={styles.icon}/>
      <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    display:'flex',
    backgroundColor: '#ff2323', // Color de Google
    paddingVertical: 13,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    position:'absolute',
    left: 15,
  },
  buttonText: {
    color: '#ffead4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthSocialMediaButton;
