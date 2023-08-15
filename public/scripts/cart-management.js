const addToCartButtonElement = document.querySelector("#product-details .btn");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");
const productQuantityInputElement = document.querySelector(
  "#product-details #product-quantity"
);

const addToOrderButtonElement = document.querySelector(
  "#product-details #buy-now"
);

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;
  const productQuantity = Number(productQuantityInputElement.value); // 수량 값 가져오기

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        quantity: productQuantity, // 수량을 POST 요청에 포함
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }

  // 알림창 표시
  const userDecision = confirm(
    "장바구니에 상품이 담겼습니다. 장바구니로 이동할까요?"
  );

  if (userDecision) {
    window.location.href = "/cart"; // 장바구니 페이지 URL. 당신의 설정에 따라 변경해야 합니다.
  }
}

addToCartButtonElement.addEventListener("click", addToCart);

async function addToOrder() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;
  const productQuantity = parseInt(productQuantityInputElement.value); // 수량 값 가져오기

  let response;
  try {
    response = await fetch("/orders/direct", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        quantity: productQuantity, // 수량을 POST 요청에 포함
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }
}

addToOrderButtonElement.addEventListener("click", addToOrder);
