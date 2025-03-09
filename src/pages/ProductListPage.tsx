import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { productApi } from "../api/productApi";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { Product } from "../interfaces/Product";
import './ProductListPage.css'

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      await productApi.deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <Layout>
      <div className="product-list-container px-4 sm:px-6 lg:px-8">
        <div className="product-list-header sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="product-list-title text-xl font-semibold text-gray-900">Products</h1>
            
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/products/new"
              className="add-product-button inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Product
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex justify-center">
            <p className="product-list-loading text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 text-center">
            <p className="product-list-empty text-gray-500">No products found. Add your first product!</p>
          </div>
        ) : (
          <div className="product-list-grid mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDeleteProduct} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductListPage;