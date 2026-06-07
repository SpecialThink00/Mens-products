let cart = JSON.parse(
localStorage.getItem("cart")
) || [];

function addToCart() {

  const product = {
    name: "Urban Jacket",
    price: 149
  };

  cart.push(product);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  alert("Added to cart");
}

function loadCart() {

  const container =
    document.getElementById("cart-items");

  if (!container) return;

  let total = 0;

  cart.forEach(item => {

    total += item.price;

    container.innerHTML += `
      <div>
        ${item.name} - $${item.price}
      </div>
    `;
  });

  const totalElement =
    document.getElementById("total");

  if(totalElement){
    totalElement.innerText =
      "$" + total;
  }
}

loadCart();