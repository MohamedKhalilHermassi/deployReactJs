import  { useState, useEffect } from 'react';
import axios from 'axios';

const SoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://deploynodejs-2.onrender.com/market/get-products');
        const soldProductsData = response.data.filter(product => product.sold === true);
        setSoldProducts(soldProductsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center mb-4">Sold Products</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {soldProducts.map(product => (
            <tr key={product._id}>
              <td>
                <img
                  src={`https://deploynodejs-2.onrender.com/uploads/${product.filename}`}
                  alt={product.productName}
                  className="img-thumbnail"
                  style={{ width: '100px', height: 'auto' }}
                />
              </td>
              <td>{product.productName}</td>
              <td>{product.productDescription}</td>
              <td>${product.productPrice}</td>
              <td>{product.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoldProducts;
