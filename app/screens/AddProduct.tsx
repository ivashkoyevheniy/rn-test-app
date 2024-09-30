import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch as useDispatch } from "@/hooks/useDispatch";

interface FormValues {
  title: string;
  price: string;
  description: string;
}

interface FormActions {
  setErrors: (errors: object) => void;
}

interface Styles {
  inputContainer: ViewStyle;
  label: TextStyle;
  input: ViewStyle;
  helpText: TextStyle;
  title: TextStyle;
}

const productSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  price: Yup.number()
    .typeError("Must be a number")
    .required("Price is required")
    .positive(),
  description: Yup.string().required("Description is required"),
});

type AddProductScreenProps = NativeStackScreenProps<any, "AddProduct">;

const AddProductScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values: FormValues, actions: FormActions) => {
    const newProduct = {
      id: Date.now().toString(),
      ...values,
    };

    productSchema
      .validate(newProduct, { abortEarly: false })
      .then(async function () {
        try {
          const storedProducts = await AsyncStorage.getItem("products");
          const products = storedProducts ? JSON.parse(storedProducts) : [];
          products.push(newProduct);
          await AsyncStorage.setItem("products", JSON.stringify(products));
          dispatch({ type: "products/addProduct", payload: newProduct });
          navigation.navigate("ProductList");
        } catch (error) {
          console.error("Error saving product:", error);
        }
      })
      .catch(function (err) {
        interface Errors {
          [key: string]: string;
        }
        const errors: Errors = {};
        err.inner.forEach(
          (e: { path: string; message: string }) => (errors[e.path] = e.message)
        );

        actions.setErrors(errors);
      });
  };

  return (
    <Formik
      initialValues={{ title: "", price: "", description: "" }}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
      }: FormikProps<FormValues>) => (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product title</Text>
            <TextInput
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              style={{
                ...styles.input,
                ...(errors.title ? { borderColor: "#dc3545" } : {}),
              }}
            />
            {errors.title && (
              <Text style={styles.helpText}>{errors.title}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              onChangeText={handleChange("price")}
              onBlur={handleBlur("price")}
              value={values.price}
              style={{
                ...styles.input,
                ...(errors.price ? { borderColor: "#dc3545" } : {}),
              }}
              keyboardType="numeric"
            />
            {errors.price && (
              <Text style={styles.helpText}>{errors.price}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product description</Text>
            <TextInput
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              value={values.description}
              style={{
                ...styles.input,
                ...(errors.description ? { borderColor: "#dc3545" } : {}),
              }}
            />
            {errors.description && (
              <Text style={styles.helpText}>{errors.description}</Text>
            )}
          </View>
          <Button onPress={handleSubmit as () => void} title="Add product" />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create<Styles>({
  inputContainer: { marginVertical: 10 },
  label: { marginBottom: 5 },
  input: {
    borderColor: "#dee2e6",
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    padding: 5,
  },
  helpText: { color: "#dc3545" },
  title: { fontWeight: "bold" },
});

export default AddProductScreen;
