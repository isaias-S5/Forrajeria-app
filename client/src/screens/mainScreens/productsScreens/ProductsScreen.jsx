import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import { AuthContext } from "../../../contexts/AuthContext";
import ProductCard from "../../../components/mainComponents/ProductCard";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { deleteProduct } from "../../../api/api";
import SearchBar from "../../../components/mainComponents/SearchBar";
import Dropdown from "../../../components/mainComponents/Dropdown";
import filter from "lodash.filter";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ProductsScreen = () => {
  const { userData, token } = useContext(AuthContext);
  const { products, haveChange, setHaveChange, suppliers, categories } =
    useContext(GlobalDataContext);

  const navigation = useNavigation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isFiltering, setisFiltering] = useState(false);
  const [isAdding, setisAdding] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    filterData();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedSupplier, selectedCategory, products]);

  const filterData = () => {
    const filteredProducts = filter(products, (product) => {
      return contains(product, selectedCategory, selectedSupplier);
    });
    setProductsData(filteredProducts);
  };

  const contains = ({ categoryID, supplierID }) => {
    if (!selectedCategory && !selectedSupplier) {
      return true;
    }

    if (selectedCategory && selectedSupplier) {
      return categoryID === selectedCategory && supplierID === selectedSupplier;
    }

    if (!selectedCategory) {
      return supplierID === selectedSupplier;
    }

    if (!selectedSupplier) {
      return categoryID === selectedCategory;
    } else {
      return false;
    }
  };

  const supplierData = suppliers.map((supplier) => {
    return {
      key: supplier.supplierID,
      value: supplier.supplierName,
    };
  });

  const categoryData = categories.map((category) => {
    return {
      key: category.categoryID,
      value: category.categoryName,
    };
  });

  const handleGoToProductDetails = (productInfo) => {
    navigation.navigate("productsDetailsScreen", {
      productInfo,
      originScreen: "updateProduct",
    });
    setIsDeleting(false);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id, token);
    setHaveChange(!haveChange);
    setIsDeleting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Stock</Text>
        <Text style={styles.subTitle}>Tus productos aparecerán aquí</Text>
      </View>

      <Pressable
        onPress={() => {
          setisFiltering(!isFiltering);
          setProductsData(products);
        }}
        style={styles.filterOptionContainer}
      >
        <Text style={styles.filterOptionText}>Filtar productos</Text>
      </Pressable>
      {isFiltering && (
        <>
          <Dropdown
            data={categoryData}
            selectedValue={selectedCategory}
            setSelectedValue={setSelectedCategory}
            icon={"grid"}
            label={"Categoria"}
          />

          <Dropdown
            data={supplierData}
            selectedValue={selectedSupplier}
            setSelectedValue={setSelectedSupplier}
            icon={"user"}
            label={"Proveedor"}
          />
        </>
      )}

      <View style={styles.SearchBarContainer}>
        <SearchBar value={searchText} setValue={setSearchText} />
      </View>

      <ScrollView style={styles.productsContainer}>
        {productsData.map(
          (product) =>
            product.deleted === 0 &&
            product.productName
              .toLowerCase()
              .includes(searchText.toLowerCase()) && (
              <Pressable
                onPress={() => handleGoToProductDetails(product)}
                onLongPress={() => {
                  console.log("long press");
                  userData.role === "Administrador" &&
                    setIsDeleting(!isDeleting);
                }}
                key={product.productID}
                style={({ pressed }) => [
                  styles.productContainer,
                  pressed && { opacity: 0.5 },
                ]}
              >
                {isDeleting && (
                  <Entypo
                    name="circle-with-cross"
                    size={30}
                    color="#cc1602"
                    onPress={() => handleDeleteProduct(product.productID)}
                    style={styles.cross}
                  />
                )}
                <ProductCard
                  key={product.ProductID}
                  productInfo={product}
                  screen={"productScreen"}
                />
              </Pressable>
            )
        )}
      </ScrollView>

      {userData.role === "Administrador" && (
        <Pressable
          onPress={() => {
            setIsDeleting(false);
            setisAdding(!isAdding);
          }}
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          {isAdding && (
            <View style={styles.buttonsContainer}>
              <MaterialIcons
                name="category"
                size={windowWidth * 0.12}
                color="#ffedd3"
                style={styles.icons}
                onPress={() => navigation.navigate("categoryScreen")}
              />

              <MaterialIcons
                name="supervised-user-circle"
                size={windowWidth * 0.12}
                color="#ffedd3"
                style={styles.icons}
                onPress={() => navigation.navigate("supplierScreen")}
              />

              <MaterialIcons
                name="check-box"
                size={windowWidth * 0.12}
                color="#ffedd3"
                style={styles.icons}
                onPress={() =>
                  navigation.navigate("productsDetailsScreen", {
                    productInfo: {},
                    originScreen: "addProduct",
                  })
                }
              />
            </View>
          )}
          <AntDesign
            name="pluscircle"
            size={windowWidth * 0.15}
            color="#f7531d"
            style={styles.addIcon}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },
  headerContainer: {
    backgroundColor: "#FFA65D",
    minHeight: "10%",
    padding: 30,
    borderBottomRightRadius: 100,
    borderWidth: 2,
    borderColor: "#ff2600",
  },
  title: {
    fontSize: windowWidth * 0.12,
    color: "#821f0c",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: windowWidth * 0.04,
    color: "#fff",
  },
  filterOptionContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe0a7",
  },
  filterOptionText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#c85406",
  },
  SearchBarContainer: {
    marginHorizontal: 15,
  },
  productsContainer: {
    paddingHorizontal: 17,
  },
  productContainer: {
    padding: 8,
  },
  cross: {
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 100,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 25,
  },
  buttonsContainer: {
    backgroundColor: "#f7531d",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  icons: {
    marginVertical: 10,
  },
  notFound: {
    fontSize: 20,
    alignSelf: "center",
    color: "#fa613d",
  },
});

export default ProductsScreen;
