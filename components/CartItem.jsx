import React, { useState } from 'react'
import Link from 'next/link';
import { increase, decrease } from '../store/actions';

const CartItem = ({ item, dispatch, cart }) => {

  const totalPrice = (item.quantity * item.price).toLocaleString()

  return (
    <>
      <tr>
        <td style={{ width: 100, overflow: "hidden" }}>
          <img
            className="img-thumbnail w-100"
            style={{ minWidth: 80, height: 80 }}
            src={item.images[0].url} alt={item.images[0].url}
          />
        </td>
        <td className="w-50 align-middle" style={{ minWidth: 100 }}>
          <h5 className="text-capitalize text-secondary">
            <Link href={`/product/${item._id}`}>
              <a>{item.title}</a>
            </Link>
          </h5>
          <h6 className="text-danger">{`¥ ${totalPrice}`}</h6>
            {
              item.inStock > 0
              ? <p className="mb-1 text-danger">In Stock: {item.inStock}</p>
              : <p className="mb-1 text-danger">Out Stock</p>
            }
        </td>
        <td className="align-middle" style={{ minWidth: 150 }}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(decrease(cart, item._id))}
            disabled={item.quantity === 1 ? true : false}
          > - </button>
          <span className="px-3">{item.quantity}</span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(increase(cart, item._id))}
            disabled={item.quantity === item.inStock ? true : false}
          > + </button>
        </td>
        <td className="align-middle" style={{ minWidth: 50, cursor: "pointer" }}>
            <i
              className="far fa-trash-alt text-danger" aria-hidden="true"
              style={{ fontSize: 26 }} data-toggle="modal" data-target="#exampleModal"
              onClick={() => {
                dispatch({
                  type: "ADD_MODAL",
                  payload: { data: cart, id: item._id, title: item.title }
                })
              }}
            />
        </td>
      </tr>
    </>
  )
}

export default CartItem
