const Product = require("../models/product.model");

async function getAllProducts(req, res, next) {
  const category = req.query.category;
  const search = req.query.search;

  let products;
  try {
    if (category && category !== "모든 제품") {
      if (!search) {
        products = await Product.findAll(category);
      } else {
        products = await Product.findSearch(search);
        if (!products) {
          res.render("customer/products/all-products", {
            products: [],
            category:
              '"' + search + '" ' + "에 해당하는 제품을 찾을 수 없습니다",
            search: null,
          });
          return;
        }
      }

      res.render("customer/products/all-products", {
        products: products,
        category: category,
        search: search,
      });
    } else {
      if (!search) {
        products = await Product.findAll();
      } else {
        products = await Product.findSearch(search);
        if (!products) {
          res.render("customer/products/all-products", {
            products: [],
            category:
              '"' + search + '" ' + "에 해당하는 제품을 찾을 수 없습니다",
            search: null,
          });
          return;
        }
      }

      res.render("customer/products/all-products", {
        products: products,
        category: "모든 제품",
        search: search,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("customer/products/product-details", { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails,
};
