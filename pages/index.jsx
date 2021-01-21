import React, { useState } from 'react'
import { getData } from '../utils/fetchData';
import Head from 'next/head';
import { ProductItem } from '../components';

const Home = (props) => {
  const [ products, setProducts ] = useState(props.products)

    return (
        <div className="products">
            <Head>
              <title>Home Page</title>
            </Head>
            {
              products.length === 0
              ? <h2>No Product</h2>
              : products.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))
            }
        </div>
    )
}

export async function getServerSideProps() {
  const res = await getData("product")
  console.log(res);
  return {
    props: {
      products: res.products,
      result: res.result,
    }
  }
}

export default Home

