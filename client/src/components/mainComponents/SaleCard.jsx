import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/AuthContext";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SalesCard = ({ sale }) => {
  const { userInfo, token, setIsLoading } = useContext(AuthContext);
  const [isDeleting, setisDeleting] = useState(false);

  const formattedDate = moment(sale.saleDate).format("DD/MM/YYYY");

  return (
    <LinearGradient
      colors={sale.canceled == 1 ? (["#ccc", "#aaa"]) : (["#ffb91b", "#ffa65d"])}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={[styles.saleTotalText, sale.canceled == 1 ? { color: "#444" } : null]}>${sale.totalSale}</Text>
        <Text style={[styles.saleID, sale.canceled == 1 ? { color: "#444" } : null]}>{sale.saleID}</Text>

        <View>
          <Text style={[styles.employeeNameTetx, sale.canceled == 1 ? { color: "#444" } : null]}>{sale.realName}</Text>
        </View>
        <Text style={[styles.saleDateText, sale.canceled == 1 ? { color: "#444" } : null]}>{formattedDate}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderRadius: 20,
    minHeight: windowHeight * 0.24,
 
    backgroundColor: "#ffc26d",
  },
  card: {
    flex: 1,
    minWidth: windowWidth * 0.7,
  },
  saleTotalText: {
    display: "flex",
    position: "relative",
    top: 0,
    left: 0,
    fontSize: windowWidth * 0.09,
    fontWeight: "bold",
    color: "#c73a07",
  },
  saleID: {
    display: "flex",
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 20,
    color: "#c73a07",
    fontWeight: "700",
  },
  employeeNameTetx: {
    marginTop: 8,
    fontSize: 20,
  },
  saleDateText: {
    display: "flex",
    position: "absolute",
    bottom: 0,
    right: 0,
    fontSize: 17,
    color: "#f05006",
    fontWeight: "600",
  },
});

export default SalesCard;
