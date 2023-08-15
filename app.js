const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

// ejs 연결
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 정적 파일 제공
app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
// 데이터 해석
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 세션 설정
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));
// csrf 보안 설정
app.use(csrf());

// 카트 설정
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

// csrf토큰, 인증 확인
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

// 라우트 연결
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes);

// 에러 핸들러
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// db 연결 후 로컬 서버 설정
db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
