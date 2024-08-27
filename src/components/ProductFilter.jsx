import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductFilter() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [isFiltered, setIsFiltered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://strapi-store-server.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    let filtered = products;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== '') {
      filtered = filtered.filter(product => product.attributes.category === category);
    }

    if (company !== '') {
      filtered = filtered.filter(product => product.attributes.company === company);
    }

    filtered = filtered.filter(
      product => product.attributes.price >= minPrice && product.attributes.price <= maxPrice
    );

    if (freeShipping) {
      filtered = filtered.filter(product => product.attributes.shipping);
    }

    if (sortBy === 'a-z') {
      filtered = filtered.sort((a, b) => a.attributes.title.localeCompare(b.attributes.title));
    } else if (sortBy === 'z-a') {
      filtered = filtered.sort((a, b) => b.attributes.title.localeCompare(a.attributes.title));
    }

    setFilteredProducts(filtered);
    setIsFiltered(true);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setCompany('');
    setSortBy('');
    setFreeShipping(false);
    setMinPrice(0);
    setMaxPrice(100000);
    setIsFiltered(false);
    setFilteredProducts(products); 
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const categories = Array.from(new Set(products.map(product => product.attributes.category)));
  const companies = Array.from(new Set(products.map(product => product.attributes.company)));

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
            All Products
          </h2>
        </div>
        <div className="filter-container bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
          <div className="filter-info flex justify-between text-sm mb-4">
            <p>Total Products: {products.length}</p>
            {isFiltered && <p>Filtered Products: {filteredProducts.length}</p>}
          </div>
          <div className="inputs flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full max-w-xs"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full max-w-xs"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full max-w-xs"
            >
              <option value="">All Companies</option>
              {companies.map(comp => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full max-w-xs"
            >
              <option value="">Sort By</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
          <div className="slider-btn flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Price Range: ${minPrice} - ${maxPrice}</label>
              <input
                type="range"
                min="0"
                max="100000"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="w-full max-w-xs"
              />
              <input
                type="range"
                min="0"
                max="100000"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="w-full max-w-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Free Shipping</label>
              <input
                type="checkbox"
                checked={freeShipping}
                onChange={() => setFreeShipping(!freeShipping)}
              />
            </div>
            <button onClick={handleFilter} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Submit
            </button>
            <button onClick={handleReset} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Reset
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {isFiltered ? (
            filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
              <p>No products available.</p>
            )
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
