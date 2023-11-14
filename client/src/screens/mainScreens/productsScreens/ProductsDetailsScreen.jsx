import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext.jsx";
import ProductInput from "../../../components/mainComponents/ProductInput.jsx";
import NonProductImage from "../../../../assets/boxesImage.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Dropdown from "../../../components/mainComponents/Dropdown.jsx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../../../contexts/AuthContext.jsx";
import { createProduct, updateProduct } from "../../../api/api.js";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ProductsDetailsScreen = ({ route }) => {
  const { userData, token, setIsLoading } = useContext(AuthContext);
  const { suppliers, categories, haveChange, setHaveChange } =
    useContext(GlobalDataContext);

  const navigation = useNavigation();

  const productInfo = route.params.productInfo || {};

  const defaultFormData = {
    productName: "",
    productDescription: "",
    productUnit: "",
    productPrice: "",
    productStock: "",
    productPhoto: "",
    supplierID: "",
    categoryID: "",
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const [errors, setErrors] = useState({
    nameError: "",
    descriptionError: "",
    stockError: "",
    priceError: "",
    unitError: "",
    categoryError: "",
    supplierError: "",
  });

  const [formData, setFormData] = useState(
    productInfo
      ? { ...defaultFormData, ...productInfo }
      : { ...defaultFormData }
  );

  const units = [
    { key: "UD", value: "UD" },
    { key: "KG", value: "KG" },
    { key: "L", value: "L" },
  ];

  let currentSupplierName = "";
  const supplierData = suppliers.map((supplier) => {
    if (supplier.supplierID == formData.supplierID) {
      currentSupplierName = supplier.supplierName;
    }
    return {
      key: supplier.supplierID,
      value: supplier.supplierName,
    };
  });

  let currentCategoryName = "";
  const categoryData = categories.map((category) => {
    if (category.categoryID == formData.categoryID) {
      currentCategoryName = category.categoryName;
    }
    return {
      key: category.categoryID,
      value: category.categoryName,
    };
  });

  const handleErrors = () => {
    const {
      productName,
      productDescription,
      productUnit,
      productPrice,
      productStock,
      supplierId,
      categoryId,
    } = formData;

    let hasError = false;

    const newErrors = {};

    if (!productName || productName.length < 4) {
      newErrors.nameError = "El nombre debe tener al menos 4 caracteres.";
      hasError = true;
    }

    if (!productDescription || productDescription.length < 6) {
      newErrors.descriptionError =
        "La descripción debe tener al menos 6 caracteres.";
      hasError = true;
    }

    if (
      !productStock ||
      isNaN(parseInt(productStock, 10)) ||
      parseInt(productStock, 10) <= 0
    ) {
      newErrors.stockError = "La cantidad debe ser un número mayor que 0.";
      hasError = true;
    }

    if (
      !productPrice ||
      isNaN(parseFloat(productPrice)) ||
      parseFloat(productPrice) <= 0
    ) {
      newErrors.priceError = "El precio debe ser un número mayor que 0.";
      hasError = true;
    }

    if (!productUnit) {
      newErrors.unitError = "Seleccione una unidad.";
      hasError = true;
    }

    setErrors(newErrors);

    return hasError;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setFormData({ ...formData, productPhoto: result.uri });
    }
  };

  const handleOnPress = async () => {
    const hasErrors = handleErrors();

    if (hasErrors) return;

    if (route.params.originScreen === "addProduct") {
      await createProduct(formData, token, setIsLoading, navigation);
      setHaveChange(!haveChange);
      navigation.goBack();
    } else {
      await updateProduct(
        productInfo.productID,
        formData,
        token,
        setIsLoading,
        navigation
      );
      setHaveChange(!haveChange);
    }
  };
  console.log(formData.productPhoto);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        behavior="padding"
        showsHorizontalScrollIndicator={false}
        enabled
      >
        <View style={styles.header}>
          <Image
            source={
              formData.productPhoto
                ? { uri: formData.productPhoto }
                : NonProductImage // Si no hay ninguna imagen, muestra la imagen predeterminada
            }
            style={[
              styles.image,
              !productInfo.productPhoto && !selectedImage
                ? { resizeMode: "cover" }
                : null,
            ]}
          />

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="camera-outline"
              size={windowWidth * 0.1}
              color="#fff"
              style={styles.cameraIcon}
              onPress={pickImage}
            />
          </View>
        </View>

        <View style={styles.form}>
          <ProductInput
            value={formData.productName}
            desc={"Nombre del producto"}
            label={"Nombre"}
            setValue={(text) => {
              setFormData({ ...formData, productName: text });
            }}
            icon={"box"}
          />
          <Text style={styles.errorText}>{errors.nameError}</Text>

          <ProductInput
            value={formData.productDescription}
            desc={"Descripción del producto"}
            label={"Descripcion"}
            setValue={(text) => {
              setFormData({ ...formData, productDescription: text });
            }}
            icon={"file-text"}
          />
          <Text style={styles.errorText}>{errors.descriptionError}</Text>

          <ProductInput
            value={formData.productStock}
            desc={"Cantidad del Producto"}
            label={"Cantidad"}
            setValue={(text) => {
              setFormData({ ...formData, productStock: text });
            }}
            icon={"database"}
          />
          <Text style={styles.errorText}>{errors.stockError}</Text>

          <ProductInput
            value={formData.productPrice}
            label={"Precio"}
            setValue={(text) => {
              setFormData({ ...formData, productPrice: text });
            }}
            icon={"dollar-sign"}
          />
          <Text style={styles.errorText}>{errors.priceError}</Text>

          <Dropdown
            data={units}
            currentValue={formData.productUnit}
            selectedValue={formData.productUnit}
            setSelectedValue={(val) =>
              setFormData({ ...formData, productUnit: val })
            }
            icon={"underline"}
            label={"Unidad"}
          />
          <Text style={styles.errorText}>{errors.unitError}</Text>

          <Dropdown
            data={categoryData}
            currentValue={currentCategoryName}
            selectedValue={formData.categoryID}
            setSelectedValue={(val) =>
              setFormData({ ...formData, categoryID: parseInt(val) })
            }
            icon={"user"}
            label={"Categoria"}
          />
          <Text style={styles.errorText}>{errors.categoryError}</Text>

          <Dropdown
            data={supplierData}
            currentValue={currentSupplierName}
            selectedValue={formData.supplierID}
            setSelectedValue={(val) =>
              setFormData({ ...formData, supplierID: val })
            }
            icon={"user"}
            label={"Proveedor"}
          />
          <Text style={styles.errorText}>{errors.supplierError}</Text>
        </View>
      </KeyboardAwareScrollView>
      {userData.role === "Administrador" && (
        <Pressable
          onPress={handleOnPress}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.saveButtonText}>
            {route.params.originScreen === "addProduct" ? "Añadir" : "Guardar"}
          </Text>
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
  header: {
    backgroundColor: "#ffcda8",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: windowHeight * 0.3,
  },
  form: {
    marginBottom: 50,
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: -20,
    right: 10,
    backgroundColor: "#ff6600",
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    borderRadius: windowWidth * 0.075,
  },
  saveButton: {
    position: "absolute",
    bottom: 10,
    width: "90%",
    height: windowHeight * 0.045,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#ff6600",
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default ProductsDetailsScreen;
