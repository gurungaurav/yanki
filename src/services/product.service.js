import { categorySchema } from "../models/category.js";
import { imageSchema } from "../models/image.js";
import { productSchema } from "../models/products.js";

class ProductService {
  async getProductById(productId) {
    const product = await productSchema
      .findOne({ _id: productId, isDeleted: false })
      .lean();

    if (!product) {
      throw new Error("Product not found");
    }
    const category = await categorySchema
      .findOne({ _id: product.categoryId })
      .select("name");

    const images = await imageSchema.find({ productId }).select("imageUrl");

    return { ...product, category, images };
  }

  async getProducts(filter) {
    const products = await productSchema.find(filter).lean();

    const productList = await Promise.all(
      products.map((product) => this.getProductById(product._id))
    );

    console.log(productList);

    return productList;
  }

  async addProduct(productDTO) {
    return await productSchema.create(productDTO);
  }

  async softDeleteProduct(productId) {
    const product = await productSchema.findOneAndUpdate(
      { _id: productId },
      { isDeleted: true },
      { new: true }
    );

    return !!product;
  }

  //Create product update

  async updateProduct(productId, updatedData) {
    const product = await productSchema.findOneAndUpdate(
      productId,
      updatedData,
      { new: true }
    );
    return product;
  }
}

export const productService = new ProductService();
