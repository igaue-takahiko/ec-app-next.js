import React, { useContext, useState, useEffect } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DataContext } from '../../store/globalState';
import { updateItem } from '../../store/actions';
import { patchData } from '../../utils/fetchData';

const EditUser = () => {
  const router = useRouter()

  const { id } = router.query

  const { state, dispatch } = useContext(DataContext)
  const { auth, users } = state

  const [ editUser, setEditUser ] = useState([])
  const [ checkAdmin, setCheckAdmin ] = useState(false)
  const [ num, setNum ] = useState(0)

  useEffect(() => {
    users.forEach(user => {
      if (user._id === id) {
        setEditUser(user)
        setCheckAdmin(user.role === "admin" ? true : false)
      }
    });
  },[users])

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin)
    setNum(num + 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let role = checkAdmin ? "admin" : "user"
    if (num % 2 !== 0) {
      dispatch({ type: "NOTIFY", payload: { loading: true } })
      patchData(`user/${editUser._id}`, { role }, auth.token).then((res) => {
        if (res.error) {
          return dispatch({ type: "NOTIFY", payload: { error: res.error } })
        }
        dispatch(updateItem(users, editUser._id, {
          ...editUser,
          role,
        }, "ADD_USERS"))
        return dispatch({ type: "NOTIFY", payload: { success: res.message } })
      })
    }
  }

  return (
    <div className="edit_user my-3 p-2">
      <Head>
        <title>Edit User</title>
      </Head>
      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden></i>
          {" Go Back"}
        </button>
      </div>
      <form className="col-md-12 my-4">
        <h2 className="text-uppercase text-secondary">Edit User</h2>
        <div className="form-group">
          <label className="d-block" htmlFor="name">Name</label>
          <input
            className="form-control"
            type="text" id="name" defaultValue={editUser.name} disabled
          />
        </div>
        <div className="form-group">
          <label className="d-block" htmlFor="email">Email</label>
          <input
            className="form-control"
            type="text" id="email" defaultValue={editUser.email} disabled
          />
        </div>
        <div className="form-group">
          <input
            style={{ width: 20, height: 20 }}
            type="checkbox" id="isAdmin"
            checked={checkAdmin} onChange={handleCheck}
          />
          <label style={{ transform: "translate(4px, -3px)" }} htmlFor="isAdmin">
            isAdmin
          </label>
        </div>
        <button className="btn btn-dark" onClick={handleSubmit}>Update</button>
      </form>
    </div>
  )
}

export default EditUser
