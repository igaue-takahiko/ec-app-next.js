import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DataContext } from '../store/globalState';
import { getData } from '../utils/fetchData';
import filterSearch from '../utils/filterSearch';
import { ProductItem, Filter } from '../components';

const Home = (props) => {
  const router = useRouter()

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const [ products, setProducts ] = useState(props.products)
  const [ isCheck, setIsCheck ] = useState(false)
  const [ page, setPage ] = useState(1)

  useEffect(() => {
    setProducts(props.products)
  },[props.products])

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      setPage(1)
    }
  },[router.query])

  const handleClick = (id) => {
    products.forEach(product => {
      if (product._id === id) {
        product.checked = !product.checked
      }
    });
    setProducts([...products])
  }

  const handleCheckALL = () => {
    products.forEach(product => {
      product.checked = !isCheck
    })
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const handleDeleteAll = () => {
    let deleteArr = []
    products.forEach(product => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          title: "Delete all selected products ?",
          type: "DELETE_PRODUCT"
        })
      }
    })
    dispatch({ type: "ADD_MODAL", payload: deleteArr })
  }

  const handleLoadMore = () => {
    setPage(page + 1)
    filterSearch({ router, page: page + 1 })
  }

  return (
    <div className="home_page">
      <Head>
        <title>Home Page</title>
      </Head>
      <Filter state={state} />
      {auth.user && auth.user.role === "admin" && (
        <div
          className="delete_all btn btn-danger mt-2"
          style={{ marginBottom: "-10px" }}
        >
          <input
            style={{ width: 25, height: 25, transform: "translateY(8px)" }}
            type="checkbox" checked={isCheck} onChange={handleCheckALL}
          />
          <button
            className="btn btn-danger ml-2"
            data-toggle="modal" data-target="#exampleModal"
            onClick={handleDeleteAll}
          >
            DELETE ALL
          </button>
        </div>
      )}
      <div className="products">
        {
          products.length === 0
          ? <h2>No Product</h2>
          : products.map((product) => (
            <ProductItem key={product._id} product={product} handleCheck={handleClick} />
          ))
        }
      </div>
      {
        props.result < page * 6 ? ""
        : <button
            className="btn btn-outline-info d-block mx-auto mb-4"
            onClick={handleLoadMore}
          >
          Load more
        </button>
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

