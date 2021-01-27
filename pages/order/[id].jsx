import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DataContext } from '../../store/globalState';
import { OrderDetailItem } from '../../components';

const OrderDetail = () => {
  const router = useRouter()

  const { state, dispatch } = useContext(DataContext)
  const { orders, auth } = state

  const [ orderDetail, setOrderDetail ] = useState([])

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id)
    setOrderDetail(newArr)
  },[orders])

  if (!auth) {
    return null
  }

  return (
    <div className="my-3">
      <Head>
        <title>Detail Order</title>
      </Head>
      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true" />
          {" Go Back"}
        </button>
      </div>
      <OrderDetailItem orderDetail={orderDetail} state={state} dispatch={dispatch} />
    </div>
  )
}

export default OrderDetail
