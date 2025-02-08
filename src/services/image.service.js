import { imageSchema } from "../models/image.js";

class ImageService {
  async getAllimages(productId) {
    const images = await imageSchema.find(productId).select();
    if (!images.length) {
      throw new Error("No imaages found");
    }
    return images;
  }

  async addImage(imageDTO) {
    return await imageSchema.create(imageDTO);
  }
}

export const imageService = new ImageService();
