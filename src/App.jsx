import { useState } from 'react'
import nutella from './assets/nutella.jpg'
import './App.css'
import axios from "axios"

function App() {
  const products = [
    {
      id: 1,
      name: "Nutella Hazelnut Spread / 350g",
      image: nutella,
      rating: "4.0",
      price: 350,
      originalPrice: 550,
      buyers: "(120,243)",
      desp: "Start the day with a smile. Nutella taste delicious on so many foods, such as pancakes, toast, crumpets and fresh fruit."
    },

  ]

  const serverURL = "https://razorpay-server-production.up.railway.app/api/payment"

  const handleClick = async () => {
    const { data } = await axios.post(`${serverURL}/orders`, { amount: products[0].price })
    initpayment(data)
  }

  const initpayment = (orderData) => {
    console.log(orderData)
    const options = {
      key: "rzp_test_nnaRhQCwZVr080",
      amount: orderData.data.amount,
      currency: orderData.data.currency,
      description: "Test Payment Method",
      order_id: orderData.data.id,
      handler: async (res) => {
        await axios.post(`${serverURL}/verify`, res).then((response) => {
          if (response.status === 200) {
            alert(`Payment successful! Payment ID: ${response.data.razorpay_payment_id}`);
          } else {
            alert(`Payment Failed! Payment ID: ${response.data.razorpay_payment_id}`);
          }
        });
      },

      theme: {
        color: '#3399cc'
      }
    }
    const razor_popup = new window.Razorpay(options)
    razor_popup.open()
  }

  return (
    <>
      <div className="container">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="card-details">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <div className="star">
                <p>{product.rating}</p>
                {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
                <p>{product.buyers}</p>
              </div>
              <p className='brand'>Brand: Nutella</p>
              <p className='desp'>{product.desp}</p>
              <div className="price-details">
                <p>₹</p>
                <p className="price">{product.price}</p>
                <del>₹{product.originalPrice}</del>
              </div>
              <button className="btn" onClick={handleClick}>
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
