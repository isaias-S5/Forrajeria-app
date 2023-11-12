import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import AddSaleHeader from "../../../components/mainComponents/AddSaleHeader";
import { useNavigation } from "@react-navigation/native";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import AddSaleDetailModal from "../../../components/mainComponents/AddSaleDetailModal";
import SearchProductModal from "../../../components/mainComponents/SearchProductModal";
import ProductCard from "../../../components/mainComponents/ProductCard";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddDetailsScreen = () => {
  const {
    setSelectedHeaderOption,
    saleDetails,
    setSaleDetails,
    products,
    haveChange,
    setHaveChange,
  } = useContext(GlobalDataContext);

  const navigation = useNavigation();

  const [isModalSearchVisible, setIsModalSearchVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(()=>{
    setSaleDetails([])
  }, []) 

  const handleDeleteDetail = (detailId) => {
    // Aquí eliminamos el detalle del estado global utilizando su ID
    // Asumiendo que el estado se llama 'saleDetails'
    const updatedSaleDetails = saleDetails.filter(
      (detail) => detail.id !== detailId
    );
    // Actualizamos el estado global con los detalles eliminados
    setSaleDetails(updatedSaleDetails);
  };

  return (
    <View style={styles.container}>
      <AddSaleHeader screen={"details"} />

      <View style={styles.selectProductButtonContainer}>
        <Pressable
          onPress={() => setIsModalSearchVisible(true)}
          style={({ pressed }) => [
            styles.selectProductButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.selectProductButtonText}>Añadir Producto</Text>
          <Feather name="plus-circle" size={24} color="#3cb003" />
        </Pressable>
      </View>

      <ScrollView style={styles.detailsContainer}>
        {saleDetails &&
          saleDetails.map((detail, index) => (
            <>
              {isDeleting && (
                <FontAwesome5
                  name="trash"
                  size={30}
                  color="#fa613d"
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteDetail(detail.id)} // Pasar el ID del detalle a eliminar
                />
              )}
              <Pressable
                onLongPress={() => setIsDeleting(!isDeleting)}
                key={index}
                style={styles.productContainer}
              >
                <ProductCard
                  key={index}
                  productInfo={products.find(
                    (product) =>
                      detail.productID == product.productID && product
                  )}
                  saleDetails={detail}
                  onScreen="saleScreen"
                />
              </Pressable>
            </>
          ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("addSaleScreen");
            setSelectedHeaderOption("closing");
          }}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </Pressable>
      </View>

      <Modal
        visible={isModalSearchVisible}
        animationType="slide"
        transparent={true}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <SearchProductModal
          setIsModalVisible={setIsModalSearchVisible}
          setIsModalDetailsVisible={setIsModalDetailsVisible}
        />
      </Modal>

      <Modal
        visible={isModalDetailsVisible}
        animationType="slide"
        transparent={true}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <AddSaleDetailModal setIsVisible={setIsModalDetailsVisible} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },
  detailsContainer: {
    padding: 10,
  },
  productContainer: {
    marginVertical: 10,
    zIndex: -1,
  },
  deleteIcon: {
    position: "absolute",
    top: 0,
    right: -5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff6600",
    borderRadius: 25,
    padding: 15,
    width: windowWidth * 0.8,
    height: windowHeight * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    position: "absolute"
  },
  selectProductButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomEndRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: "#ffdcad",
  },
  selectProductButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fead5d",
    marginVertical: 15,
  },
  selectProductButtonText: {
    color: "#fff",
  },
});

export default AddDetailsScreen;
