import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../../contexts/AuthContext";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import {
  deleteDetail,
  getSaleDetails,
  updateSale,
  createDetail,
} from "../../../api/api";
import moment from "moment";
import ProductCard from "../../../components/mainComponents/ProductCard";
import CalendarPicker from "react-native-calendar-picker";
import SearchProductModal from "../../../components/mainComponents/SearchProductModal";
import AddSaleDetailModal from "../../../components/mainComponents/AddSaleDetailModal";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EditSaleScreen = ({ route }) => {
  const saleData = route.params.saleData;

  const { token } = useContext(AuthContext);
  const {
    products,
    saleDetails,
    setSaleDetails,
    haveChange,
    setHaveChange,
  } = useContext(GlobalDataContext);

  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isModalSearchVisible, setIsModalSearchVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saleDetailsData, setSaleDetailsData] = useState([]);


  const [newSaleData, setNewsaleData] = useState({
    saleDate: saleData.saleDate,
    totalSale: saleData.totalSale,
    employeeID: saleData.emplyeeID,
    saleDetails: saleDetails,
  });

  useEffect(() => {
    handleSetSaleDetails();
  }, [haveChange]);

  const handleSetSaleDetails = async () => {
    await getSaleDetails(saleData.saleID, token, setSaleDetailsData);
  };

  const onDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");


    console.log(formattedDate)
    setNewsaleData({ ...newSaleData, saleDate: formattedDate });
  };

  useEffect(() => {
    calcSaleTotal();
  }, [saleDetailsData]);

  const calcSaleTotal = () => {
    let total = 0;
    saleDetailsData.forEach((detail) => {
      total += parseFloat(detail.subtotal);
    });
    setNewsaleData({ ...newSaleData, totalSale: total.toFixed(2) });
  };

  const handleDeleteDetail = async (id) => {
    await deleteDetail(saleData.saleID, id, token);
    setHaveChange(!haveChange);
  };

  useEffect(() => {
    if (saleDetails.length === 0) {
      return;
    } else {
      handleAddDetail();
    }
  }, [saleDetails]);

  const handleAddDetail = async () => {
    await createDetail(saleData.saleID, saleDetails[0], token);
    setSaleDetails([]);
    setHaveChange(!haveChange);
    console.log(saleDetails);
  };

  const handleEditSale = async () => {
    await updateSale(saleData.saleID, newSaleData, token)
    setHaveChange(!haveChange)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome
          name="edit"
          size={windowWidth * 0.1}
          color="#fff"
          style={styles.editIcon}
        />
        <Text style={styles.headerTitle}>Editar venta</Text>
      </View>

      <View style={styles.form}>
        <View>

        <Text style={styles.saleTotal}>${newSaleData.totalSale}</Text>
        </View>
        <Pressable
          style={styles.buttonEditDate}
          onPress={() => setIsDateModalVisible(true)}
        >
          <FontAwesome name="calendar-plus-o" size={24} color="orange" />
          <Text style={styles.buttonEditDateText}>Editar Fecha:</Text>
          <Text style={styles.date}>
            {moment(newSaleData.saleDate).format("DD/MM/YYYY")}
          </Text>
        </Pressable>



      </View>

      <Modal
        visible={isDateModalVisible}
        animationType="fade"
        transparent={true}
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff" }}>
            <Pressable
              onPress={() => setIsDateModalVisible(false)}
              style={{
                width: windowWidth,
                height: windowHeight * 0.06,
                backgroundColor: "#ffb832",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>Aceptar</Text>
            </Pressable>
            <CalendarPicker
              allowRangeSelection={false}
              todayBackgroundColor="#ff7b37"
              todayTextStyle={{ color: "#FFF" }}
              selectedDayColor="#ff540a"
              selectedDayTextColor="#fff"
              onDateChange={onDateChange}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.detailsContainer}>
        <Pressable
          onPress={() => setIsModalSearchVisible(true)}
          style={({ pressed }) => [
            styles.buttonDeleteProduct,
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <Text style={styles.buttonAddProductText}>Agregar Productos</Text>
        </Pressable>
        <Pressable
          onPress={() => setIsDeleting(!isDeleting)}
          style={({ pressed }) => [
            styles.buttonAddProduct,
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <Text style={styles.buttonDeleteProductText}>Eliminar Producto</Text>
        </Pressable>

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
        <ScrollView style={styles.productsContainer}>
          {saleDetailsData.map((detail) =>
            products.map((product) => {
              if (product.productID == detail.productID) {
                return (
                  <Pressable
                    onLongPress={() => setIsDeleting(!isDeleting)}
                    style={{ padding: 10, zIndex: -1 }}
                  >
                    {isDeleting && (
                      <MaterialIcons
                        name="cancel"
                        size={24}
                        color="red"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 100,
                        }}
                        onPress={() => handleDeleteDetail(detail.detailID)}
                      />
                    )}
                    <ProductCard
                      productInfo={product}
                      screen={"saleScreen"}
                      saleDetails={detail}
                    />
                  </Pressable>
                );
              }
            })
          )}
        </ScrollView>

        <Pressable
        onPress={() => handleEditSale()}
         style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Pressable>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff4ec",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ff9237",
    height: windowHeight * 0.14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    padding: 15,
  },
  headerTitle: {
    fontSize: 30,
    color: "#fff",
    marginLeft: 10,
  },
  editIcon: {
    marginRight: windowWidth * 0.02,
  },
  form: {
    padding: 10,
  },
  buttonEditDate: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  buttonEditDateText: {
    fontSize: 18,
    marginRight: 5,
  },
  date: {
    fontSize: 18,
  },
  saleTotal: {
    fontSize: 25,
    fontWeight: "800",
    margin: 12,
    color: "#c25b0c",
    alignSelf: "center"
  },
  buttonAddProduct: {
    backgroundColor: "#ffb832",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
    marginTop: 15,
  },
  buttonAddProductText: {
    fontSize: 18,
    color: "#fff",
  },
  buttonDeleteProduct: {
    backgroundColor: "#ff7432",
    padding: 8,
    borderRadius: 5,

    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
  },
  buttonDeleteProductText: {
    fontSize: 18,
    color: "#fff",
  },
  productsContainer: {
    padding: 7,
  },
  saveButton: {
    position: "absolute",
    bottom: 10,
    width: windowWidth * 0.9,
    backgroundColor: "#f47601",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    padding: 8
  },
saveButtonText: {
  color: "#fff",
  fontSize: 20
},
});

export default EditSaleScreen;
