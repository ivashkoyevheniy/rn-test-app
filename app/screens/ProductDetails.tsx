import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configureStore";
import { Product } from "@/store/productSlice";

const ProductDetailScreen: React.FC = ({ route }: any) => {
  const { id } = route.params;
  const product = useSelector((state: RootState) =>
    state.products.items.find((item: Product) => item.id === id)
  );

  return (
    <View style={styles.container}>
      {product?.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View
          style={{
            ...styles.image,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ fontSize: 18 }}>No image</Text>
        </View>
      )}
      <Text style={styles.title}>{product?.title}</Text>
      <Text style={styles.price}>{product?.price} $</Text>
      <Text>{product?.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    textAlign: "center",
  },
  image: { width: 200, height: 200, marginBottom: 10 },
  title: { fontWeight: "bold", marginBottom: 10 },
  price: { marginBottom: 10 },
});

export default ProductDetailScreen;
