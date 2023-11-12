import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasChange } from "../api/api";

export const GlobalDataContext = createContext();

export const GlobarDataProvider = ({ children }) => {
  const API_URL = "http://192.168.100.152:3000/api";
  const { userData, token } = useContext(AuthContext);

  const [selectedHeaderOption, setSelectedHeaderOption] = useState("details");
  const [selectedProduct, setSelectedProduct] = useState();
  const [saleDetails, setSaleDetails] = useState([]);
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([])
  const [haveChange, setHaveChange] = useState(false)

  useEffect(() => {
    getProducts();
    getSales();
    getSuppliers();
    getCategories();
    getUsers();
  }, [token, userData, haveChange]);

  const getProducts = async () => {
    try {
      const response = await axios(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setCategories(response.data, token);

    } catch (error) {
      console.log(error);
    }
  }

  const getSuppliers = async () => {
    try {
      const response = await axios(`${API_URL}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setSuppliers(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const getSales = async () => {
    try {
      if (!userData) {
        console.log("no hay info del usuario");
        return;
      }

      let url = API_URL;

      if (userData.role === "Administrador") {
        url += "/sales";
      } else {
        url += `/sales/user/${userData.userID}`;
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

  const getUsers = async () => {
    if (userData.role === "Empleado") return

    try {
      const response = await axios(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <GlobalDataContext.Provider
      value={{
        sales,
        users,
        products,
        suppliers,
        categories,
        haveChange, 
        saleDetails,
        setSaleDetails,
        setHaveChange,
        selectedProduct,
        setSelectedProduct,
        selectedHeaderOption,
        setSelectedHeaderOption,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};


