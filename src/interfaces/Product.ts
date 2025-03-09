export interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    description?: string;
    images: [{
        id: string;
        filename: string;
    }];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductFormData {
    sku: string;
    name: string;
    price: number;
    description?: string;
    images?: FileList;
    existingImages?: [{
        id: string;
        filename: string;
    }];
  }