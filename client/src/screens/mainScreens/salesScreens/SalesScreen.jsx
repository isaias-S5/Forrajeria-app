import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  Button,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import SalesCard from "../../../components/mainComponents/SaleCard";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { deleteSale, updateSale } from "../../../api/api";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { getSalesByDate } from "../../../api/api";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SalesScreen = () => {
  const { userData, token } = useContext(AuthContext);
  const { haveChange, setHaveChange, products } = useContext(GlobalDataContext);
  const navigation = useNavigation()

  const { sales } = useContext(GlobalDataContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [saleData, setSaleData] = useState([]);


  useEffect(() => {
    setSaleData(sales);
  }, [sales]);

  const onDateChange = (date, type) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");

    if (!startDate || !endDate) {
      // Si no hay fecha de inicio o fecha de final, asigna la fecha actual
      setStartDate(formattedDate);
      setEndDate(formattedDate);
    } else {
      // Si ya hay ambas fechas, permite al usuario cambiarlas
      if (type === "START_DATE") {
        setStartDate(formattedDate);
      } else if (type === "END_DATE") {
        setEndDate(formattedDate);
      }
    }
  };

  const handleFilterByDate = async () => {
    await getSalesByDate(userData, token, setSaleData, {
      startDate: startDate,
      endDate: endDate,
    });
    setIsModalVisible(false);
  };

  const handleDeleteSale = async (id) => {
    await deleteSale(id, token);
    setHaveChange(!haveChange);
    setIsDeleting(false)
  };

  const handleCancelSale = async (id) => {
    await updateSale(id, { canceled: 1 }, token, products);
    setHaveChange(!haveChange);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.title}>Ventas</Text>
        </View>
        <Pressable onPress={() => setSaleData(sales)} style={styles.headerBar}>
          <Text style={styles.headerBarOptionText}>Ultimas Primero</Text>
        </Pressable>
      </View>
      <ScrollView>
        {saleData.map((sale) => (
          <Pressable
            onLongPress={() => setIsDeleting(!isDeleting)}
            onPress={() => navigation.navigate("SaleDetailsScreen", {saleData: sale})}
            key={sale.saleID}
            style={{ padding: 10, marginVertical: 10 }}
          >
            <SalesCard key={sale.SaleID} sale={sale} />

            {isDeleting && (
              <>
                {userData.role === "Administrador" && (
                  <FontAwesome5
                    name="trash"
                    size={30}
                    color="#cc1602"
                    style={styles.trashCan}
                    onPress={() => handleDeleteSale(sale.saleID)}
                  />
                )}
                {sale.canceled == 0 && (
                  <Pressable style={styles.cancelSaleContainer}>
                    <Pressable onPress={() => handleCancelSale(sale.saleID)}>
                      <Text style={styles.cancelSaleText}>Cancelar Venta</Text>
                    </Pressable>
                  </Pressable>
                )}
              </>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            onPress={handleFilterByDate}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.7, backgroundColor: "#FFA500" }, // Cambia el color al presionar
            ]}
          >
            <Text style={styles.buttonText}>Filtrar por fechas</Text>
          </Pressable>
          <View style={{ backgroundColor: "#fff" }}>
            <CalendarPicker
              allowRangeSelection={true}
              maxDate={currentDate}
              todayBackgroundColor="#ff7b37"
              todayTextStyle={{ color: "#FFF" }}
              selectedDayColor="#ff540a"
              selectedDayTextColor="#fff"
              onDateChange={onDateChange}
            />
          </View>
        </View>
      </Modal>

      <Pressable
        onPress={() => setIsModalVisible(!isModalVisible)} // Cambiar el estado al hacer clic
        style={({ pressed }) => [
          styles.dateButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <View
          style={{
            backgroundColor: "#f7531d",
            padding: 9,
            borderRadius: 100,
          }}
        >
          <Feather
            name="calendar"
            size={35}
            color="#fff"
            style={styles.addIcon}
          />
        </View>
      </Pressable>
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
  },
  title: {
    fontSize: windowWidth * 0.12,
    color: "#821f0c",
    fontWeight: "bold",
    margin: 25,
  },
  headerBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#ff7b37",
  },
  headerBarOption: {
    borderBottomWidth: 1,
    width: "50%",
    textAlign: "center",
    color: "#fff",
  },
  headerBarOptionText: {
    fontSize: windowWidth * 0.05,
    color: "#fff",
    fontWeight: "600",
  },

  trashCan: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
  },
  cancelSaleContainer: {
    position: "absolute",
    bottom: 25,
    left: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  cancelSaleText: {
    fontWeight: "800",
    color: "#555",
  },
  dateButton: {
    position: "absolute",
    bottom: 20,
    right: 25,
  },
  button: {
    backgroundColor: "#ff7b37", // Color de fondo inicial
    padding: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "#ffe8d4",
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default SalesScreen;
