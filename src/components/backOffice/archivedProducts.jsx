import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
  
        // Set headers with the token
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://deploynodejs-2.onrender.com/market/get-products',{
          headers: headers,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter out archived products
  const filteredProducts = products.filter(product => product.archived);

  return (
    <> 
      <br />
      <br />
      <br />  
      <div>
        <h1>Product List</h1>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={`https://deploynodejs-2.onrender.com/uploads/${product.filename}`}
                      alt={product.productName}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.productDescription}</td>
                  <td>{product.productPrice} TND</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ProductList;
