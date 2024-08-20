import { useForm, Controller } from "react-hook-form";
import * as Components from "../components";
import api from "../api";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import Select from "react-select";

function AddItem() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const getTags = async () => {
    try {
      const { data } = await api.get("/tags");
      setTags(data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    }
  };

  const addItem = async (data) => {
    try {
      data.tags = data.tags.map((tag) => tag.value);
      data.category = { id: data.category_id };
      // delete data.category_id;
      await api.post("/items/add", data);
      toast.success("Item added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add item");
    }
  };

  useEffect(() => {
    getCategories();
    getTags();
  }, []);

  const isMobile = window.innerWidth < 768;

  return (
    <div className="row">
      <div className="col-lg-2">
        <Components.Sidebar />
      </div>
      <div className="col-lg-10 col-sm-2">
        <div className="d-flex justify-content-center align-items-center">
          <div className={`card border-info w-${isMobile ? "100" : "50"} mt-5`}>
            <div className="card-header">
              <h2 className="text-center fw-light">Add Item</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(addItem)}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SKU Here..."
                  {...register("sku", { required: true })}
                />
                {errors.sku && (
                  <span className="text-danger">This field is required</span>
                )}
                <input
                  type="text"
                  className="form-control my-2"
                  placeholder="Enter Name Here..."
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <span className="text-danger">This field is required</span>
                )}
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Stock Here..."
                  {...register("stock", { required: true })}
                />
                {errors.stock && (
                  <span className="text-danger">This field is required</span>
                )}
                <input
                  type="number"
                  className="form-control my-2"
                  placeholder="Enter Total Stock Here..."
                  {...register("available_stock", { required: true })}
                />
                {errors.available_stock && (
                  <span className="text-danger">This field is required</span>
                )}
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={categories.find((c) => c.name === field.value)}
                      onChange={(v) => field.onChange(v.value)}
                      options={categories.map((category) => {
                        return { value: category.id, label: category.name };
                      })}
                    />
                  )}
                  rules={{ required: true }}
                />
                {errors.category_id && (
                  <span className="text-danger">This field is required</span>
                )}

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="my-2"
                      {...field}
                      options={tags.map((tag) => {
                        return { value: tag.id, label: tag.name };
                      })}
                      isMulti
                    />
                  )}
                  rules={{ required: true }}
                />
                {errors.tags && (
                  <span className="text-danger">This field is required</span>
                )}
                <button type="submit" className="btn btn-success w-100">
                  Add Item
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
