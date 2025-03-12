import { useState, useEffect } from "react";
import { listCategories } from "../services/listCategory";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        setCategories(data.results || []);
      } catch (error) {
        console.error("❌ Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return "SIN CATEGORÍA";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name.toUpperCase() : "SIN CATEGORÍA";
  };

  return { categories, getCategoryName };
};

export default useFetchCategories;