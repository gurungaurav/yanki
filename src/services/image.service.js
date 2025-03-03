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

  async deleteImage(imageId) {
    console.log(imageId, "assas");

    const image = await imageSchema.findOneAndDelete({ _id: imageId });
    return !!image;
  }
}

export const imageService = new ImageService();
