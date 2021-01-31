import React, { useContext, useState, useCallback } from 'react'
import Head from 'next/head';

import { DataContext } from '../store/globalState';
import { updateItem } from '../store/actions';
import { postData, putData } from '../utils/fetchData';

const Categories = () => {
  const { state, dispatch } = useContext(DataContext)
  const { auth, categories } = state

  const [ name, setName ] = useState("")
  const [ id, setId ] = useState("")

  const inputName = useCallback((e) => {
    setName(e.target.value)
  },[setName])

  const createCategory = async () => {
    if (auth.user.role !== "admin") {
      return dispatch({ type: "NOTIFY", payload: { error: "Authentication is not valid." } })
    }

    if (!name) {
      return dispatch({ type: "NOTIFY", payload: { error: "Name can not be left blank." } })
    }

    dispatch({ type: "NOTIFY", payload: { loading: true } })

    let res
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token)
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }
      dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"))
    } else {
      res = await postData("categories", { name }, auth.token)
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }
      dispatch({ type: "ADD_CATEGORIES", payload: [ ...categories, res.newCategory ] })
    }
    setName("")
    setId("")
    return dispatch({ type: "NOTIFY", payload: { success: res.message } })
  }

  const handleEditCategory = (category) => {
    setId(category._id)
    setName(category.name)
  }

  return (
    <div className="col-mb-6 mx-auto my-3">
      <Head>
        <title>Categories</title>
      </Head>
      <div className="input-group mb-3">
        <input
          className="form-control" type="text" placeholder="Add a new category"
          value={name} onChange={inputName}
        />
        <button
          className="btn btn-secondary ml-1"
          onClick={createCategory}
        >
          {id ? "Update" : "Create"}
        </button>
      </div>
        {categories.map((category) => (
          <div className="card my-2 text-capitalize" key={category._id}>
            <div className="card-body d-flex justify-content-between">
              {category.name}
              <div style={{ cursor: "pointer", display: "flex" }}>
                <div
                  onClick={() => handleEditCategory(category)}
                >
                  <i className="fas fa-edit mr-2 text-info"></i>
                </div>
                <div
                  onClick={() => dispatch({
                    type: "ADD_MODAL",
                    payload: [{
                      data: categories,
                      id: category._id,
                      title: category.name,
                      type: "ADD_CATEGORIES"
                    }]
                  })}
                >
                  <i
                    className="fas fa-trash-alt mr-2 text-danger"
                    data-toggle="modal" data-target="#exampleModal"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Categories
