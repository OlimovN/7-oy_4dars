import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://strapi-store-server.onrender.com/api/products?featured=true")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching featured products:", error);
        setError("Failed to load featured products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCardClick = (product) => {
    navigate(`/product-details/${product.id}`);
  };

  return (
    <div className="container px-28 pt-28 mx-auto">
      <div className="w-full">
        <div className="border-b border-base-300 pb-5">
          <h2 className="text-3xl font-medium tracking-wider capitalize">
            Featured Products
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="card cursor-pointer shadow-xl hover:shadow-2xl transition duration-300"
                style={{ width: "320px" }}
                onClick={() => handleCardClick(product)}
              >
                <img
                  className="rounded-xl w-full object-cover"
                  src={product.attributes.image}
                  alt={product.attributes.title}
                  style={{ height: "192px" }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">
                    {product.attributes.title}
                  </h3>
                  <p className="text-lg font-bold">
                    ${product.attributes.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No featured products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
