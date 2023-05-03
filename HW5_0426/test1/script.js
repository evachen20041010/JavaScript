const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

function saveCartItems() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function addItemToCart(item) {
    const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id
    );
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        cartItems.push(item);
    }
    saveCartItems();
}

function removeItemFromCart(itemId) {
    const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === itemId);
    cartItems.splice(itemIndex, 1);
    saveCartItems();
}

function updateCartItemQuantity(itemId, quantity) {
    const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === itemId);
    cartItems[itemIndex].quantity = quantity;
    saveCartItems();
}

function calculateTotalPrice() {
    let totalPrice = 0;
    cartItems.forEach((cartItem) => {
        totalPrice += cartItem.price * cartItem.quantity;
    });
    return totalPrice;
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
    cartItems.forEach((cartItem) => {
        const row = document.createElement("tr");
        row.innerHTML = `
<td>${cartItem.name}</td>
<td>${cartItem.price}</td>
<td>
    <input
      type="number"
      value="${cartItem.quantity}"
      min="1"
      onchange="updateQuantity(${cartItem.id}, this.value)"
    />
  </td>
  <td>$${cartItem.price * cartItem.quantity}</td>
  <td>
    <button onclick="removeItem(${cartItem.id})">Remove</button>
  </td>
`;
        cartItemsContainer.appendChild(row);
    });
}

function updateTotalPrice() {
    const totalPriceElement = document.getElementById("total-price");
    const totalPrice = calculateTotalPrice();
    totalPriceElement.textContent = `${totalPrice}`;
}

function addItemFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("item-name").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const quantity = parseInt(document.getElementById("item-quantity").value);
    addItemToCart({ id: Date.now(), name, price, quantity });
    renderCartItems();
    updateTotalPrice();
    event.target.reset();
}

function removeItem(itemId) {
    removeItemFromCart(itemId);
    renderCartItems();
    updateTotalPrice();
}

function updateQuantity(itemId, quantity) {
    updateCartItemQuantity(itemId, quantity);
    renderCartItems();
    updateTotalPrice();
}

function clearCart() {
    localStorage.removeItem("cartItems");
    cartItems.length = 0;
    renderCartItems();
    updateTotalPrice();
}

// Render initial cart items and total price
renderCartItems();
updateTotalPrice();

// Add event listeners to the form and clear cart button
const addItemForm = document.getElementById("add-item-form");
addItemForm.addEventListener("submit", addItemFormSubmit);

const clearCartButton = document.getElementById("clear-cart");
clearCartButton.addEventListener("click", clearCart);