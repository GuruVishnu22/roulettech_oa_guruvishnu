import api from "../api";
import * as Components from "../components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const categoriesData = [
  { id: 1, name: "Category 1" },
  { id: 2, name: "Category 2" },
  { id: 3, name: "Category 3" },
  { id: 4, name: "Category 4" },
  { id: 5, name: "Category 5" },
];

function AddCategory() {
  const [categories, setCategories] = useState(categoriesData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories();
    setLoading(false);
  }, []);

  if (loading) return <Components.Loading />;

  const getCategories = async () => {
    try {

      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleAdd = async () => {
    try {
      const category = document.querySelector("input").value;
      if (!category) return toast.error("Category name is required");
      await api.post("/categories/", { name: category });
      setCategories([...categories, { name: category }]);
      toast.success("Category added successfully");
      document.querySelector("input").value = "";
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="row">
      <div className="col-lg-2 col-sm-12">
        <Components.Sidebar />
      </div>
      <div className="col-lg-10 col-sm-2">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Category Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Category Here..."
                  required
                />
              </td>
              <td>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add
                </button>
              </td>
            </tr>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddCategory;
