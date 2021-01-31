import React, { useContext } from 'react'
import Link from 'next/link';
import { DataContext } from '../store/globalState';
import { addToCart } from '../store/actions';

const ProductItem = ({ product, handleCheck }) => {
  const { state, dispatch } = useContext(DataContext)
  const { cart, auth } = state

  const price = product.price.toLocaleString()

  const userLink = () => {
    return (
      <>
      <Link href={`/product/${product._id}`}>
        <a
          className="btn btn-info"
          style={{ marginRight: 5, flex: 1 }}
        >
          View
        </a>
      </Link>
      <button
        className="btn btn-success"
        style={{ marginLeft: 5, flex: 1 }}
        disabled={product.inStock === 0 ? true : false}
        onClick={() => dispatch(addToCart(product, cart))}
      >
        Buy
      </button>
      </>
    )
  }

  const adminLink = () => {
    return (
      <>
        <Link href={`create/${product._id}`}>
          <a
            className="btn btn-info"
            style={{ marginRight: 5, flex: 1 }}
          >Edit</a>
        </Link>
        <button
          className="btn btn-danger"
          style={{ marginLeft: 5, flex: 1 }}
          data-toggle="modal" data-target="#exampleModal"
          onClick={() => dispatch({
            type: "ADD_MODAL",
            payload: [{
              type: "DELETE_PRODUCT",
              data: "",
              id: product._id,
              title: product.title,
            }]
          })}
        >
          Delete
        </button>
      </>
    )
  }

  return (
    <div className="card" style={{ width: "18rem", borderRadius: 6, boxShadow: "0 2px 6px 0 rgba(0, 0, 0, .3)" }}>
      {auth.user && auth.user.role === "admin" && (
        <input
          className="position-absolute"
          style={{ height: 20, width: 20 }}
          type="checkbox" checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img className="card-img-top" src={product.images[0].url} alt={product.images[0].url}/>
      <div className="card-body">
        <h5 className="card-title text-capitalize" title={product.title}>
          {product.title}
        </h5>
        <div className="row justify-content-between mx-0">
          <h6 className="text-danger">{`¥ ${price}`}</h6>
          {
            product.inStock > 0
            ? <h6 className="text-danger">In Stock: {product.inStock}</h6>
            : <h6 className="text-danger">Out Stock</h6>
          }
        </div>
        <p className="card-text" title={product.description}>
          {product.description}
        </p>
        <div className="row justify-content-between mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  )
}

export default ProductItem
