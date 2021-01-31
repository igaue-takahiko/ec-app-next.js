import React, { useContext, useState, useEffect } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { imageUpload } from '../../utils/imageUpload';
import { postData, getData, putData } from '../../utils/fetchData';
import { DataContext } from '../../store/globalState';

const initialState = {
  title: "",
  price: 0,
  inStock: 0,
  description: "",
  content: "",
  category: ""
}

const ProductsManager = () => {
  const router = useRouter()
  const { id } = router.query

  const { state, dispatch } = useContext(DataContext)
  const { auth, categories } = state

  const [ product, setProduct ] = useState(initialState)
  const [ images, setImages ] = useState([])
  const [ onEdit, setOnEdit ] = useState(false)

  const { title, price, inStock, description, content, category } = product

  useEffect(() => {
    if (id) {
      setOnEdit(true)
      getData(`product/${id}`).then((res) => {
        setProduct(res.product)
        setImages(res.product.images)
      })
    } else {
      setOnEdit(false)
      setProduct(initialState)
      setImages([])
    }
  },[id])

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
    dispatch({ type: "NOTIFY", payload: {} })
  }

  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} })
    let newImages = []
    let num = 0
    let error = ""
    const files = [...e.target.files]

    if (files.length === 0) {
      return dispatch({ type: "NOTIFY", payload: { error: "Files does not exist." } })
    }
    files.forEach((file) => {
      if (file.size > 1024 * 1024) {
        return error = "The largest image size is 1mb"
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return error = "Image format is incorrect."
      }

      num += 1
      if (num <= 5) {
        newImages.push(file)
        return newImages
      }
    })
    if (error) {
      dispatch({ type: "NOTIFY", payload: { error: error } })
    }

    const imageCount = images.length
    if (imageCount + newImages.length > 5) {
      return dispatch({ type: "NOTIFY", payload: { error: "Select up to 5 images." } })
    }
    setImages([ ...images, ...newImages ])
  }

  const deleteImage = (index) => {
    const newArr = [...images]
    newArr.splice(index, 1)
    setImages(newArr)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (auth.user.role !== "admin") {
      return dispatch({ type: "NOTIFY", payload: { error: "Authentication is not valid." } })
    }
    if (!title || !price || !inStock || !description || !content || category === "all") {
      return dispatch({ type: "NOTIFY", payload: { error: "Please add all the files." } })
    }

    dispatch({ type: "NOTIFY", payload: { loading: true } })
    let media = []
    const imageNewURL = images.filter(img => !img.url)
    const imageOldURL = images.filter(img => img.url)

    if (imageNewURL.length > 0) {
      media = await imageUpload(imageNewURL)
    }

    let res
    if (onEdit) {
      res = await putData(`product/${id}`, {
        ...product,
        images: [ ...imageOldURL, ...media ],
      }, auth.token)
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }
    } else {
      res = await postData("product", {
        ...product,
        images: [ ...imageOldURL, ...media ]
      }, auth.token)
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }
      setProduct(initialState)
    }
    return dispatch({ type: "NOTIFY", payload: { success: res.message } })
  }

  if (!auth.user) {
    return null
  }

  return (
    <div className="products_manager">
      <Head>
        <title>Products Manager</title>
      </Head>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            className="d-block my-4 w-100 p-2" type="text" value={title}
            name="title" placeholder="Title" onChange={handleChangeInput}
          />
          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="price">Price</label>
              <input
                className="d-block my-4 w-100 p-2" type="number" value={price}
                name="price" placeholder="Price" onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-6">
              <label htmlFor="inStock">In Stock</label>
              <input
                className="d-block my-4 w-100 p-2" type="number" value={inStock}
                name="inStock" placeholder="In Stock" onChange={handleChangeInput}
              />
            </div>
          </div>
          <textarea
            className="d-block my-4 w-100 p-2" id="description"
            name="description" cols="30" rows="4" value={description}
            placeholder="Description" onChange={handleChangeInput}
          />
          <textarea
            className="d-block my-4 w-100 p-2" id="content"
            name="content" cols="30" rows="6" value={content}
            placeholder="Content" onChange={handleChangeInput}
          />
          <div className="input-group-prepend px-0 my-2">
            <select
              className="custom-select text-capitalize"
              name="category" id="category" value={category}
              onChange={handleChangeInput}
            >
              <option value="all">All Products</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-info my-2 px-4"
            type="submit"
          >
            {onEdit ? "Update": "Create"}
          </button>
        </div>
        <div className="col-md-6 my-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Upload</span>
            </div>
            <div className="custom-file border rounded">
              <input
                className="custom-file-input" multiple
                type="file" accept="image/*"
                onChange={handleUploadInput}
              />
            </div>
          </div>
          <div className="row img-up mx-0">
            {images.map((img, index) => (
              <div className="file_img my-1" key={index}>
                <img
                  className="img-thumbnail rounded"
                  src={img.url ? img.url : URL.createObjectURL(img)} alt="thumbnail image"
                />
                <span onClick={() => deleteImage(index)}>&times;</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductsManager
