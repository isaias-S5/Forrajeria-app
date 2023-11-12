import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { FontAwesome5, MaterialIcons, Fontisto } from "@expo/vector-icons";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import moment from "moment";
import SalesCard from "../../../components/mainComponents/SaleCard";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const HomeScreen = () => {
  const { userData } = useContext(AuthContext);
  const { products, sales } = useContext(GlobalDataContext);

  const navigation = useNavigation();

  const currentDate = moment(new Date()).format("YYYY-MM-DD");

  const todaySales = sales.filter(
    (sale) => currentDate === moment(sale.saleDate).format("YYYY-MM-DD") 
  );

  let todaysTotal = 0;
  todaySales.forEach((sale) => {
    if (sale.canceled === 0) {
      todaysTotal += parseFloat(sale.totalSale);
    }
  });

  let historicTotal = 0;
  sales.forEach((sale) => {
    if (sale.canceled === 0) {
      historicTotal += parseFloat(sale.totalSale);
    }
  });

  let productsTotal = 0
  products.forEach(product =>{
    if(product.deleted === 0){
      productsTotal += 1
    }
  })

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <View style={styles.userPhotoContainer}>
          {userData.userPhoto ? (
            <Image source={{ uri: userData.userPhoto }} style={styles.image} />
          ) : (
            <FontAwesome5
              name="user-circle"
              size={windowWidth * 0.16}
              color="#fff"
            />
          )}
        </View>

        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.username}>{userData.userName}</Text>
      </View>

      {todaySales.length === 0 ? (
        <View style={styles.noSalesContainer}>
          <Fontisto name="frowning" size={windowWidth * 0.2} color="#c84006" />
          <Text style={styles.noSalesText}>No tienes ventas hoy</Text>
        </View>
      ) : (
        <ScrollView horizontal style={styles.newestSalesContainer}>
          {todaySales.map((sale) => (
            <View key={sale.saleID} style={styles.salesContainer}>
              <SalesCard sale={sale} />
            </View>
          ))}
          <Pressable onPress={() => navigation.navigate("SalesScreen")}>
            <Text style={styles.viewAllText}>Ver todo</Text>
          </Pressable>
        </ScrollView>
      )}

      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={styles.box}>
            <Feather name="box" size={24} color="#ffd7a8" style={styles.icon} />
            <Text style={styles.infoTextTitle}>Productos</Text>
            <Text style={styles.infoText}>{productsTotal}</Text>
          </View>
          <View style={styles.box}>
            <MaterialIcons
              name="point-of-sale"
              color="#ffd7a8"
              size={22}
              style={styles.icon}
            />
            <Text style={styles.infoTextTitle}>Hoy</Text>
            <Text style={styles.infoText}>{todaySales.length}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={styles.box}>
            <MaterialIcons
              name="attach-money"
              size={28}
              color="#ffd7a8"
              style={styles.icon}
            />
            <Text style={styles.infoTextTitle}>Hoy</Text>
            <Text style={styles.infoText}>${todaysTotal}</Text>
          </View>
          <View style={styles.box}>
            <MaterialIcons
              name="attach-money"
              size={28}
              color="#ffd7a8"
              style={styles.icon}
            />
            <Text style={styles.infoTextTitle}>Historico</Text>
            <Text style={styles.infoText}>${historicTotal}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ec",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ff9237",
    height: windowHeight * 0.18,
    borderBottomRightRadius: 100,
    padding: 20,
  },
  image: {
    width: windowWidth * 0.16,
    height: windowWidth * 0.16,
    borderRadius: 100,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#c74007",
    marginLeft: 10,
  },
  username: {
    fontSize: 25,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 10,
  },
  newestSalesContainer: {
    backgroundColor: "#111",
    marginTop: 10,
    backgroundColor: "#ffedd4",
    height: windowHeight * 0.3,
  },
  noSalesContainer: {
    height: windowHeight * 0.2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginHorizontal: 15,
  },
  noSalesText: {
    fontSize: 20,
    color: "#c84006",
    marginTop: 7,
  },
  salesContainer: {
    margin: 15,
  },
  viewAllText: {
    fontSize: 20,
    top: 25,
    marginHorizontal: 15,
    color: "blue",
  },

  infoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  box: {
    width: windowWidth * 0.45,
    borderWidth: 2,
    borderColor: "#ff740f",
    borderRadius: 20,
    margin: 10,
    height: windowWidth * 0.3,
    backgroundColor: "#ff7c1f",
  },
  infoTextTitle: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#ffd7a8",
  },
  infoText: {
    position: "absolute",
    bottom: 10,
    right: 20,
    fontSize: 36,
    fontWeight: "700",
    color: "#fff7ed",
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default HomeScreen;
