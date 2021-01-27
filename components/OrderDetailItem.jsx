import React from 'react'
import Link from 'next/link';
import { patchData } from '../utils/fetchData';
import { updateItem } from '../store/actions';
import PaypalButton from './PaypalButton';

const OrderDetailItem = ({ orderDetail, state, dispatch }) => {
  const { auth, orders } = state

  const handleDelivered = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } })
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }

      const { paid, dateOfPayment, method, delivered } = res.result
      dispatch(updateItem(orders, order._id, {
        ...order,
        paid,
        dateOfPayment,
        method,
        delivered,
      }, "ADD_ORDERS"))
      return dispatch({ type: "NOTIFY", payload: { success: res.message } })
    })
  }

  if (!auth.user) {
    return null
  }

  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id} className="row justify-content-around"
          style={{ margin: "20px auto" }}
        >
          <div className="text-uppercase my-3" style={{maxWidth: '600px'}}>
            <h2>{`Order ${order._id}`}</h2>
            <div className="mt-4 text-secondary">
              <h3>Shipping</h3>
              <p>{`Name ${order.user.name}`}</p>
              <p>{`Email ${order.user.email}`}</p>
              <p>{`Address ${order.address}`}</p>
              <p>{`Mobile: ${order.mobile}`}</p>
              <div
                className={`alate ${order.delivered ? "alert-success" : "alert-danger"} d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered ? `Delivered on ${order.updatedAt}` : "Not Delivered"}
                {auth.user.role === "admin" && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>
              <h3>Payment</h3>
              {order.method && (
                <h6>Method: <em>{order.method}</em></h6>
              )}
              {order.paymentId && (
                <p>PaymentId: <em>{order.paymentId}</em></p>
              )}
              <div
                className={`alate ${order.paid ? "alert-success" : "alert-danger"} d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid ? `Paid on ${order.dateOfPayment}`: "Not Paid"}
              </div>
              <div>
                <h3>Order Items</h3>
                {order.cart.map((item) => (
                  <div
                    key={item._id}
                    className="row border-bottom mx-0 p-2 justify-content-between align-items-center"
                    style={{ maxWidth: 550 }}
                  >
                    <img
                      style={{ width: 50, height: 45, objectFit: "cover" }}
                      src={item.images[0].url} alt={item.images[0].url}
                    />
                    <h5 className="flex-fill text-secondary px-3 m-0">
                      <Link href={`product/${item._id}`}>
                        <a>{item.title}</a>
                      </Link>
                    </h5>
                    <span className="text-info m-0">
                      {`${item.quantity} X ${item.price} = ¥ ${item.price * item.quantity}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {!order.paid && auth.user.role !== "admin" && (
            <div className="p-4">
              <h2 className="mb-4 text-uppercase">{`Total: ${order.total}`}</h2>
              <PaypalButton order={order} />
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default OrderDetailItem
