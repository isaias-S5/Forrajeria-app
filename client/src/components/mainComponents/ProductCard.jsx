import React, { useContext, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const ProductCard = ({ productInfo, screen = false, saleDetails = {} }) => {
  const handleDeleteDetail = () => {
    console.log(productInfo.ProductID);
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };

  const getStockColor = () => {
    if (
      (productInfo.productUnit === "UD" && productInfo.productStock < 10) ||
      (productInfo.productUnit !== "UD" && productInfo.productStock < 5)
    ) {
      return "#ff0000"; // Red
    } else {
      return "#366b09"; // Green
    }
  };

  return (
    <View style={styles.container}>
      {screen == "productScreen" || screen == "searchModal" ? (
        <View style={styles.cardContainer}>
          <View style={styles.productInfoContainer}>
            {productInfo.productPhoto ? (
              <Image
                source={productInfo.productPhoto}
                style={styles.productImage}
              />
            ) : (
              <Feather
                name="box"
                size={windowWidth * 0.13}
                color="#431307"
                style={styles.productImage}
              />
            )}

            <View style={styles.productDetails}>
              <Text
                style={styles.productName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateDescription(productInfo.productName, 16)}
              </Text>
              <Text
                style={styles.productDescription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {truncateDescription(productInfo.productDescription, 25)}
              </Text>
            </View>
          </View>

          <View style={styles.stockPrice}>
            <Text style={styles.productPrice}>${productInfo.productPrice}</Text>
            <Text style={[styles.productStock, { color: getStockColor() }]}>
              {productInfo.productUnit === "UD"
                ? Math.floor(productInfo.productStock)
                : productInfo.productStock} {productInfo.productUnit}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.cardContainer2}>
          {screen == "addDetailsScreen" && (
            <Entypo
              name="circle-with-cross"
              size={30}
              color="#cc1602"
              onPress={handleDeleteDetail}
              style={styles.cross}
            />
          )}
          <View style={styles.productInfoContainer}>
            {productInfo.productPhoto ? (
              <Image
                source={productInfo.productPhoto}
                style={styles.productImage}
              />
            ) : (
              <Feather
                name="box"
                size={windowWidth * 0.13}
                color="#431307"
                style={styles.productImage}
              />
            )}

            <View style={styles.productDetails}>
              <Text style={styles.productName}>{productInfo.productName}</Text>
            </View>
          </View>

          <Text
            style={{
              borderColor: "#7d2b11",
              borderWidth: 1,
              height: 1,
              marginTop: 10,
              marginBottom: 10,
              width: "100%",
            }}
          />

          <View style={styles.Saledetails}>
            <Text style={styles.quantity}>
              {saleDetails.quantity ? saleDetails.quantity : 0} x{" "}
              {saleDetails.unitPrice ? saleDetails.unitPrice : 0}
            </Text>
            <Text style={styles.subtotal}>
              {saleDetails.subtotal ? saleDetails.subtotal : 0}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffecd5",
    borderWidth: 1,
    borderColor: "#7d2b11",
  },
  cardContainer2: {
    display: "flex",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#ffecd5",
    borderWidth: 1,
    borderColor: "#7d2b11",
  },
  productImage: {
    width: windowWidth * 0.13,
    height: windowWidth * 0.13,
  },
  cross: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  productInfoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  productDetails: {
    marginLeft: 8,
  },
  stockPrice: {
    alignItems: "flex-end",
  },
  productName: {
    fontSize: windowWidth * 0.05,
    fontWeight: "600",
    color: "#431307",
  },
  productDescription: {
    fontSize: windowWidth * 0.037,
    color: "#9b3111",
  },
  productPrice: {
    fontSize: windowWidth * 0.05,
    color: "#333",
  },
  productStock: {
    fontSize: windowWidth * 0.039,
    color: "#7d2b11",
  },
  Saledetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: windowWidth * 0.039,
    color: "#333",
  },
  subtotal: {
    fontSize: windowWidth * 0.039,
    color: "#333",
  },
});

export default ProductCard;
