import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getSaleDetails } from "../../../api/api";
import { AuthContext } from "../../../contexts/AuthContext";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import ProductCard from "../../../components/mainComponents/ProductCard";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
const SaleDetailsScreen = ({ route }) => {
  const { token } = useContext(AuthContext);
  const { products } = useContext(GlobalDataContext);
  const [saleDetails, setSaleDetails] = useState([]);
  const [productQuantity, setProductQuantity] = useState(0);
  const navigation = useNavigation()
  const saleData = route.params.saleData;

  console.log(saleData);

  useEffect(() => {
    HandleSetSaleDetails();
  }, []);

  const HandleSetSaleDetails = async () => {
    await getSaleDetails(saleData.saleID, token, setSaleDetails);
  };

  useEffect(() => {
    updateProductQuantity();
  }, [saleDetails, products]);

  const updateProductQuantity = () => {
    let quantity = 0;

    saleDetails.forEach((detail) => {
      products.forEach((product) => {
        if (product.productID === detail.productID) {
          quantity += 1;
        }
      });
    });

    setProductQuantity(quantity);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ffe3a7", "#ff930e"]} style={styles.header}>
        <Feather
          name="edit"
          size={28}
          color="orange"
          style={{ position: "absolute", top: 0, right: 0 }}
          onPress={() => navigation.navigate("EditSaleScreen", {saleData: saleData})}
        />
        <View style={styles.saleTotalContainer}>
          <Text style={styles.saleTotalText}>${saleData.totalSale}</Text>
          <Text style={styles.empleoyeeNameText}>{saleData.realName}</Text>
        </View>

        <View style={styles.saleInfoContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.saleInfoMainText}>fecha</Text>
            <Text style={styles.saleInfoSubText}>
              {moment(saleData.saleDate).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View
            style={[
              styles.infoContainer,
              {
                paddingHorizontal: 30,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: "#ff9232",
              },
            ]}
          >
            <Text style={styles.saleInfoMainText}>Productos</Text>
            <Text style={styles.saleInfoSubText}>{productQuantity}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.saleInfoMainText}>Hora</Text>
            <Text style={styles.saleInfoSubText}>
              {moment(saleData.saleDate).format("HH:mm:ss")}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={styles.productsContainerTitle}>Productos</Text>

      <ScrollView style={styles.productsContainer}>
        {saleDetails.map((detail) =>
          products.map((product) => {
            if (product.productID == detail.productID) {
              return (
                <View key={product.productID} style={{ padding: 10 }}>
                  <ProductCard
                    productInfo={product}
                    screen={"saleScreen"}
                    saleDetails={detail}
                  />
                </View>
              );
            }
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff2d4",
  },
  header: {
    height: windowHeight * 0.25,
    padding: 20,
  },
  saleTotalContainer: {
    height: windowHeight * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  saleTotalText: {
    fontSize: windowWidth * 0.15,
    fontWeight: "600",
    color: "#fb6704",
    marginBottom: 10,
  },
  empleoyeeNameText: {
    fontSize: windowWidth * 0.05,
    color: "#9f3b0d",
  },
  saleInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#ff730a",
    height: windowHeight * 0.06,
    borderRadius: 10,
  },
  infoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  saleInfoMainText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffd8a5",
  },
  saleInfoSubText: {
    fontSize: 16,
    color: "#ffd8a5",
  },
  productsContainer: {
    padding: 15,
  },
  productsContainerTitle: {
    marginTop: 60,
    marginLeft: 15,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ff5900",
  },
});

export default SaleDetailsScreen;
