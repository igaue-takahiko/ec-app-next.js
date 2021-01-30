import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { DataContext } from '../store/globalState';

import valid from '../utils/valid';
import { patchData } from '../utils/fetchData';
import { imageUpload } from '../utils/imageUpload';

const initialState = {
  avatar: "",
  name: "",
  password: "",
  cf_password: "",
}

const Profile = () => {
  const { state, dispatch } = useContext(DataContext)
  const { auth, notify, orders } = state

  const [ data, setData ] = useState(initialState)
  const { avatar, name, password, cf_password } = data

  useEffect(() => {
    if (auth.user) {
      setData({ ...data, name: auth.user.name })
    }
  },[auth.user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
    dispatch({ type: "NOTIFY", payload: {} })
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    if (password) {
      const errorMessage = valid(name, auth.user.email, password, cf_password)
      if (errorMessage) {
        return dispatch({ type: "NOTIFY", payload: { error: errorMessage } })
      }
      updatePassword()
    }
    if (name !== auth.user.name || avatar) {
      updateInfo()
    }
  }

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } })
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }
      return dispatch({ type: "NOTIFY", payload: { success: res.message } })
    })
  }

  const changeAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) {
      return dispatch({ type: "NOTIFY", payload: { error: "File dose not exist." } })
    }

    if (file.size > 1024 * 1024) { //1mb
      return dispatch({ type: "NOTIFY", payload: { error: "The largest image size is 1mb." } })
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") { //1mb
      return dispatch({ type: "NOTIFY", payload: { error: "Image format is incorrect." } })
    }
    setData({ ...data, avatar: file })
  }

  const updateInfo = async () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } })
    let media
    if (avatar) {
      media = await imageUpload([avatar])
    }

    patchData("user", {
      name,
      avatar: avatar ? media[0].url : auth.user.avatar
    }, auth.token).then((res) => {
      if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
      }
      dispatch({ type: "AUTH", payload: {
        token: auth.token,
        user: res.user,
      } })
      return dispatch({ type: "NOTIFY", payload: { success: res.message } })
    })
  }

  if (!auth.user) {
    return null
  }

  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>
      <section className="row text-secondary my-3">
        <div className="col-md-3"  style={{ marginBottom: 20 }}>
          <h3 className="text-center text-uppercase">
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </h3>
          <div className="avatar">
            <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt="avatar" />
            <span>
              <i className="fas fa-camera" />
              <p>Change</p>
              <input
                type="file" name="file" id="file_up"
                accept="image/*" onChange={changeAvatar}
              />
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              className="form-control" type="text" name="name" value={name}
              placeholder="Your name" onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="form-control" type="text" name="email"
              defaultValue={auth.user.email} disabled={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              className="form-control" type="password" name="password" value={password}
              placeholder="Your new password" onChange={handleChange} autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cf_password">Confirm New Password</label>
            <input
              className="form-control" type="password" name="cf_password" value={cf_password}
              placeholder="Confirm new password" onChange={handleChange} autoComplete="off"
            />
          </div>
          <button
            className="btn btn-info" disabled={notify.loading}
            style={{ width: 220 }}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
        <div className="col-md-8">
          <h3 className="text-uppercase">Orders</h3>
          <div className="my-3 table-responsive">
            <table
              className="table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: 600, cursor: "pointer" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>
                        <a>{order._id}</a>
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">{`¥ ${(order.total).toLocaleString()}`}</td>
                    <td className="p-2">
                      {
                        order.delivered
                        ? <i className="fas fa-check text-success"/>
                        : <i className="fas fa-times text-danger"/>
                      }
                    </td>
                    <td className="p-2">
                      {
                        order.paid
                        ? <i className="fas fa-check text-success"/>
                        : <i className="fas fa-times text-danger"/>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
