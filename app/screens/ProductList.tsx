import React, { useEffect } from "react";
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProducts } from "@/store/productSlice";
import { useAppSelector as useSelector } from "@/hooks/useSelector";
import { useAppDispatch as useDispatch } from "@/hooks/useDispatch";

type RootStackParamList = {
  ProductDetails: { id: string; title: string };
  AddProduct: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "ProductDetails">;

type ItemData = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

type ItemProps = {
  item: ItemData;
};

const ProductList: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.products?.items);

  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = await AsyncStorage.getItem("products");
      if (storedProducts) {
        dispatch({
          type: "products/setProducts",
          payload: JSON.parse(storedProducts),
        });
      } else {
        dispatch(fetchProducts());
      }
    };
    loadProducts();
  }, [dispatch]);

  const Item: React.FC<ItemProps> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetails", {
            id: item.id,
            title: item.title,
          })
        }
        style={[styles.item]}
      >
        <View style={{ flexDirection: "row" }}>
          {item?.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: 50, height: 50 }}
            />
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
              <Text style={{ fontSize: 10 }}>No image</Text>
            </View>
          )}
          <View style={{ marginLeft: 10, flexShrink: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.price} $</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: ItemData }) => <Item item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Add product"
        onPress={() => navigation.navigate("AddProduct")}
      />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  image: { width: 50, height: 50 },
  title: {
    fontSize: 32,
  },
});

export default ProductList;
