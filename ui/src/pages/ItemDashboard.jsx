import { Link } from "react-router-dom";
import * as Components from "../components";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api";

function ItemDashboard() {
  const [sortClicked, setSortClicked] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterChanged, setFilterChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    category_count: 0,
    item_count: 0,
  });
  const [categories, setCategories] = useState([]);

  const [params, setParams] = useSearchParams();

  const [stockFilter, setStockFilter] = useState({
    inStock: 1,
    availableStock: 1,
    category: "all",
  });

  const filterRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  function handleItemCheck(e, id) {
    const isChecked = e.target.checked;
    if (isChecked) {
      selectedItems.add(id);
    } else {
      selectedItems.delete(id);
    }
    setSelectedItems(new Set(selectedItems));
  }

  function handleSearch(e) {
    const search = e.target.value;
    if (!search) {
      setFilteredItems(items);
      return;
    }
    const newItems = items.filter((item) => {
      return (
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase())
        ) ||
        item.category.name.toLowerCase().includes(search.toLowerCase()) ||
        item.stock.toString().includes(search.toLowerCase()) ||
        item.available_stock.toString().includes(search.toLowerCase())
      );
    });
    setFilteredItems([...newItems]);
  }

  function handleSort(key) {
    const newItems = items.sort((a, b) => {
      if (a[key] instanceof String && b[key] instanceof String) {
        if (a[key].toLowerCase() < b[key].toLowerCase())
          return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
        if (a[key].toLowerCase() > b[key].toLowerCase())
          return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
        return 0;
      } else {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      }
    });
    setSortClicked((p) => !p);
    if (sortClicked) {
      // reverse the array if sort is clicked again
      newItems.reverse();
    }
    // console.log();
    setFilteredItems([...newItems]);
  }

  const getItems = async () => {
    try {
      const { data } = await api.get("/items");
      data.forEach((item) => {
        item.isChecked = false;
      });
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      toast.error("Failed to fetch items");
    }
  };

  const getAnalytics = async () => {
    try {
      const { data } = await api.get("/items/analytics");
      setCounts(data);
    } catch (error) {
      toast.error("Failed to fetch analytics");
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const getFilteredData = async () => {
    const category = params.get("category");
    const inStockTo = Number(params.get("istock"));
    const availableStockTo = Number(params.get("astock"));

    setLoading(true);

    let query = `/items/filter?`;

    if (category) {
      query += `category=${category}&`;
    }
    if (inStockTo) {
      query += `istock=${inStockTo}&`;
    }
    if (availableStockTo) {
      query += `astock=${availableStockTo}&`;
    }

    const { data } = await api.get(query);

    setFilteredItems(data);

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getItems(), getAnalytics(), getCategories()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const thElements = document.querySelectorAll("th"); // gettig all the th elements in the table to add event listeners
    thElements.forEach((th) => {
      th.style.cursor = "pointer";
    });

    thElements.forEach((th) => {
      th.addEventListener("click", () => {
        // get the child node of the th element and modify the class name
        th.childNodes.forEach((child) => {
          if (child.nodeName === "I") {
            if (child.classList.contains("fa-arrow-down")) {
              child.classList.remove("fa-arrow-down");
              child.classList.add("fa-arrow-up");
            } else {
              child.classList.remove("fa-arrow-up");
              child.classList.add("fa-arrow-down");
            }
          }
        });
      });
    });
    return () => {
      thElements.forEach((th) => {
        th.removeEventListener("click", () => {
          th.childNodes.forEach((child) => {
            if (child.nodeName === "I") {
              if (child.classList.contains("fa-arrow-down")) {
                child.classList.remove("fa-arrow-down");
                child.classList.add("fa-arrow-up");
              } else {
                child.classList.remove("fa-arrow-up");
                child.classList.add("fa-arrow-down");
              }
            }
          });
        });
      });
    };
  }, []);

  useEffect(() => {
    getFilteredData();
  }, [filterChanged]);

  if (loading) {
    return <Components.Loader />;
  }

  return (
    <div className="row">
      <div className="col-lg-2">
        <Components.Sidebar />
      </div>
      <div className="col-lg-10 col-sm-2">
        <div className="row mt-lg-4 mt-2">
          <div className={`col-sm-12 col-lg-6 ${isMobile && "text-center"}`}>
            <h2 className="sm-fs-1">Item Dashboard</h2>
            <p className="fs-5">All Items</p>
          </div>
          <div className="col-sm-12 col-lg-6 fw-italic fs-6">
            <div className="row">
              <div className="col-sm-12 col-lg-4 card border-info">
                <div className="card-body">
                  <p className="fw-bold">Total Categories</p>
                  <p className="text-success fs-5">{counts.category_count}</p>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4 card border-success mx-lg-2">
                <div className="card-body">
                  <p className="fw-bold">Total Items</p>
                  <p className="text-success fs-5">{counts.item_count}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row col-12 text-start mt-3">
          <Link
            to="/categories/add"
            className={`btn btn-success p-2 w-${isMobile ? "100" : "25"}`}
          >
            <i className="fa fa-plus"></i> Add Category
          </Link>
        </div>
        <div className="row col-12 mt-4">
          <div className="card">
            <div className="card-header">
              <div className="d-flex">
                <Link to="/items/add" className="btn btn-success">
                  <i className="fa fa-plus"></i> Add Item
                </Link>
                <button
                  className="btn btn-danger mx-2"
                  disabled={selectedItems.size === 0}
                >
                  <i className="fa fa-trash"></i> Delete
                </button>
                <div className="d-flex mx-5">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search"
                    onChange={handleSearch}
                  />
                </div>
                <button
                  className="btn btn-success"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  <i className="fa fa-filter"></i> Filter
                </button>
                {/* OFFCANVAS */}
                <div
                  className="offcanvas offcanvas-end"
                  tabIndex="-1"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">
                      Filter
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      ref={filterRef}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <div className="d-flex flex-column">
                      <label htmlFor="category" className="form-label">
                        Category
                      </label>
                      <select
                        name="category"
                        id="category"
                        className="form-select"
                        value={stockFilter.category}
                        onChange={(e) => {
                          setStockFilter((p) => ({
                            ...p,
                            category: e.target.value,
                          }));
                          setParams((params) => {
                            params.set("category", e.target.value);
                            return params;
                          });
                        }}
                      >
                        <option value="all">All</option>
                        {categories.map((category, idx) => (
                          <option key={idx} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                      <label htmlFor="inStock" className="form-label">
                        In Stock
                      </label>

                      {/* Range slider (1-1000) */}

                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="1000"
                        id="inStock"
                        value={stockFilter.inStock}
                        onChange={(e) => {
                          setStockFilter((p) => ({
                            ...p,
                            inStock: e.target.value,
                          }));
                          setParams((params) => {
                            params.set("istock", e.target.value);
                            return params;
                          });
                        }}
                      />

                      {stockFilter.inStock}

                      <label htmlFor="avaliableStock" className="form-label">
                        Available Stock
                      </label>
                      {/* Range slider (1-1000) */}
                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="1000"
                        id="avaliableStock"
                        value={stockFilter.availableStock}
                        onChange={(e) => {
                          setStockFilter((p) => ({
                            ...p,
                            availableStock: e.target.value,
                          }));
                          setParams((params) => {
                            params.set("astock", e.target.value);
                            return params;
                          });
                        }}
                      />

                      {stockFilter.availableStock}

                      {/* Apply button */}
                      <button
                        className="btn btn-success mt-2"
                        onClick={() => {
                          setFilterChanged((p) => !p);
                          filterRef.current.click();
                        }}
                      >
                        Apply
                      </button>

                      {/* Clear Button */}
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => {
                          setParams((params) => {
                            params.delete("category");
                            params.delete("istock");
                            params.delete("astock");
                            return params;
                          });
                          setFilterChanged((p) => !p);
                          filterRef.current.click();
                          setStockFilter({
                            inStock: 1,
                            availableStock: 1,
                            category: "all",
                          });
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {filteredItems.length > 0 ? (
              <div className="card-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="form-check-input fs-5 border-1 border-dark"
                          onClick={(e) => {
                            const isChecked = e.target.checked;
                            const newItems = items.map((item) => {
                              item.isChecked = isChecked;
                              return item;
                            });
                            setItems([...newItems]);
                            if (isChecked) {
                              setSelectedItems(
                                new Set(newItems.map((item) => item.id))
                              );
                            } else {
                              setSelectedItems(new Set());
                            }
                          }}
                        />
                      </th>
                      <th onClick={() => handleSort("sku")}>
                        SKU <i className={`fa-solid fa-arrow-down`}></i>
                      </th>
                      <th onClick={() => handleSort("name")}>
                        Name <i className={`fa-solid fa-arrow-down`}></i>
                      </th>
                      <th onClick={() => handleSort("tags")}>
                        Tags <i className={`fa-solid fa-arrow-down`}></i>
                      </th>
                      <th onClick={() => handleSort("category")}>
                        Category <i className={`fa-solid fa-arrow-down`}></i>
                      </th>
                      <th onClick={() => handleSort("inStock")}>
                        In Stock <i className={`fa-solid fa-arrow-down`}></i>
                      </th>
                      <th onClick={() => handleSort("availableStock")}>
                        Available Stock{" "}
                        <i className={`fa-solid fa-arrow-down`}></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input fs-5 border-1 border-dark"
                            checked={item.isChecked}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const newItems = items.map((i) => {
                                if (i.id === item.id) {
                                  i.isChecked = isChecked;
                                }
                                return i;
                              });
                              setItems([...newItems]);
                              handleItemCheck(e, item.id);
                            }}
                          />
                        </td>
                        <td>{item.sku}</td>
                        <td>
                          <Link to={`/items/${item.id}`}>{item.name}</Link>{" "}
                        </td>
                        <td>{item.tags.map((item) => item.name + ",")}</td>
                        <td>
                          <Link to="/categories/add">{item.category.name}</Link>
                        </td>
                        {item.stock === 0 && item.available_stock === 0 && (
                          <>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.stock}
                            </td>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.available_stock}
                            </td>
                          </>
                        )}
                        {item.stock === item.available_stock && (
                          <>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.stock}
                            </td>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.available_stock}
                            </td>
                          </>
                        )}
                        {item.stock > item.available_stock && (
                          <>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.stock}
                            </td>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.available_stock}
                            </td>
                          </>
                        )}
                        {item.stock < item.available_stock && (
                          <>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.stock}
                            </td>
                            <td>
                              <i className="fa-solid fa-circle text-success"></i>{" "}
                              {item.available_stock}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body">
                <h3 className="text-center">No Items Found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDashboard;
