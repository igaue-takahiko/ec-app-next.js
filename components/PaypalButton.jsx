import React, { useRef, useEffect, useContext } from 'react'
import { patchData } from '../utils/fetchData';
import { DataContext } from '../store/globalState';
import { updateItem } from '../store/actions';

const PaypalButton = ({ order }) => {
  const refPaypalButton = useRef()

  const { state, dispatch } = useContext(DataContext)
  const { auth, orders } = state

  useEffect(() => {
    paypal.Buttons({
      createOrder: function(data, actions) {
        // このfunctionは、金額や行項目の詳細など、取引の詳細を設定します。
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: order.total
            }
          }]
        })
      },
      onApprove: function(data, actions) {
        //このfunctionは、トランザクションから資金を取得します。
        dispatch({ type: "NOTIFY", payload: { loading: true } })

        return actions.order.capture().then(function(details) {
          patchData(`order/payment/${order._id}`, {
            paymentId: details.payer.payer_id
          }, auth.token).then((res) => {
            if (res.error) {
              return dispatch({ type: "NOTIFY", payload: { error: res.error } })
            }
            dispatch(updateItem(orders, order_id, {
              ...order,
              paid: true,
              dateOfPayment: details.create_time,
              paymentId: details.payer.payer_id,
              method: "Paypal"
            }, "ADD_ORDERS"))

            return dispatch({ type: "NOTIFY", payload: { success: res.message } })
          })
          //このfunctionは、購入者にトランザクション成功メッセージを表示します。
        })
      }
    }).render(refPaypalButton.current)
  },[])

  return (
    <div ref={refPaypalButton}></div>
  )
}

export default PaypalButton
