import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiCloseCircleLine } from 'react-icons/ri';
import { jwtDecode } from 'jwt-decode';
import NotPaid from './subscription/NotPaid';


function ProductList() {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [priceRangeValue, setPriceRangeValue] = useState({ min: 0, max: 1000 }); // State to store current slider values
  const navigate = useNavigate();
  const [decodedToken,setDecodedToken] = useState('');
  const [paid,setPaid] = useState(false)
  const handleClick = () => {
    navigate('/market');
  };
  const handleClickTest = ()=>{
    navigate('/skills');
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        setDecodedToken(jwtDecode(token));
      }
      const expirePaidDate = new Date(decodedToken.expirePaid);
      const currentDate = new Date();

      try {
        const response = await axios.get('https://deploynodejs-2.onrender.com/market/get-products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);

    if (existingItemIndex !== -1) {
      // Product already exists in cart, do nothing
      return;
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      setTotalPrice(totalPrice + product.productPrice);
      setTotalItems(totalItems + 1);
    }
  };
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    const removedItem = cartItems.find(item => item._id === productId);
    setCartItems(updatedCart);
    setTotalPrice(totalPrice - removedItem.productPrice * removedItem.quantity);
    setTotalItems(totalItems - removedItem.quantity);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const filteredProducts = products.filter(product =>
    product.productAvailability === true &&
    !product.archived &&
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.productPrice >= priceRange.min &&
    product.productPrice <= priceRange.max &&
    !product.sold

  );

  
  const handleOrder = async () => {
    try {
      const productsList = cartItems.flatMap(item => Array.from({ length: item.quantity }, () => item._id));
      
      const response = await axios.post('https://deploynodejs-2.onrender.com/orders/add-order', {
          totalPrice: totalPrice,
          user: localStorage.getItem('id'),
          products: productsList,
      });
      toast.success('Your order has been placed successfully!');
      setCartItems([]);
      setTotalPrice(0);
      setShowCart(false); 
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again later.');
    }
  };


  return (
    <>
      {decodedToken.role=="Student" &&  decodedToken.paid === false ? (
       <NotPaid></NotPaid>

      ) : (
        <>
          <br />
          <br />
          <br />
          <div className="container py-4">
            <button
              className='btn btn-secondary rounded-pill px-4 py-2 mx-auto d-block'
              onClick={handleClick}
              style={{ maxWidth: '200px' }}
            >
              Become a Seller
            </button>
            <button className='btn btn-info rounded-pill mx-auto d-block mt-1' onClick={handleClickTest}>Test your skills</button>
            <br />
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="priceRange" className="form-label">Price Range</label>
              <input
                type="range"
                className="form-range"
                id="priceRange"
                min="0"
                max="1000"
                value={priceRangeValue.max} // Use priceRangeValue to display slider value
                onChange={(e) => {
                  setPriceRangeValue({ ...priceRangeValue, max: parseInt(e.target.value) });
                  setPriceRange({ ...priceRange, max: parseInt(e.target.value) });
                }}
              />
              <div className="d-flex justify-content-between">
                <span>{priceRange.min} TND</span>
                <span>{priceRangeValue.max} TND</span> {/* Display slider value */}
                <span>1000 TND</span>
              </div>
            </div>
            <h2 className="mb-4">Featured Products</h2>
  
            <div className="row row-cols-1 row-cols-md-4 g-4">
              {filteredProducts.map(product => (
                <div key={product._id} className="col">
                  <div className="card h-100">
                    <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                      <img src={`https://deploynodejs-2.onrender.com/uploads/${product.filename}`} className="card-img-top" alt={product.productName} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text">{product.productDescription}</p>
                      <h6>{product.productPrice} TND</h6>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product)}
                        disabled={cartItems.some(item => item._id === product._id)}
                      >
                        {cartItems.some(item => item._id === product._id) ? "Added to Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={floatingCartStyle} onClick={toggleCart}>
            <FaShoppingCart />
            <span style={cartCountStyle}>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
          {showCart && (
            <div style={cartDropdownStyle}>
              <h4>Shopping Cart</h4>
              <div style={cartListStyle}>
                <ul>
                  {cartItems.map(item => (
                    <li key={item._id}>
                      <div>
                        <img src={`https://deploynodejs-2.onrender.com/uploads/${item.filename}`} alt={item.productName} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                        <span>{item.productName} - {item.productPrice} TND - Quantity: {item.quantity}</span>
                        <RiCloseCircleLine className="text-danger" style={{ cursor: 'pointer' }} onClick={() => removeFromCart(item._id)} />
  
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p>Total Price: {totalPrice} TND</p>
              <button className="btn btn-primary" onClick={handleOrder}>Order</button>
            </div>
          )}
        </>
      )}
    </>
  );
  
  
}

export default ProductList;

const floatingCartStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const cartCountStyle = {
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  backgroundColor: 'red',
  color: '#fff',
  padding: '5px 8px',
  borderRadius: '50%',
};

const cartDropdownStyle = {
  position: 'fixed',
  bottom: '100px',
  right: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '10px',
  maxHeight: '300px',
  overflowY: 'auto',
};

const cartListStyle = {
  maxHeight: '240px',
  overflowY: 'auto',
};
