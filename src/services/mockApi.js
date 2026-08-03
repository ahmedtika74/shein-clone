import MockAdapter from "axios-mock-adapter";
import { apiClient } from "./apiClient";
import { initialProducts, initialCategories } from "../data/initialData";
import { updateStockOnOrder, handleRefundStatusChange } from "./mockApiHelpers";

const mock = new MockAdapter(apiClient, { delayResponse: 500 });

const getDB = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const setDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ---------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------

mock.onPost("/auth/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const user = getDB("user", null);

  if (!user) {
    return [404, { message: "No account found!" }];
  }

  if (email === user.email && password === user.password) {
    const token = crypto.randomUUID();
    const currentUser = { ...user, token };
    return [200, { user: currentUser, message: "Login Successful!" }];
  }

  return [401, { message: "Wrong email or password!" }];
});

mock.onPost("/auth/register").reply((config) => {
  const payload = JSON.parse(config.data);
  const token = crypto.randomUUID();
  const user = { ...payload, token };
  setDB("user", user);
  return [200, { user, message: "Register Successful!" }];
});

mock.onPost("/auth/admin-login").reply((config) => {
  const { username, password } = JSON.parse(config.data);
  if (username.trim() === "" || password.trim() === "") {
    return [400, { message: "Please enter username and password!" }];
  }
  // Fake validation
  return [
    200,
    {
      token: crypto.randomUUID(),
      message: "Admin authenticated successfully!",
    },
  ];
});

// ---------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------
mock.onGet("/products").reply(() => {
  const products = getDB("products", initialProducts);
  return [200, products];
});

mock.onPost("/products").reply((config) => {
  const products = getDB("products", initialProducts);
  const newProduct = JSON.parse(config.data);
  products.unshift(newProduct);
  setDB("products", products);
  return [201, newProduct];
});

mock.onPut(/\/products\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const products = getDB("products", initialProducts);
  const updated = JSON.parse(config.data);
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index !== -1) {
    products[index] = updated;
    setDB("products", products);
    return [200, updated];
  }
  return [404, { message: "Product not found" }];
});

mock.onDelete(/\/products\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const products = getDB("products", initialProducts);
  const filtered = products.filter((p) => String(p.id) !== String(id));
  setDB("products", filtered);
  return [200, { success: true }];
});

// ---------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------
mock.onGet("/categories").reply(() => {
  return [200, getDB("categories", initialCategories)];
});

mock.onPost("/categories").reply((config) => {
  const categories = getDB("categories", initialCategories);
  const newCat = JSON.parse(config.data);
  categories.push(newCat);
  setDB("categories", categories);
  return [201, newCat];
});

mock.onPut(/\/categories\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const categories = getDB("categories", initialCategories);
  const updated = JSON.parse(config.data);
  const index = categories.findIndex((c) => String(c.id) === String(id));
  if (index !== -1) {
    categories[index] = updated;
    setDB("categories", categories);
    return [200, updated];
  }
  return [404, { message: "Category not found" }];
});

mock.onDelete(/\/categories\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const categories = getDB("categories", initialCategories);
  const filtered = categories.filter((c) => String(c.id) !== String(id));
  setDB("categories", filtered);
  return [200, { success: true }];
});

// ---------------------------------------------------------
// ORDERS
// ---------------------------------------------------------
mock.onGet("/orders").reply(() => {
  return [200, getDB("orders", [])];
});

mock.onPost("/orders").reply((config) => {
  const orders = getDB("orders", []);
  const newOrder = JSON.parse(config.data);
  orders.unshift(newOrder);
  setDB("orders", orders);

  // Update product stock
  let products = getDB("products", initialProducts);
  products = updateStockOnOrder(newOrder, products);
  setDB("products", products);

  return [201, newOrder];
});

mock.onPut(/\/orders\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const orders = getDB("orders", []);
  const updated = JSON.parse(config.data);
  const index = orders.findIndex((o) => String(o.id) === String(id));

  if (index !== -1) {
    const oldOrder = orders[index];

    const products = getDB("products", initialProducts);
    const { updated: processedUpdate, updatedProducts } =
      handleRefundStatusChange(updated, oldOrder, products);

    if (products !== updatedProducts) {
      setDB("products", updatedProducts);
    }

    orders[index] = { ...orders[index], ...processedUpdate };
    if (orders[index].status === "Refund Refused") {
      delete orders[index].refundedAt;
    }
    if (orders[index].status === "Refunded") {
      delete orders[index].refusedAt;
      delete orders[index].refusalReason;
    }
    setDB("orders", orders);
    return [200, orders[index]];
  }
  return [404, { message: "Order not found" }];
});

mock.onDelete(/\/orders\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const orders = getDB("orders", []);
  const filtered = orders.filter((o) => String(o.id) !== String(id));
  setDB("orders", filtered);
  return [200, { success: true }];
});

// ---------------------------------------------------------
// MISC SETTINGS & OFFERS
// ---------------------------------------------------------
mock.onGet("/settings").reply(() => [200, getDB("siteSettings", {})]);
mock.onPut("/settings").reply((config) => {
  const settings = JSON.parse(config.data);
  setDB("siteSettings", settings);
  return [200, settings];
});

mock.onPost("/hero").reply((config) => {
  const slides = getDB("heroSlides", []);
  const newSlide = JSON.parse(config.data);
  slides.push(newSlide);
  setDB("heroSlides", slides);
  return [201, newSlide];
});
mock.onDelete(/\/hero\/.+/).reply((config) => {
  const id = config.url.split("/").pop();
  const slides = getDB("heroSlides", []);
  setDB(
    "heroSlides",
    slides.filter((s) => String(s.id) !== String(id)),
  );
  return [200, { success: true }];
});

// Pass-through anything else (just in case)
mock.onAny().passThrough();

export default mock;
