import productModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    const product = await productModel.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl: imageUrl || "",
      user: req.user._id
    });

    return res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      productModel
        .find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      productModel.countDocuments(query)
    ]);

    return res.status(200).json({
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id).populate("user", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting product" });
  }
};
