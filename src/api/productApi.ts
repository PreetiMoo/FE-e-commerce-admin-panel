import axios from "axios";
import { Product, ProductFormData } from "../interfaces/Product";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const productApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    formData.append("sku", productData.sku);
    formData.append("name", productData.name);
    formData.append("price", productData.price.toString());
    
    if (productData.description) {
      formData.append("description", productData.description);
    }
    
    if (productData.images) {
      for (let i = 0; i < productData.images.length; i++) {
        formData.append("images", productData.images[i]);
      }
    }
    
    const response = await axiosInstance.post("/products/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  },

  updateProduct: async (id: string, productData: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    formData.append("sku", productData.sku);
    formData.append("name", productData.name);
    formData.append("price", productData.price.toString());
    
    if (productData.description) {
      formData.append("description", productData.description);
    }
    
    if (productData.existingImages) {
      formData.append("existingImages", JSON.stringify(productData.existingImages));
    }
    
    if (productData.images) {
      for (let i = 0; i < productData.images.length; i++) {
        formData.append("images", productData.images[i]);
      }
    }
    
    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};