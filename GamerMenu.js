import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import DetailsModal from "./components/DetailsModal";
import CartModal from "./components/CartModal";

// ---------------------------
// CART CONTEXT
// ---------------------------
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function App() {
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [isCartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // ---------------------------
  // CART ACTIONS
  // ---------------------------
  const add = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.product.id === product.id);

      return existing
        ? prev.map((p) =>
            p.product.id === product.id
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
        : [...prev, { product, quantity }];
    });
  }, []);

  const remove = useCallback((id) => {
    setCartItems((prev) => prev.filter((p) => p.product.id !== id));
  }, []);

  const clear = useCallback(() => setCartItems([]), []);

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const checkout = useCallback(() => {
    clear();
  }, [clear]);

  // Memoized context to avoid re-renders
  const cartContextValue = useMemo(
    () => ({
      cart: cartItems,
      add,
      remove,
      clear,
      total,
      checkout,
    }),
    [cartItems, add, remove, clear, total, checkout]
  );

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const openDetails = useCallback((item) => {
    setDetailsProduct(item);
    setDetailsVisible(true);
  }, []);

  const closeDetails = useCallback(() => setDetailsVisible(false), []);
  const openCart = useCallback(() => setCartVisible(true), []);
  const closeCart = useCallback(() => setCartVisible(false), []);

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <CartContext.Provider value={cartContextValue}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Header cartCount={cartItems.length} openCart={openCart} />

        <HomeScreen openDetails={openDetails} />

        <DetailsModal
          visible={isDetailsVisible}
          product={detailsProduct}
          onClose={closeDetails}
        />

        <CartModal visible={isCartVisible} onClose={closeCart} />
      </SafeAreaView>
    </CartContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },
});
