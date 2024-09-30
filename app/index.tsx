import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductList from "./screens/ProductList";
import ProductDetailScreen from "./screens/ProductDetails";
import { store } from "@/store/configureStore";
import { Provider } from "react-redux";
import AddProductScreen from "./screens/AddProduct";

type RootStackParamList = {
  ProductList: undefined;
  ProductDetails: { title: string };
  AddProduct: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={{ title: "Product List" }}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailScreen}
            options={({ route }) => ({
              title: `${route?.params.title}`,
              animation: "slide_from_right",
            })}
          />
          <Stack.Screen
            name="AddProduct"
            options={{ title: "Add Product" }}
            component={AddProductScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
