import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GlobalDataContext } from "../../contexts/GlobalDataContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
const windowWidth = Dimensions.get("window").width;

const AddSaleDetailModal = ({ setIsVisible }) => {
  const { selectedProduct, setSaleDetails, saleDetails } =
    useContext(GlobalDataContext);

  const navigation = useNavigation();

  const [price, setPrice] = useState(0);
  const [isAddByPriceVisible, setIsAddByPriceVisible] = useState(false);

  const [newSaleDetail, setNewSaleDetail] = useState({
    productID: selectedProduct.productID,
    quantity: 0,
    unit: selectedProduct.productUnit,
    unitPrice: selectedProduct.productPrice,
    subtotal: 0,
  });

  const unitLabels = [
    "UD Unidad",
    "L Litros ML Mililitros",
    "KG Kilogramos G Gramos",
  ];

  useEffect(() => {
    subtotalHandler();
  }, [newSaleDetail.quantity, newSaleDetail.unit]);

  useEffect(() => {
    calculateQuantityFromPrice(price);
  }, [price, newSaleDetail.unit]);

  const subtotalHandler = () => {
    let newSubTotal = 0;

    if (price < 0) return;

    if (newSaleDetail.unit === "G" || newSaleDetail.unit === "ML") {
      newSubTotal =
        (parseFloat(newSaleDetail.quantity) *
          parseFloat(newSaleDetail.unitPrice)) /
        1000;
      setNewSaleDetail({ ...newSaleDetail, subtotal: newSubTotal.toFixed(2) });
    } else {
      newSubTotal =
        parseFloat(newSaleDetail.quantity) *
        parseFloat(newSaleDetail.unitPrice);
      setNewSaleDetail({ ...newSaleDetail, subtotal: newSubTotal.toFixed(2) });
    }
  };

  const calculateQuantityFromPrice = () => {
    if (newSaleDetail.unit === "G" || newSaleDetail.unit === "ML") {
      const quantityInGrams =
        (parseFloat(price) / parseFloat(newSaleDetail.unitPrice)) * 1000;
      setNewSaleDetail({
        ...newSaleDetail,
        quantity: Math.floor(quantityInGrams),
      });
    } else {
      const quantityInUnit =
        parseFloat(price) / parseFloat(newSaleDetail.unitPrice);
      setNewSaleDetail({
        ...newSaleDetail,
        quantity: Math.floor(quantityInUnit.toFixed(2)),
      });
    }
  };

  const handleOnPress = () => {
    if (newSaleDetail.quantity === 0) return;
   
    if (
      newSaleDetail.unit === "G" ||
      newSaleDetail.unit === "ML"
    ) {
      if (newSaleDetail.quantity > parseFloat(selectedProduct.productStock) * 1000) {
        Toast.show({
          type: "error",
          text1: "No hay suficiente Stock",
          position: "top",
          autoHide: true,
          hideAfter: 3000,
        });
        return;
      }
    } else {
      if (newSaleDetail.quantity > selectedProduct.productStock) {
        Toast.show({
          type: "error",
          text1: "No hay suficiente Stock",
          position: "top",
          autoHide: true,
          hideAfter: 3000,
        });
        return;
      }
    }

    setSaleDetails((prevSaleDetails) => {
      return [...prevSaleDetails, newSaleDetail];
    });
    console.log(saleDetails);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Añadir detalle a la venta</Text>
        </View>

        <View
          style={[
            styles.secondaryHeader,
            newSaleDetail.unit === "UD" && { justifyContent: "center" },
          ]}
        >
          {unitLabels.map((item) => {
            const unitArray = item.split(" ");

            if (
              newSaleDetail.unit == unitArray[0] ||
              newSaleDetail.unit == unitArray[2]
            ) {
              return (
                <>
                  <Pressable
                    onPress={() =>
                      setNewSaleDetail({ ...newSaleDetail, unit: unitArray[0] })
                    }
                  >
                    <Text
                      style={[
                        styles.secondaryHeaderText,
                        newSaleDetail.unit === unitArray[0] &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {unitArray[1]}
                    </Text>
                  </Pressable>
                  {unitArray.length >= 2 ? (
                    <Pressable
                      onPress={() =>
                        setNewSaleDetail({
                          ...newSaleDetail,
                          unit: unitArray[2],
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.secondaryHeaderText,
                          newSaleDetail.unit === unitArray[2] &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {unitArray[3]}
                      </Text>
                    </Pressable>
                  ) : null}
                </>
              );
            }
          })}
        </View>

        <View style={styles.inputContainer}>
          <Pressable>
            <AntDesign
              name="minuscircle"
              size={windowWidth * 0.1}
              color="red"
              onPress={() => {
                if (newSaleDetail.quantity > 0) {
                  setNewSaleDetail({
                    ...newSaleDetail,
                    quantity: parseInt(newSaleDetail.quantity) - 1,
                  });
                }
              }}
            />
          </Pressable>

          <TextInput
            style={styles.input}
            value={newSaleDetail.quantity}
            onChangeText={(text) =>
              text == ""
                ? setNewSaleDetail({ ...newSaleDetail, quantity: 0 })
                : setNewSaleDetail({
                    ...newSaleDetail,
                    quantity: parseInt(text),
                  })
            }
            placeholder="0"
            keyboardType="numeric"
          />

          <Pressable
            onPress={() => {
              setNewSaleDetail({
                ...newSaleDetail,
                quantity: parseInt(newSaleDetail.quantity) + 1,
              });
            }}
          >
            <AntDesign
              name="pluscircle"
              size={windowWidth * 0.1}
              color="green"
            />
          </Pressable>
        </View>

        {selectedProduct.productUnit !=="UD" && (
            <View style={styles.addByPriceContainer}>
              <Pressable
                onPress={() => {
                  setIsAddByPriceVisible(!isAddByPriceVisible);
                  setNewSaleDetail({ ...newSaleDetail, quantity: 0 });
                  setPrice(0);
                }}
                style={styles.secondaryHeader}
              >
                <Text
                  style={[
                    styles.secondaryHeaderText,
                    isAddByPriceVisible && styles.selectedOptionText,
                  ]}
                >
                  Añadir por precio
                </Text>
              </Pressable>

              {isAddByPriceVisible && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={(text) =>
                      text == "" ? setPrice(0) : setPrice(parseFloat(text))
                    }
                    placeholder="$$$"
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>
          )}

        <Text style={styles.subtotalTitle}>SUBTOTAL</Text>
        <View style={styles.subtotalInfoContainer}>
          <Text style={styles.subtotalInfoText}>
            {newSaleDetail.unitPrice} x {newSaleDetail.quantity}{newSaleDetail.unit}
          </Text>
          <Text style={styles.subtotalInfoText}>${newSaleDetail.subtotal}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={() => setIsVisible(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable onPress={handleOnPress} style={styles.addButton}>
            <Text style={styles.addButtonText}>Añadir</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //body
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
    backgroundColor: "#ffcfa7",
    borderWidth: 1,
    borderColor: "#e8360e",
  },

  //main header
  header: {
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: windowWidth * 0.06,
    fontWeight: "900",
    color: "#fc4103",
  },

  // unit header
  secondaryHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    backgroundColor: "#ffac6e",
  },

  headerUnitButton: {
    padding: 8,
  },
  secondaryHeaderText: {
    fontSize: windowWidth * 0.05,
    fontWeight: "600",
    color: "#c92c05",
  },

  selectedOptionText: {
    color: "#fc4103",
  },

  //input styles
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //paddingHorizontal: 10,
    paddingVertical: 25,
  },

  input: {
    width: windowWidth * 0.5,
    borderRadius: 50,
    padding: 8,
    marginHorizontal: 20,
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#ff7e34",
  },

  //add by price header
  addByPriceContainer: {
    borderColor: "#ffac6e",
    borderWidth: 2,
  },

  addByPriceButton: {
    padding: 15,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F42B03",
    borderWidth: 1,
  },

  addByPriceButtonText: {
    fontSize: 20,
    color: "#fff",
  },

  //products/sale details

  subtotalTitle: {
    fontSize: windowWidth * 0.04,
    fontWeight: "800",
    color: "#a0230c",
    margin: 10,
  },

  subtotalInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fbbd8e",
  },

  subtotalInfoText: {
    fontSize: windowWidth * 0.045,
    fontWeight: "700",
    color: "#450d05",
  },

  // buttons
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },

  cancelButton: {
    borderWidth: 2,
    borderColor: "#ff5a0d",
    paddingVertical: 8,
    paddingHorizontal: windowWidth * 0.1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },

  cancelButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ff5a0d",
  },

  addButton: {
    backgroundColor: "#ff5a0d",
    paddingVertical: 8,
    paddingHorizontal: windowWidth * 0.13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },

  addButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
});

export default AddSaleDetailModal;
