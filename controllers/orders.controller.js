const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  res.redirect("/orders");
}

async function addOrderDirectly(req, res, next) {
  // 상품을 찾습니다.
  let product;
  try {
    product = await Product.findById(req.body.productId);
    quantity = parseInt(req.body.quantity);
  } catch (error) {
    return next(error);
  }

  // 만약 상품을 찾을 수 없다면 오류 메시지를 반환합니다.
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }

  // 장바구니에 담긴 것처럼 주문 객체를 생성합니다.
  const orderItem = {
    items: [
      {
        product: product,
        quantity: quantity,
        totalPrice: product.price * quantity,
      },
    ],
    totalQuantity: quantity,
    totalPrice: product.price * quantity,
  };

  const userDocument = await User.findById(res.locals.uid);
  const order = new Order(orderItem, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/orders");
}

async function cancelOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = "취소됨";

  try {
    const order = await Order.findById(orderId);
    order.status = "취소됨";
    await order.save();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  addOrderDirectly: addOrderDirectly,
  cancelOrder: cancelOrder,
};
