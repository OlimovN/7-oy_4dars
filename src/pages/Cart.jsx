import React, { useState } from 'react';
import { useCart } from '../components/CartContaxt';

function Cart() {
  const { cart, removeFromCart, updateItemAmount } = useCart();
  const [maxAmount, setMaxAmount] = useState(20);

  const handleAmountChange = (cartID, newAmount) => {
    if (newAmount === maxAmount) {
      setMaxAmount(maxAmount + 5);
    }
    updateItemAmount(cartID, newAmount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cart.cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.cartItems.map((item) => (
            <div key={item.cartID} className="flex items-center mb-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md mr-4" />
              <div className="flex-grow">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-gray-500">{item.company}</p>
                <p>Color: <span style={{ backgroundColor: item.productColor }} className="inline-block w-4 h-4 rounded-full"></span></p>
                <div className="flex items-center">
                  <label htmlFor={`amount-${item.cartID}`} className="mr-2">Amount:</label>
                  <select
                    id={`amount-${item.cartID}`}
                    value={item.amount}
                    onChange={(e) => handleAmountChange(item.cartID, parseInt(e.target.value, 10))}
                    className="border rounded p-1"
                  >
                    {[...Array(maxAmount).keys()].map(i => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.amount / 100).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.cartID)}
                  className="text-red-500 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <p className="text-lg font-medium">Subtotal: ${(cart.cartTotal / 100).toFixed(2)}</p>
            <p>Shipping: $5.00</p>
            <p>Tax: ${(cart.cartTotal * 0.1 / 100).toFixed(2)}</p>
            <p className="text-lg font-bold">Total: ${((cart.cartTotal + 500 + cart.cartTotal * 0.1) / 100).toFixed(2)}</p>
          </div>
        </div>
      )}
      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full">
        Checkout
      </button>
    </div>
  );
}

export default Cart;