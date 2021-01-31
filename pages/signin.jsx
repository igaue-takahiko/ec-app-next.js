import React,{ useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

import { DataContext } from '../store/globalState';
import { postData } from '../utils/fetchData';

const initialState = {
  email: "",
  password: ""
}

const Signin = () => {
  const router = useRouter()

  const [ userData, setUserData ] = useState(initialState)
  const { email, password, } = userData

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  useEffect(() => {
    if (Object.keys(auth).length !== 0) {
      router.push("/")
    }
  },[auth])

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    dispatch({ type: "NOTIFY", payload: {} })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: "NOTIFY", payload: { loading: true } })

    const res = await postData('auth/login', userData)
    if (res.error) {
        return dispatch({ type: "NOTIFY", payload: { error: res.error } })
    }
    dispatch({ type: "NOTIFY", payload: { success: res.message } })

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
    }})
    Cookie.set('refreshtoken', res.refresh_token, {
      path: 'api/auth/accessToken',
      expires: 7
    })
    localStorage.setItem('firstLogin', true)
  }

  return (
      <div>
        <Head>
          <title>Sign in Page</title>
        </Head>
        <form className="mx-auto my-4" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail">Email address</label>
            <input
              type="email" className="form-control" id="exampleInputEmail" aria-describedby="emailHelp"
              name="email" value={email} onChange={handleChangeInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword">Password</label>
            <input
              type="password" className="form-control" id="exampleInputPassword"
              name="password" value={password} onChange={handleChangeInput} autoComplete="on"
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Login</button>
          <p className="my-2">
            You don't have an account ? <Link href="/register"><a style={{ color: "crimson" }}> Register Now</a></Link>
          </p>
        </form>
      </div>
    )
}

export default Signin
