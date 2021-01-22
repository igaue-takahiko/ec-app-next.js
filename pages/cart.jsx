import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { DataContext } from '../store/globalState';
import { CartItem } from '../components';
import { getData } from '../utils/fetchData';

const Cart = () => {
  const [ state, dispatch ] = useContext(DataContext)
  const { cart, auth } = state

  const [ total, setTotal ] = useState(0)

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <img className="img-responsive w-100" src="/shopping-image.jpg" alt="cart image"/>
        <h4 className="text-info">Currently the cart is empty</h4>
      </div>
    )
  }

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
      },0)
      setTotal(res)
    }
    getTotal()
  },[cart])

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("__next__cart01__ti_shop"))
    if (cartLocal && cartLocal.length > 0) {
      let newArr = []
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`)
          const { _id, title, images, price, inStock, sold } = res.product
          if (inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity
            })
          }
        }
        dispatch({ type: "ADD_CART", payload: newArr })
      }
      updateCart()
    }
  },[])

    return (
        <div className="row mx-auto">
            <Head>
              <title>Cart Page</title>
            </Head>
            <div className="col-md-8 text-secondary table-responsive my-3">
              <h2 className="text-uppercase">Shopping Cart</h2>
              <table className="table my-3">
                <tbody>
                  {
                    cart.map((item) => (
                      <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} />
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="col-md-4 my-3 text-uppercase text-secondary">
              <form>
                <h2>shipping</h2>
                <label htmlFor="address">Address</label>
                <input
                  className="form-control mb-2"
                  type="text" id="address" name="address"
                />
                <label htmlFor="mobile">Mobile</label>
                <input
                  className="form-control mb-2"
                  type="text" id="mobile" name="mobile"
                />
              </form>
              <h3>Total: <span className="text-danger">{`¥ ${total.toLocaleString()}`}</span></h3>
              <Link href={auth.user ? "#" : "/signin"}>
                <a className="btn btn-dark my-2">Password with payment</a>
              </Link>
            </div>
        </div>
    )
}

export default Cart
