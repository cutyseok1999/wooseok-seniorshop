const updateOrderFormElements = document.querySelectorAll(
  ".order-actions form"
);
const cancelOrderButtons = document.querySelectorAll(
  ".order-actions-user form"
);

async function updateOrder(event) {
  event.preventDefault();
  const form = event.target;

  const formData = new FormData(form);
  const newStatus = formData.get("status");
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  const responseData = await response.json();

  form.parentElement.parentElement.querySelector(".badge").textContent =
    responseData.newStatus.toUpperCase();
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener("submit", updateOrder);
}

// 사용자 주문 취소 로직
async function cancelOrder(event) {
  event.preventDefault();

  const userDecision = confirm("주문을 취소하시겠습니까?");

  if (!userDecision) {
    return; // 취소 버튼을 눌렀을 경우
  }

  const form = event.target.closest("form");

  const formData = new FormData(form);
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response;

  try {
    response = await fetch(`/orders/cancel/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("오류가 발생했습니다. 다시 시도해 주세요.");
    return;
  }

  if (!response.ok) {
    alert("오류가 발생했습니다. 다시 시도해 주세요.");
    return;
  }

  const responseData = await response.json();

  if (responseData) {
    alert("주문이 취소되었습니다.");
    form.parentElement.parentElement.querySelector(".badge").textContent =
      responseData.newStatus.toUpperCase();
  } else {
    alert("주문 취소를 실패하였습니다. 다시 시도해 주세요.");
  }
}

for (const cancelOrderButton of cancelOrderButtons) {
  cancelOrderButton.addEventListener("click", cancelOrder);
}
