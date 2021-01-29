import connectDB from "../../../utils/connectDB";
import Categories from '../../../models/categoriesModel';
import Products from '../../../models/productModel';
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      await deleteCategory(req, res);
      break;
  }
};

const updateCategory = (req, res) => {
  try {
    const result = auth(req, res)
    if (result.role !== "admin") {
      return res.status(400).json({ error: "Authentication is not valid." })
    }

    const { id } = req.query
    const { name } = req.body
    const newCategory = await Categories.findOneAndUpdate({ _id: id }, { name })
    res.json({
      message: "SUccess ! Update a new category",
      category: {
        ...newCategory._doc,
        name
      }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const deleteCategory = (req, res) => {
  try {
    const result = auth(req, res)
    if (result.role !== "admin") {
      return res.status(400).json({ error: "Authentication is not valid." })
    }

    const { id } =req.query

    const products = await Products.findOne({ category: id })
    if (products) {
      return res.status(400).json({ error: "Please delete all products with a relationship" })
    }

    await Categories.findByIdAndDelete(id)
    res.json({ message: "Success ! Deleted a category" })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
