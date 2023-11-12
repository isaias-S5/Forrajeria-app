import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import Navigation from "./src/routes/navigation";
import Toast from "react-native-toast-message";
import { GlobarDataProvider } from "./src/contexts/GlobalDataContext";

export default function App() {
  return (
    <AuthProvider>
      <GlobarDataProvider>
        <Navigation />
        <Toast />
      </GlobarDataProvider>
    </AuthProvider>
  );
}
