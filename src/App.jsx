import React, { createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Products from "./pages/Product";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./layouts/MainLayout";
import ProductDetails from "./pages/ProductDetails";

export const TokenContext = createContext("");
export const UserContext = createContext("");

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <TokenContext.Provider value={{ token, setToken }}>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/product-details/:id"
              element={
                <MainLayout>
                  <ProductDetails />
                </MainLayout>
              }
            />
            <Route
              path="/about"
              element={
                <MainLayout>
                  <About />
                </MainLayout>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/cart"
              element={
                <MainLayout>
                  <Cart />
                </MainLayout>
              }
            />
            <Route
              path="/products"
              element={
                <MainLayout>
                  <Products />
                </MainLayout>
              }
            />
            {token && (
              <>
                <Route
                  path="/checkout"
                  element={
                    <MainLayout>
                      <Checkout />
                    </MainLayout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <MainLayout>
                      <Orders />
                    </MainLayout>
                  }
                />
              </>
            )}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </TokenContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
