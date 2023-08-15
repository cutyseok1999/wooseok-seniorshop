const deleteProductButtonElements = document.querySelectorAll(
  ".product-item button"
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/products/" + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct);
}

document.addEventListener("DOMContentLoaded", function () {
  const categoryTabs = document.querySelectorAll(".category-tab");

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-category");

      if (selectedCategory === "모든 제품") {
        window.location.href = "/products";
      } else {
        window.location.href =
          "/products?category=" + encodeURIComponent(selectedCategory);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("btn-search");

  async function findSearchProduct() {
    const searchTerm = document.querySelector(".product-search-input").value;

    if (searchTerm === "") {
      window.location.href = "/products";
    } else {
      window.location.href =
        "/products?search=" + encodeURIComponent(searchTerm);
    }
  }

  searchButton.addEventListener("click", findSearchProduct);
});

document.addEventListener("DOMContentLoaded", () => {
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    let recognitionTimer;

    document.getElementById("btn-speak").addEventListener("click", function () {
      recognition.start();
      // 3초 후에 음성 인식 중지
      recognitionTimer = setTimeout(() => {
        recognition.stop();
      }, 3000); // 3초 설정
    });

    recognition.onresult = function (event) {
      clearTimeout(recognitionTimer); // 타이머 초기화
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      document.querySelector(".product-search-input").value = transcript;
      recognition.stop();
    };

    recognition.onerror = function (event) {
      clearTimeout(recognitionTimer); // 오류 발생 시 타이머 초기화
      console.error(event.error);
    };

    recognition.onend = function () {
      clearTimeout(recognitionTimer); // 인식이 끝날 때 타이머 초기화
    };
  } else {
    // SpeechRecognition API를 지원하지 않는 브라우저에 대한 처리
    document.getElementById("btn-speak").addEventListener("click", function () {
      alert(
        "죄송합니다. 음성 인식은 이 브라우저에서 지원되지 않습니다. Chrome을 사용해보세요."
      );
    });
  }
});
