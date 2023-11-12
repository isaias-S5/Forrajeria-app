import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importa un icono de Material Icons
import { GlobalDataContext } from "../../../contexts/GlobalDataContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { createCategory, deleteCategory, updateCategory } from "../../../api/api";

const CategoriesScreen = () => {
  const { userData, token } = useContext(AuthContext);
  const { categories, haveChange, setHaveChange } = useContext(GlobalDataContext);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Función para agregar una categoría
  const addCategory = async () => {
    if (categoryName) {
      await createCategory(categoryName, token)
      setHaveChange(!haveChange);
      setCategoryName("");
    }
  };

  // Función para editar una categoría seleccionada
  const editCategory = async () => {
    if (categoryName && selectedCategory !== null) {
      await updateCategory(selectedCategory, categoryName, token)
      setHaveChange(!haveChange);
      setCategoryName("");
      setSelectedCategory(null);
    }
  };

  // Función para borrar una categoría
  const deleteOneCategory = async (id) => {
    console.log(id)
    await deleteCategory(id, token)
    setHaveChange(!haveChange);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías</Text>
      </View>

      {userData.role == "Administrador" && (
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="Nombre de la categoría"
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />
          <Pressable
            style={styles.addButton}
            onPress={selectedCategory !== null ? editCategory : addCategory}
          >
            <Text style={styles.buttonText}>
              {selectedCategory !== null ? "Editar" : "Agregar"}
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <View style={styles.categoryItem} key={index}>
            <Text
              style={styles.categoryNameText}
              onPress={() => {
                setCategoryName(category.categoryName);
                setSelectedCategory(category.categoryID);
              }}
            >
              {category.categoryName}
            </Text>
            {userData.role == "Administrador" && (
              <MaterialIcons
                name="cancel"
                size={24}
                color="#cc1602"
                onPress={() => deleteOneCategory(category.categoryID)}
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
  categoriesContainer: {
    padding: 20,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fbda8c",
    padding: 15,
    borderRadius: 10,
  },
  categoryNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

export default CategoriesScreen;
