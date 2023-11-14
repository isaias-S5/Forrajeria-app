import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CodeInput from '../../components/LoginComponents/CodeInput';
import AuthButton from '../../components/LoginComponents/AuthButton';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const AuthEmailScreen = ({ route }) => {
  const { register, sendCode } = useContext(AuthContext)
  const navigation = useNavigation();
  const newUserData = route.params.formData;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [sentCode, setSentCode] = useState(0)

  useEffect(() => {
    HandleSendCode()
  }, []) 

  const HandleSendCode = async () => {
    const newRandomCode = generateRandomNumber()
    setSentCode(newRandomCode)

    await sendCode(newRandomCode, newUserData.email, "Verificacion de Email")
  }

  const generateRandomNumber = () => {
    const min = 100000; 
    const max = 999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");

    if (parseInt(verificationCode) == sentCode){
      await register(newUserData, navigation)
    }else{
      Toast.show({
        type: "error",
        text1: "Error en el servidor",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return
    }

  };


  
  const goBack = () => {
    navigation.goBack();
  };

  const goToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ff8047', '#ffc26d']} style={styles.header}>
        <Text style={styles.title}>Verificacion de Email</Text>

      </LinearGradient>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#ff8043', '#ffc26d']}
          style={styles.iconGradient}
        >
          <MaterialCommunityIcons
            name="email-check-outline"
            size={100}
            color="#f04106"
          />
        </LinearGradient>
      </View>

      

      <View style={styles.codeContainer}>
        <CodeInput code={code} setCode={setCode}/>
      </View>
      <View style={styles.buttonContainer}>
      <AuthButton
          type={"PRIMARY"}
          text="Verificar"
          onPress={handleVerifyCode}
        />

        <View style={{ marginVertical: 10 }} />

        <AuthButton
          type={"TRANSPARENT"}
          text="Cambiar Email"
          onPress={goBack}
        />

        <View style={{ marginVertical: 10 }} />

        <AuthButton type={"TERTIARY"} text="cancelar" onPress={goToLogin} />
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe9d4"
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderBottomRightRadius: 100,
    alignItems: 'flex-start',
    height: "15%"
  },
  title: {
    color: '#7f220f',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30, 
    textAlign: 'left',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginVertical: 15
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeContainer: {
    paddingHorizontal: 15
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginLeft: 5,
    marginBottom: 4,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginVertical: 30
  },
});

export default AuthEmailScreen;
