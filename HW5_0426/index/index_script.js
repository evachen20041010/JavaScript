const form = document.getElementById('add-to-cart-form');
const cartItems = document.getElementById('cart-items');
const clearCartButton = document.getElementById('clear-cart');
const totalPrice = document.getElementById('total-price-value');

let itemsInCart = [];

var user = localStorage.getItem ("user");
document.getElementById(["user"]).innerHTML = user + " 您好！";

function addItemToCart(itemName, itemPrice, itemQuantity) {
    // 創建一個新的購物車項目
    const newItem = {
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity
    };

    // 檢查商品是否已存在於購物車中
    const existingItem = itemsInCart.find(item => item.name === itemName);

    if (existingItem) {
        // 如果該商品已存在於購物車中，則更新其數量
        existingItem.quantity += itemQuantity;
    } else {
        // 將新商品添加到購物車
        itemsInCart.push(newItem);
    }

    // 更新購物車
    updateCartHtml();
}

function removeItemFromCart(itemName) {
    // 在購物車中查找商品
    const index = itemsInCart.findIndex(item => item.name === itemName);

    if (index !== -1) {
        // 從購物車中刪除項目
        itemsInCart.splice(index, 1);

        // 更新購物車
        updateCartHtml();
    }
}

function updateItemQuantity(itemName, newQuantity) {
    // 在購物車中查找商品
    const item = itemsInCart.find(item => item.name === itemName);

    if (item) {
        // 更新項目的數量
        item.quantity = newQuantity;

        // 更新購物車
        updateCartHtml();
    }
}

function updateCartHtml() {
    // 清除現有的購物車
    cartItems.innerHTML = '';

    // 從頭開始重構購物車
    itemsInCart.forEach(item => {
        const totalItemPrice = item.price * item.quantity;

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${item.name}</td>
                        <td>$${item.price}</td>
                    <td>
                        <input type="number" class="item-quantity-input" value="${item.quantity}" min="1" />
                    </td>
                    <td>$${totalItemPrice}</td>
                    <td>
                        <button class="remove-item-button" data-item-name="${item.name}">刪除</button>
                    </td>
                    `;

        const quantityInput = row.querySelector('.item-quantity-input');
        const removeButton = row.querySelector('.remove-item-button');

        // 數量輸入和刪除按鈕添加事件監聽器
        quantityInput.addEventListener('input', event => {
            const newQuantity = parseInt(event.target.value);
            updateItemQuantity(item.name, newQuantity);
        });

        removeButton.addEventListener('click', event => {
            const itemName = event.target.getAttribute('data-item-name');
            if (confirm(`確認要從購物車移除 ${itemName} ？`)) {
                removeItemFromCart(itemName);
            }
        });

        cartItems.appendChild(row);
    });

    // 更新總價
    const totalPriceValue = itemsInCart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    totalPrice.textContent = `$${totalPriceValue}`;
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
    if (confirm(`確認要清除購物車？`)) {
        itemsInCart = [];
        updateCartHtml();
    }
});