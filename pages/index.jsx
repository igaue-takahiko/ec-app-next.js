import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DataContext } from '../store/globalState';
import { getData } from '../utils/fetchData';
import { ProductItem } from '../components';

const Home = (props) => {
  const router = useRouter()

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const [ products, setProducts ] = useState(props.products)

  useEffect(() => {
    setProducts(props.products)
  },[props.products])

  return (
    <div className="products">
      <Head>
        <title>Home Page</title>
      </Head>
      {
        products.length === 0
        ? <h2>No Product</h2>
        : products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))
      }
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const page = query.page || 1
  const category = query.category || "all"
  const sort = query.sort || ""
  const search = query.search || "all"
  const res = await getData(
    `product?limit=${page * 6}&category=${category}&sort=${sort}&title=${search}`
  )
  return {
    props: {
      products: res.products,
      result: res.result,
    }
  }
}

export default Home

