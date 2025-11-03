import React, { useState, createContext, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

const CartContext = createContext();
function useCart() { return useContext(CartContext); }

const sampleProducts = [
  {
    id: '1',
    title: 'MSI Raider GE78 HX',
    price: 2999.99,
    image: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5',
    description: 'PC Gamer ultra performant avec RTX 4090, i9-13980HX et écran QHD 240Hz. Design futuriste RGB.',
  },
  {
    id: '2',
    title: 'ASUS ROG Strix Scar 17',
    price: 2799.0,
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d8',
    description: 'Laptop gaming haut de gamme avec RTX 4080 et Ryzen 9. Éclairage RGB Aura Sync.',
  },
  {
    id: '3',
    title: 'Alienware M18',
    price: 3499.99,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d0',
    description: 'Grand écran 18”, refroidissement Cryo-tech, design premium et puissant pour gamers exigeants.',
  },
  {
    id: '4',
    title: 'Lenovo Legion 9i',
    price: 3199.0,
    image: 'https://images.unsplash.com/photo-1625772452857-1c5c7d83b89a',
    description: 'Performance extrême, refroidissement liquide, RTX 4090, i9 et châssis carbone.',
  },
];

function Header({ openCart, cartCount }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Elite PC Gaming Store</Text>
      <TouchableOpacity style={styles.cartButton} onPress={openCart}>
        <Text style={styles.cartText}>🛒 {cartCount}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProductCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price.toFixed(2)} €</Text>
    </TouchableOpacity>
  );
}

function HomeScreen({ openDetails }) {
  return (
    <FlatList
      data={sampleProducts}
      keyExtractor={(p) => p.id}
      numColumns={2}
      contentContainerStyle={{ padding: 8 }}
      renderItem={({ item }) => <ProductCard item={item} onPress={openDetails} />}
    />
  );
}

function DetailsModal({ visible, product, onClose }) {
  const { add } = useCart();
  const [qty, setQty] = useState('1');
  if (!product) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Image source={{ uri: product.image }} style={styles.detailImage} />
          <Text style={styles.detailTitle}>{product.title}</Text>
          <Text style={styles.detailPrice}>{product.price.toFixed(2)} €</Text>
          <Text style={styles.detailDesc}>{product.description}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Text style={{ color: '#fff' }}>Quantité: </Text>
            <TextInput
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              style={styles.qtyInput}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => { const q = parseInt(qty, 10) || 1; add(product, q); onClose(); }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>🛍️ Ajouter au panier</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#aaa' }}>Fermer</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function CartModal({ visible, onClose }) {
  const { cart, remove, clear, total, checkout } = useCart();
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
        <View style={{ padding: 16, flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 }}>Votre Panier</Text>
          {cart.length === 0 ? (
            <Text style={{ color: '#888' }}>Le panier est vide.</Text>
          ) : (
            <FlatList
              data={cart}
              keyExtractor={(it) => it.product.id}
              renderItem={({ item }) => (
                <View style={styles.cartRow}>
                  <Image source={{ uri: item.product.image }} style={styles.cartImage} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>{item.product.title}</Text>
                    <Text style={{ color: '#ccc' }}>{item.quantity} × {item.product.price.toFixed(2)} €</Text>
                  </View>
                  <TouchableOpacity onPress={() => remove(item.product.id)}>
                    <Text style={{ color: '#f55' }}>✖</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Total: {total().toFixed(2)} €</Text>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: '#00c851', marginTop: 16 }]}
            onPress={() => { if (cart.length === 0) return; checkout(); onClose(); }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>💳 Commander</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { clear(); }} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#aaa' }}>Vider le panier</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#888' }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function App() {
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [isCartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const add = (product, quantity = 1) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p.product.id === product.id);
      if (found) {
        return prev.map((p) => p.product.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { product, quantity }];
    });
  };

  const remove = (id) => setCartItems((prev) => prev.filter((p) => p.product.id !== id));
  const clear = () => setCartItems([]);
  const total = () => cartItems.reduce((s, it) => s + it.product.price * it.quantity, 0);
  const checkout = () => { clear(); };

  const cartContextValue = { cart: cartItems, add, remove, clear, total, checkout };

  return (
    <CartContext.Provider value={cartContextValue}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header openCart={() => setCartVisible(true)} cartCount={cartItems.length} />
        <HomeScreen openDetails={(p) => { setDetailsProduct(p); setDetailsVisible(true); }} />
        <DetailsModal visible={isDetailsVisible} product={detailsProduct} onClose={() => setDetailsVisible(false)} />
        <CartModal visible={isCartVisible} onClose={() => setCartVisible(false)} />
      </SafeAreaView>
    </CartContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  header: { height: 60, backgroundColor: '#1a1c22', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#222' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#00c3ff' },
  cartButton: { padding: 10, backgroundColor: '#00c3ff', borderRadius: 10 },
  cartText: { color: '#fff', fontWeight: '700' },
  card: { flex: 1, backgroundColor: '#1a1c22', margin: 8, borderRadius: 10, padding: 8, alignItems: 'center', shadowColor: '#00c3ff', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 } },
  cardImage: { width: 160, height: 120, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontWeight: '700', color: '#fff', fontSize: 14, textAlign: 'center' },
  cardPrice: { marginTop: 4, color: '#00c3ff', fontWeight: '600' },
  detailImage: { width: '100%', height: 240, borderRadius: 10, marginBottom: 10 },
  detailTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 6 },
  detailPrice: { fontSize: 20, color: '#00c3ff', marginBottom: 10 },
  detailDesc: { color: '#ccc', fontSize: 15, lineHeight: 22 },
  qtyInput: { borderWidth: 1, borderColor: '#333', color: '#fff', padding: 8, width: 80, marginLeft: 8, borderRadius: 8, backgroundColor: '#1a1c22', textAlign: 'center' },
  addButton: { backgroundColor: '#00c3ff', padding: 14, alignItems: 'center', borderRadius: 10, marginTop: 16, shadowColor: '#00c3ff', shadowOpacity: 0.4 },
  cartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#222' },
  cartImage: { width: 70, height: 50, borderRadius: 8 },
});