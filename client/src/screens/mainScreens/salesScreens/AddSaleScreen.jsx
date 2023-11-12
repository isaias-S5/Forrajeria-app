import moment from "moment";
import { createSale, updateProduct } from "../../../api/api";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import AddSaleHeader from "../../../components/mainComponents/AddSaleHeader";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const AddSaleScreen = () => {
  const { token, userData } = useContext(AuthContext);
  const { products, saleDetails, setSaleDetails, haveChange, setHaveChange, setSelectedHeaderOption } =
    useContext(GlobalDataContext);

  const navigation = useNavigation();

  const [productsQuantity, setProductsQuantity] = useState(0);

  useEffect(() => {
    calcSaleTotal();
  }, [saleDetails]);

  const formattedDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  const calcSaleTotal = () => {
    let total = 0;
    let totalProducts = 0;
    saleDetails.forEach((detail) => {
      total += parseFloat(detail.subtotal);
      totalProducts += 1;
    });
    setNewsaleData({ ...newSaleData, totalSale: total.toFixed(2) });

    setProductsQuantity(totalProducts);
  };

  const [newSaleData, setNewsaleData] = useState({
    saleDate: formattedDate,
    totalSale: 0,
    employeeID: userData.userID,
    saleDetails: saleDetails,
  });
  console.log(saleDetails)

  const addSale = async () => {
    if (saleDetails.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error al agregar venta",
        text2: "Debes agregar al menos un producto a la venta",
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }
  
    try {
      await createSale(newSaleData, token);
  
      for (const detail of saleDetails) {
        const { productID, quantity, unit } = detail;
        const product = products.find((p) => p.productID == productID);
  
        if (product) {
          // Realiza la conversión de la unidad de medida del detalle a la del producto
          const quantityToSubtract = convertToBaseUnit(quantity, unit, product.productUnit);
          console.log(quantityToSubtract)
          // Calcula el nuevo stock restando la cantidad vendida
          const newStock = product.productStock - quantityToSubtract;
  
          await updateProduct(productID, { productStock: newStock }, token);
        }
      }
  
      setSaleDetails([]);
      setHaveChange(!haveChange);
      setSelectedHeaderOption("details")
      navigation.navigate("addDetailsScreen");
    } catch (error) {
      console.error("Error al agregar la venta:", error);
    }
  };

  const convertToBaseUnit = (quantity, fromUnit, toUnit) => {
    // Implementa la lógica de conversión según tus necesidades
    // Por ejemplo, si fromUnit es "gram" y toUnit es "kilogram", divides la cantidad por 1000
    if ((fromUnit === "G" && toUnit === "KG") || (fromUnit === "ML" && toUnit === "L")) {
      return quantity / 1000;
    }
  
    // Si las unidades son iguales o no se necesita conversión, devuelve la cantidad original
    return quantity;
  };

  return (
    <View style={styles.container}>
      <AddSaleHeader screen={"closing"} />
      <View style={styles.saleInfo}>
        <View style={styles.productsQuantityContainer}>
          <Text style={styles.productsQuantityText}>Cantidad de productos</Text>
          <Text style={styles.productsQuantityText}>{productsQuantity}</Text>
        </View>
        <View style={styles.saleDateContainer}>
          <Text style={styles.saleDateText}>Fecha y hora</Text>
          <Text style={styles.saleDateText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.saleTotalContainer}>
        <Text style={styles.saleTotalText}>Total de la venta</Text>
        <Text style={styles.saleTotalText}>{newSaleData.totalSale}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={addSale} style={styles.button}>
          <Text style={styles.buttonText}>Añadir venta</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9ec",
  },
  saleInfo: {
    padding: 10,
  },
  productsQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffdcad",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  productsQuantityText: {
    color: "#ca5104",
    fontSize: windowWidth * 0.04,
  },
  saleDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffdcad",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  saleDateText: {
    color: "#ca5104",
    fontSize: windowWidth * 0.04,
  },
  saleTotalContainer: {
    backgroundColor: "#ffdcad",
    padding: 13,
    margin: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saleTotalText: {
    color: "#ca5104",
    fontSize: windowWidth * 0.048,
    fontWeight: "700"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF6600",
    borderRadius: 25,
    padding: 15,
    width: windowWidth * 0.8,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddSaleScreen;
