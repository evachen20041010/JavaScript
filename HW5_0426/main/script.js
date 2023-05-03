const form = document.getElementById('add-to-cart-form');
const cartItems = document.getElementById('cart-items');
const clearCartButton = document.getElementById('clear-cart');
const totalPrice = document.getElementById('total-price-value');

let itemsInCart = [];

function addItemToCart(itemName, itemPrice, itemQuantity) {
    // Create a new cart item object
    const newItem = {
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity
    };

    // Check if the item already exists in the cart
    const existingItem = itemsInCart.find(item => item.name === itemName);

    if (existingItem) {
        // If the item already exists in the cart, update its quantity
        existingItem.quantity += itemQuantity;
    } else {
        // Otherwise, add the new item to the cart
        itemsInCart.push(newItem);
    }

    // Update the cart HTML
    updateCartHtml();
}

function removeItemFromCart(itemName) {
    // Find the item in the cart
    const index = itemsInCart.findIndex(item => item.name === itemName);

    if (index !== -1) {
        // Remove the item from the cart array
        itemsInCart.splice(index, 1);

        // Update the cart HTML
        updateCartHtml();
    }
}

function updateItemQuantity(itemName, newQuantity) {
    // Find the item in the cart
    const item = itemsInCart.find(item => item.name === itemName);

    if (item) {
        // Update the item's quantity
        item.quantity = newQuantity;

        // Update the cart HTML
        updateCartHtml();
    }
}

function updateCartHtml() {
    // Clear the existing cart HTML
    cartItems.innerHTML = '';

    // Rebuild the cart HTML from scratch
    itemsInCart.forEach(item => {
        const totalItemPrice = item.price * item.quantity;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>
          <input type="number" class="item-quantity-input" value="${item.quantity}" min="1" />
        </td>
        <td>${totalItemPrice.toFixed(2)}</td>
        <td>
          <button class="remove-item-button" data-item-name="${item.name}">Remove</button>
        </td>`;

        const quantityInput = row.querySelector('.item-quantity-input');
        const removeButton = row.querySelector('.remove-item-button');

        // Add event listeners to the quantity input and remove button
        quantityInput.addEventListener('input', event => {
            const newQuantity = parseInt(event.target.value);
            updateItemQuantity(item.name, newQuantity);
        });

        removeButton.addEventListener('click', event => {
            const itemName = event.target.getAttribute('data-item-name');
            removeItemFromCart(itemName);
        });

        cartItems.appendChild(row);
    });

    // Update the total price
    const totalPriceValue = itemsInCart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    totalPrice.textContent = `$${totalPriceValue.toFixed(2)}`;
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const itemName = event.target.elements['item-name'].value;
    const itemPrice = parseFloat(event.target.elements['item-price'].value);
    const itemQuantity = parseInt(event.target.elements['item-quantity'].value);

    addItemToCart(itemName, itemPrice, itemQuantity);

    event.target.reset();
});

clearCartButton.addEventListener('click', () => {
    itemsInCart = [];
    updateCartHtml();
});