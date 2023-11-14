import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = "http://192.168.100.152:3000/api";

export const getSalesByDate = async (userData, token, setSales, dates) => {
  try {
    if (!userData) {
      console.log("No hay información del usuario");
      return;
    }

    let url = "http://192.168.100.152:3000/api";

    if (userData.role === "Administrador") {
      url += `/salesdate?startDate=${dates.startDate}&endDate=${dates.endDate}`;
    } else {
      url += `/salesdate/user/${userData.userID}?startDate=${dates.startDate}&endDate=${dates.endDate}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSales(response.data);
  } catch (error) {
    console.log(error);
  }
};

export const createSale = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/sales`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });

      return;
    }

    Toast.show({
      type: "success",
      text1: "Venta agregada",
      text2: "La venta ha sido agregada correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  } catch (error) {
    console.log("Error al agregar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const updateSale = async (id, data, token, products = []) => {
  try {
    const response = await axios.patch(`${API_URL}/sales/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    products.length === 0 && updateStockFromSaleDetails(id, token, products);

    Toast.show({
      type: "success",
      text1: "Venta modificada",
      text2: "La venta ha sido modificada correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

export const getSaleDetails = async (id, token, setSalesDetails) => {
  const response = await axios.get(`${API_URL}/sales/${id}/saleDetails`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.error) return null;

  setSalesDetails(response.data);
  console.log(response.data);
};

export const updateStockFromSaleDetails = async (id, token, products) => {
  const response = await axios.get(`${API_URL}/sales/${id}/saleDetails`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.error) return;

  const details = response.data;

  details.map((detail) => {
    products.map((product) => {
      if (detail.productID == product.productID) {
        let quantityToAdd = 0;

        console.log(detail.quantity, product.productStock);

        if (detail.unit === "G" || detail.unit === "ML") {
          quantityToAdd = detail.quantity / 1000;
        } else if (detail.unit === "KG") {
          quantityToAdd = detail.quantity;
        } else {
          quantityToAdd = detail.quantity;
        }
        const newQuantity =
          parseFloat(product.productStock) + parseFloat(quantityToAdd);

        console.log(newQuantity);

        updateProduct(product.productID, { productStock: newQuantity }, token);
      }
    });
  });
};

export const deleteSale = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/sales/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Venta eliminado",
      text2: "La venta ha sido eliminada correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al eliminar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const deleteDetail = async (saleID, detailID, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/sales/${saleID}/saleDetails/${detailID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Detalle eliminado",
      text2: "El detalle ha sido eliminado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al eliminar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const createDetail = async (saleID, data, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/sales/${saleID}/saleDetails`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Detalle agregado",
      text2: "El detalle ha sido agregado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al agregar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message,
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};


//PRODUCTS REQUEST

export const createProduct = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/products`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Producto agregado",
      text2: "El producto ha sido agregado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al agregar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    const response = await axios.patch(`${API_URL}/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Producto actualizado",
      text2: "El producto ha sido actualizado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al actualizar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/${id}`,
      {
        deleted: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Producto eliminado",
      text2: "El producto ha sido eliminado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al eliminar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};


//CATEGORY REQUEST

export const createCategory = async (name, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/categories`,
      {
        categoryName: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Categoria agregada",
      text2: "La categoria ha sido agregadA correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al agregar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message,
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const updateCategory = async (id, name, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/categories/${id}`,
      {
        categoryName: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Producto actualizado",
      text2: "La categoria ha sido actualizada correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al actualizar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Categoria eliminada",
      text2: "La categoria ha sido eliminada correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al eliminar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

// SUPPLIER REQUESTS

export const createSupplier = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/suppliers`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Proveedor agregado",
      text2: "El proveedor ha sido actualizado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  } catch (error) {
    console.log("Error al agregar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message,
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const updateSupplier = async (id, data, token) => {
  try {
    const response = await axios.patch(`${API_URL}/suppliers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Proveedor actualizado",
      text2: "El proveedor ha sido actualizado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al actualizar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const deleteSupplier = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/suppliers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Venta eliminado",
      text2: "El proveedor ha sido eliminado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });

    return;
  } catch (error) {
    console.log("Error al eliminar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};


//USERS REQUEST

export const updateUser = async (id, data, token, isdeliting = false) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    if (isdeliting) {
      Toast.show({
        type: "success",
        text1: "Usuario eliminado",
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Usuario actualizado",
      text2: "El usuario ha sido actualizado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
    return;
  } catch (error) {
    console.log("Error al actualizar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};

export const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      Toast.show({
        type: "error",
        text1: "Error en la solicitud",
        text2: response.data.error,
        position: "top",
        autoHide: true,
        hideAfter: 3000,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Usuario eliminado",
      text2: "El usuario ha sido eliminado correctamente",
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
    return;
  } catch (error) {
    console.log("Error al eliminar:", error);
    Toast.show({
      type: "error",
      text1: "Error en la solicitud",
      text2: error.message, 
      position: "top",
      autoHide: true,
      hideAfter: 3000,
    });
  }
};
