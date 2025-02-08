import { productSchema } from "../models/products.js";

class ProductService {
  async getProductById(userId) {
    const product = await productService.findById(userId).select();
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getAllProducts() {
    const users = await productSchema.find().select("-password");
    if (!users.length) {
      throw new Error("No products found");
    }
    return users;
  }

  async addProduct(productDTO) {
    return await productSchema.create(productDTO);
  }
}

export const productService = new ProductService();
