import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
