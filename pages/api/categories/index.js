import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCategory(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

const createCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin") {
      return res.status(400).json({ error: "Authentication is not valid." });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name can not be left blank." });
    }

    const newCategory = new Categories({ name });
    await newCategory.save();
    res.json({
      message: "Success ! Created a new category.",
      newCategory,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    res.json({ categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
