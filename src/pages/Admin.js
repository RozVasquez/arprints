import React, { useState, useEffect } from 'react';
import productData from '../data/products';

function Admin() {
  const [data, setData] = useState(productData);
  const [activeTab, setActiveTab] = useState('photocards');
  const [activeProduct, setActiveProduct] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    color: 'pink',
    options: []
  });
  const [newCategory, setNewCategory] = useState({
    id: '',
    title: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password protection - in a real app, use proper authentication
    if (password === 'arprints2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  // Set initial active product
  useEffect(() => {
    if (data[activeTab] && data[activeTab].items.length > 0) {
      setActiveProduct(data[activeTab].items[0]);
    }
  }, [activeTab, data]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowNewProductForm(false);
    setShowNewCategoryForm(false);
    if (data[tab] && data[tab].items.length > 0) {
      setActiveProduct(data[tab].items[0]);
    }
  };

  const handleProductSelect = (product) => {
    setActiveProduct(product);
    setShowNewProductForm(false);
    setShowNewCategoryForm(false);
  };

  const handleInputChange = (optionIndex, field, value) => {
    if (!activeProduct) return;

    const updatedData = { ...data };
    const productIndex = updatedData[activeTab].items.findIndex(
      item => item.id === activeProduct.id
    );

    if (productIndex !== -1) {
      updatedData[activeTab].items[productIndex].options[optionIndex][field] = value;
      setData(updatedData);
      setActiveProduct(updatedData[activeTab].items[productIndex]);
    }
  };

  const handleProductChange = (field, value) => {
    if (!activeProduct) return;

    const updatedData = { ...data };
    const productIndex = updatedData[activeTab].items.findIndex(
      item => item.id === activeProduct.id
    );

    if (productIndex !== -1) {
      updatedData[activeTab].items[productIndex][field] = value;
      setData(updatedData);
      setActiveProduct(updatedData[activeTab].items[productIndex]);
    }
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct({
      ...newProduct,
      [field]: value
    });
  };

  const handleNewCategoryChange = (field, value) => {
    setNewCategory({
      ...newCategory,
      [field]: value
    });
  };

  const addNewOption = () => {
    if (!activeProduct) return;

    const updatedData = { ...data };
    const productIndex = updatedData[activeTab].items.findIndex(
      item => item.id === activeProduct.id
    );

    if (productIndex !== -1) {
      // Create new option based on the product type
      const newOption = activeTab === 'instax' 
        ? { type: 'New Type', quantity: '0 pcs', price: '₱0', details: 'New option details' }
        : { quantity: '0 pcs', price: '₱0', details: 'New option details' };
        
      updatedData[activeTab].items[productIndex].options.push(newOption);
      setData(updatedData);
      setActiveProduct(updatedData[activeTab].items[productIndex]);
    }
  };

  const deleteOption = (optionIndex) => {
    if (!activeProduct || activeProduct.options.length <= 1) return;

    const updatedData = { ...data };
    const productIndex = updatedData[activeTab].items.findIndex(
      item => item.id === activeProduct.id
    );

    if (productIndex !== -1) {
      updatedData[activeTab].items[productIndex].options.splice(optionIndex, 1);
      setData(updatedData);
      setActiveProduct(updatedData[activeTab].items[productIndex]);
    }
  };

  const addNewProduct = () => {
    if (!newProduct.id || !newProduct.name) {
      alert('Product ID and Name are required');
      return;
    }

    // Generate a unique ID if not provided
    const productId = newProduct.id || `${activeTab}-${Date.now()}`;
    
    // Create an initial option based on the category
    const initialOption = activeTab === 'instax' 
      ? { type: 'New Type', quantity: '0 pcs', price: '₱0', details: 'Option details' }
      : { quantity: '0 pcs', price: '₱0', details: 'Option details' };

    const productToAdd = {
      ...newProduct,
      id: productId,
      options: [initialOption]
    };

    const updatedData = { ...data };
    updatedData[activeTab].items.push(productToAdd);
    setData(updatedData);
    setActiveProduct(productToAdd);
    setShowNewProductForm(false);
    
    // Reset new product form
    setNewProduct({
      id: '',
      name: '',
      description: '',
      color: 'pink',
      options: []
    });
  };

  const addNewCategory = () => {
    if (!newCategory.id || !newCategory.title) {
      alert('Category ID and Title are required');
      return;
    }

    // Check if category ID already exists
    if (data[newCategory.id]) {
      alert('A category with this ID already exists');
      return;
    }

    const updatedData = { ...data };
    updatedData[newCategory.id] = {
      title: newCategory.title,
      items: []
    };

    setData(updatedData);
    setActiveTab(newCategory.id);
    setActiveProduct(null);
    setShowNewCategoryForm(false);
    
    // Reset form
    setNewCategory({
      id: '',
      title: ''
    });
  };

  const deleteCategory = () => {
    if (Object.keys(data).length <= 1) {
      alert('You cannot delete the last category');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the "${data[activeTab].title}" category? This will delete all products in this category.`)) {
      const updatedData = { ...data };
      delete updatedData[activeTab];
      
      // Set a new active tab
      const newActiveTab = Object.keys(updatedData)[0];
      
      setData(updatedData);
      setActiveTab(newActiveTab);
      
      if (updatedData[newActiveTab] && updatedData[newActiveTab].items.length > 0) {
        setActiveProduct(updatedData[newActiveTab].items[0]);
      } else {
        setActiveProduct(null);
      }
    }
  };

  const deleteProduct = () => {
    if (!activeProduct) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedData = { ...data };
      const productIndex = updatedData[activeTab].items.findIndex(
        item => item.id === activeProduct.id
      );
      
      if (productIndex !== -1) {
        updatedData[activeTab].items.splice(productIndex, 1);
        setData(updatedData);
        
        // Select another product if available
        if (updatedData[activeTab].items.length > 0) {
          setActiveProduct(updatedData[activeTab].items[0]);
        } else {
          setActiveProduct(null);
        }
      }
    }
  };

  const exportData = () => {
    const jsonString = `const productData = ${JSON.stringify(data, null, 2)};\n\nexport default productData;`;
    const blob = new Blob([jsonString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-pink-600 mb-6">AR Prints Admin</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-pink-600">AR Prints Admin</h1>
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Export Data
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center mb-6 border-b overflow-x-auto pb-2">
          <div className="flex">
            {Object.keys(data).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-pink-500 text-pink-600 font-bold'
                    : 'text-gray-600'
                }`}
              >
                {data[tab].title}
              </button>
            ))}
          </div>
          <div className="ml-4">
            <button
              onClick={() => {
                setShowNewCategoryForm(true);
                setShowNewProductForm(false);
                setActiveProduct(null);
              }}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm whitespace-nowrap"
            >
              + Add Category
            </button>
            {Object.keys(data).length > 1 && (
              <button
                onClick={deleteCategory}
                className="ml-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300 text-sm whitespace-nowrap"
              >
                Delete Category
              </button>
            )}
          </div>
        </div>

        {/* New Category Form */}
        {showNewCategoryForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Category ID</label>
                <input
                  type="text"
                  value={newCategory.id}
                  onChange={(e) => handleNewCategoryChange('id', e.target.value)}
                  placeholder="e.g., posters"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier, no spaces (e.g., photo-albums)</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category Title</label>
                <input
                  type="text"
                  value={newCategory.title}
                  onChange={(e) => handleNewCategoryChange('title', e.target.value)}
                  placeholder="e.g., Photo Posters"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewCategoryForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={addNewCategory}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Add Category
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Product List */}
          <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Products</h2>
              <button 
                onClick={() => {
                  setShowNewProductForm(true);
                  setShowNewCategoryForm(false);
                  setActiveProduct(null);
                }}
                className="bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700 transition duration-300 text-sm"
              >
                + Add New
              </button>
            </div>
            <ul>
              {data[activeTab].items.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleProductSelect(product)}
                    className={`w-full text-left p-2 mb-2 rounded ${
                      activeProduct && activeProduct.id === product.id
                        ? 'bg-pink-100 text-pink-600 font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {product.name}
                  </button>
                </li>
              ))}
            </ul>
            {data[activeTab].items.length === 0 && (
              <p className="text-gray-500 italic text-sm mt-4 text-center">
                No products in this category yet. <br /> 
                Click "+ Add New" to create one.
              </p>
            )}
          </div>

          {/* New Product Form */}
          {showNewProductForm && (
            <div className="md:w-3/4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Product</h2>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Product ID</label>
                    <input
                      type="text"
                      value={newProduct.id}
                      onChange={(e) => handleNewProductChange('id', e.target.value)}
                      placeholder="e.g., product-name"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Unique identifier, no spaces (e.g., photocard-premium)</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => handleNewProductChange('name', e.target.value)}
                      placeholder="e.g., 🟣 Premium Photo Cards"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => handleNewProductChange('description', e.target.value)}
                      placeholder="e.g., Premium quality photo cards with special finish"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Color Theme</label>
                    <select
                      value={newProduct.color}
                      onChange={(e) => handleNewProductChange('color', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="pink">Pink</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="orange">Orange</option>
                      <option value="violet">Violet</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowNewProductForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewProduct}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Editor */}
          {activeProduct && !showNewProductForm && !showNewCategoryForm && (
            <div className="md:w-3/4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <button
                  onClick={deleteProduct}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
                >
                  Delete Product
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={activeProduct.name}
                      onChange={(e) => handleProductChange('name', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={activeProduct.description || ''}
                      onChange={(e) => handleProductChange('description', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Color Theme</label>
                  <select
                    value={activeProduct.color}
                    onChange={(e) => handleProductChange('color', e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="pink">Pink</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                    <option value="violet">Violet</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="indigo">Indigo</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Options</h3>
                  <button
                    onClick={addNewOption}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition duration-300 text-sm"
                  >
                    + Add Option
                  </button>
                </div>
                {activeProduct.options.map((option, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Option {index + 1}</h4>
                      {activeProduct.options.length > 1 && (
                        <button
                          onClick={() => deleteOption(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeTab === 'instax' && (
                        <div>
                          <label className="block text-gray-700 mb-2">Type</label>
                          <input
                            type="text"
                            value={option.type}
                            onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-gray-700 mb-2">Quantity</label>
                        <input
                          type="text"
                          value={option.quantity}
                          onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                          type="text"
                          value={option.price}
                          onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-gray-700 mb-2">Details</label>
                        <input
                          type="text"
                          value={option.details || ''}
                          onChange={(e) => handleInputChange(index, 'details', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 text-yellow-800">
                  <li>Edit the product information above</li>
                  <li>Add new options or remove existing ones as needed</li>
                  <li>Add new products using the "+ Add New" button</li>
                  <li>Add new categories using the "+ Add Category" button</li>
                  <li>When finished, click "Export Data" to download the updated products.js file</li>
                  <li>Replace the existing src/data/products.js file with the downloaded file</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin; 