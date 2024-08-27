import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from '../components/CartContaxt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`https://strapi-store-server.onrender.com/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProduct(data.data.attributes);
          setSelectedColor(data.data.attributes.colors[0] || '');
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  );

  if (error) return <div>{error}</div>;

  const handleAddToCart = () => {
    const productToAdd = {
      productID: id,
      title: product.title,
      price: parseInt(product.price, 10),
      productColor: selectedColor,
      amount: selectedAmount,
      company: product.company,
      image: product.image,
    };
    addToCart(productToAdd);
    toast.success("Product added to cart!");
  };

  return (
    <div className="md:container md:mx-auto p-6 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-lg shadow-lg max-w-full h-auto md:w-96"
        />
        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <h2 className="text-xl text-gray-500 mt-2">{product.brand}</h2>
          <p className="text-2xl text-purple-600 mt-4">${product.price}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Colors</h3>
            <div className="flex items-center gap-2 mt-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                ></button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Amount</h3>
            <select
              className="mt-2 border rounded p-2"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(parseInt(e.target.value, 10))}
            >
              {[...Array(20).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <button
            className="mt-6 bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleAddToCart}
          >
            Add to Bag
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductDetails;
