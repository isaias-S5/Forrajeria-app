import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "../../../api/api";

const SuppliersScreen = () => {
  const { userData, token } = useContext(AuthContext);
  const { suppliers, haveChange, setHaveChange } =
    useContext(GlobalDataContext);

  const [formData, setFormData] = useState({
    supplierName: "",
    supplierPhone: "",
    supplierEmail: "",
  });

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const addSupplier = async () => {
    if (
      formData.supplierName &&
      formData.supplierPhone &&
      formData.supplierEmail
    ) {
      await createSupplier(formData, token);
      setHaveChange(!haveChange);
      clearSupplierForm();
    }
  };

  const editSupplier = async () => {
    if (
      formData.supplierName &&
      formData.supplierPhone &&
      formData.supplierEmail &&
      selectedSupplier !== null
    ) {
      await updateSupplier(selectedSupplier, formData, token);
      setHaveChange(!haveChange);
      clearSupplierForm();
    }
  };

  const deleteOneSupplier = async (id) => {
    await deleteSupplier(id, token);
    setHaveChange(!haveChange);
  };

  const clearSupplierForm = () => {
    setFormData({
      supplierName: "",
      supplierPhone: "",
      supplierEmail: "",
    });
    setSelectedSupplier(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Proveedores</Text>
      </View>

      {userData.role == "Administrador" && (
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="Nombre del proveedor"
            value={formData.supplierName}
            onChangeText={(text) =>
              setFormData({ ...formData, supplierName: text })
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Teléfono del proveedor"
            value={formData.supplierPhone}
            onChangeText={(text) =>
              setFormData({ ...formData, supplierPhone: text })
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email del proveedor"
            value={formData.supplierEmail}
            onChangeText={(text) =>
              setFormData({ ...formData, supplierEmail: text })
            }
          />
          <Pressable
            style={styles.addButton}
            onPress={selectedSupplier !== null ? editSupplier : addSupplier}
          >
            <Text style={styles.buttonText}>
              {selectedSupplier !== null ? "Editar" : "Agregar"}
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView style={styles.suppliersContainer}>
        {suppliers.map((supplier, index) => (
          <View style={styles.supplierItem} key={index}>
            <View style={styles.supplierInfo}>
              <Text
                style={styles.supplierNameText}
                onPress={() => {
                  setFormData({
                    supplierName: supplier.supplierName,
                    supplierPhone: supplier.supplierPhone,
                    supplierEmail: supplier.supplierEmail,
                  });
                  setSelectedSupplier(supplier.supplierID);
                }}
              >
                {supplier.supplierName}
              </Text>
              <Text style={styles.supplierAdditionalInfo}>
                Teléfono: {supplier.supplierPhone}
              </Text>
              <Text style={styles.supplierAdditionalInfo}>
                Email: {supplier.supplierEmail}
              </Text>
            </View>
            {userData.role == "Administrador" && (
              <MaterialIcons
                name="cancel"
                size={24}
                color="#cc1602"
                onPress={() => deleteOneSupplier(supplier.supplierID)}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9eb",
  },
  header: {
    backgroundColor: "#FFA65D",
    minHeight: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#821f0c",
  },
  form: {
    margin: 20,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#ff7b37",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  suppliersContainer: {
    padding: 20,
  },
  supplierItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fbda8c",
    padding: 15,
    borderRadius: 10,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  supplierAdditionalInfo: {
    fontSize: 14,
    color: "#666",
  },
});

export default SuppliersScreen;
