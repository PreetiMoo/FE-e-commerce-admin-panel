import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { productApi } from "../api/productApi";
import Layout from "../components/Layout";
import { Product, ProductFormData } from "../interfaces/Product";
import './ProductFormPage.css'

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  
  const isEditMode = !!id;
  
  const validationSchema = Yup.object({
    sku: Yup.string().required("SKU is required"),
    name: Yup.string().required("Name is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive")
      .typeError("Price must be a number"),
    description: Yup.string(),
  });
  
  const formik = useFormik<ProductFormData>({
    initialValues: {
      sku: "",
      name: "",
      price: 0,
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        if (isEditMode && product) {
          await productApi.updateProduct(id, values);
          toast.success("Product updated successfully");
        } else {
          await productApi.createProduct(values);
          toast.success("Product created successfully");
        }
        
        navigate("/products");
      } catch (error) {
        console.error("Failed to save product:", error);
        toast.error("Failed to save product");
      } finally {
        setLoading(false);
      }
    },
  });
  
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await productApi.getProductById(id);
          setProduct(data);
          
          formik.setValues({
            sku: data.sku,
            name: data.name,
            price: data.price,
            description: data.description || "",
            existingImages: data.images,
          });
          
          setImagePreview(data.images.map(img => {
            return `http://localhost:5000/uploads/${img.filename}`
          } ));
        } catch (error) {
          console.error("Failed to fetch product:", error);
          toast.error("Failed to load product data");
          navigate("/products");
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        newPreviews.push(URL.createObjectURL(files[i]));
      }
      
      setImagePreview([...imagePreview, ...newPreviews]);
      formik.setFieldValue("images", files);
    }
  };
  
  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = [...(formik.values.existingImages || [])];
    updatedImages.splice(index, 1);
    
    const updatedPreviews = [...imagePreview];
    updatedPreviews.splice(index, 1);
    
    formik.setFieldValue("existingImages", updatedImages);
    setImagePreview(updatedPreviews);
  };
  
  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {isEditMode
                ? "Update product information and images"
                : "Add a new product to your store"}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        id="sku"
                        value={formik.values.sku}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formik.touched.sku && formik.errors.sku ? "border-red-500" : ""
                        }`}
                      />
                      {formik.touched.sku && formik.errors.sku && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.sku}</p>
                      )}
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formik.touched.name && formik.errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                      )}
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (Rs.)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        id="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formik.touched.price && formik.errors.price ? "border-red-500" : ""
                        }`}
                      />
                      {formik.touched.price && formik.errors.price && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.price}</p>
                      )}
                    </div>
                    
                    <div className="col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Product Images</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add multiple images for the product.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div>
                    
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="images"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              multiple
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  
                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Uploaded Images</h4>
                      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {imagePreview.map((src, index) => (
                          <div key={index} className="relative">
                            <div className="group aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden">
                              <img
                                src={src}
                                alt={`Preview ${index}`}
                                className="image-preview object-center object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExistingImage(index)}
                                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                <svg
                                    className="h-5 w-5 text-red-700"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                                </svg>

                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formik.isValid}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProductFormPage;