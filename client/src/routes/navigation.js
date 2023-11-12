import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { FontAwesome5 } from '@expo/vector-icons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import * as screen from "../screens/index";

const LoginStackNavigator = createNativeStackNavigator();

function MyLoginStack() {
  return (
    <LoginStackNavigator.Navigator screenOptions={{ headerShown: false }} >
      <LoginStackNavigator.Screen
        name="login"
        component={screen.LoginScreen}
      />
      <LoginStackNavigator.Screen
        name="authEmail"
        component={screen.AuthEmailScreen}
      />
      <LoginStackNavigator.Screen
        name="singup"
        component={screen.SingUpScreen}
      />
      <LoginStackNavigator.Screen
        name="resetPassword"
        component={screen.ResetPasswordScreen}
      />
      <LoginStackNavigator.Screen
        name="forgotPassword"
        component={screen.ForgotPasswordScreen}
      />
    </LoginStackNavigator.Navigator>
  );
}

const MainStackNavigator = createNativeStackNavigator();

function MyAddSaleStack() {
  return (
    <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MainStackNavigator.Screen name="addDetailsScreen" component={screen.AddDetailsScreen} />
      <MainStackNavigator.Screen name="addSaleScreen" component={screen.AddSaleScreen}/>
    </MainStackNavigator.Navigator>
  );
}

function MySaleStack() {
  return (
    <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MainStackNavigator.Screen name="SalesScreen" component={screen.SalesScreen} />
      <MainStackNavigator.Screen name="SaleDetailsScreen" component={screen.SaleDetailsScreen}/>
      <MainStackNavigator.Screen name="EditSaleScreen" component={screen.EditSaleScreen}/>
    </MainStackNavigator.Navigator>
  );
}

function MyProductsStack() {
  return (
    <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MainStackNavigator.Screen name="productsScreen" component={screen.ProductsScreen}/>
      <MainStackNavigator.Screen name="productsDetailsScreen" component={screen.ProductsDetailsScreen}/>
      <MainStackNavigator.Screen name="supplierScreen" component={screen.SuppliersScreen}/>
      <MainStackNavigator.Screen name="categoryScreen" component={screen.CategoriesScreen}/>
    </MainStackNavigator.Navigator>
  );
}

function MyConfigurationStack() {
  return (
    <MainStackNavigator.Navigator screenOptions={{ headerShown: false, headerTitle: "Configuración" }}>
      <MainStackNavigator.Screen name="profileScreen" component={screen.ConfigurationScreen}/>
      <MainStackNavigator.Screen name="usersScreen" component={screen.UserScreen}/>
    </MainStackNavigator.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'configuration') {
            iconName = focused ? 'user-circle' : 'user-circle';
          } else if (route.name === 'home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'products') {
            iconName = focused ? 'box' : 'box';
          } else if (route.name === 'sales') {
            iconName = focused ? 'chart-bar' : 'chart-bar';
          } else if (route.name === 'addSale') {
            return (
              <FontAwesome5
                name="plus-circle"
                size={size * 1.5} 
                color={color}
                style={{
                  position: 'absolute',
                  top: -10,
                }}
              />
            );
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      headerShown={false}
      tabBarOptions={{
        activeTintColor: 'orange', 
        inactiveTintColor: 'gray', 
        showLabel: false,
        style: {
          backgroundColor: '#fff7ed', 
        },
      }}

    >
      <Tab.Screen options={{ headerTitle: "Inicio" }} name="home" component={screen.HomeScreen} />
      <Tab.Screen options={{ headerTitle: "Ventas" }} name="sales" component={MySaleStack} />
      <Tab.Screen options={{ headerTitle: "Añadir Venta" }} name="addSale" component={MyAddSaleStack} />
      <Tab.Screen options={{ headerTitle: "Productos" }} name="products" component={MyProductsStack} />
      <Tab.Screen options={{ headerTitle: "Configuración" }}  name="configuration" component={MyConfigurationStack} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { token, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: "center", backgroundColor: "#ccc"}}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!token ? <MyLoginStack /> : <MyTabs />}
    </NavigationContainer>
  );
}
