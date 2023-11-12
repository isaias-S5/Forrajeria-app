import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";

import { GlobalDataContext } from "../../contexts/GlobalDataContext";
import filter from "lodash.filter";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import Toast from "react-native-toast-message";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SearchProductModal = ({
  setIsModalVisible,
  setIsModalDetailsVisible,
}) => {
  const { products, setSelectedProduct } = useContext(GlobalDataContext);
  const [searchText, setSearchText] = useState("");
  const [productsData, setProductsData] = useState(products);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const handleSearch = () => {
    const formattedSearchText = searchText.toLowerCase();
    const filteredProducts = filter(products, (product) => {
      return contains(product, formattedSearchText);
    });
    setProductsData(filteredProducts);
  }; 


  const contains = ({ productName, productID }, searchText) => {
    if (
      productName.includes(searchText) ||
      productID.toString().includes(searchText)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleProductSelection = (item) => {
    if(item.productStock === 0 ){
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return
    }
    setSelectedProduct(item);
    setIsModalVisible(false);
    setIsModalDetailsVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Feather
          name="x-circle"
          size={30}
          color="red"
          style={styles.cross}
          onPress={() => setIsModalVisible(false)}
        />

        <SearchBar value={searchText} setValue={setSearchText} />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={productsData}
          keyExtractor={(product) => product.ProductID}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleProductSelection(item)}
              style={styles.productContainer}
              key={index}
            >
              {item.deleted === 0 && (
                <ProductCard productInfo={item} screen="searchModal" />
              )}
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fef5ee",
    borderWidth: 2,
    borderColor: "#fd8f3a",
    height: windowHeight * 0.5,
    display: "flex",
    borderTopStartRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  cross: {
    position: "absolute",
    top: 3,
    right: 5,
    zIndex: 100,
  },
  productContainer: {
    marginVertical: 5,
  },
});
export default SearchProductModal;
