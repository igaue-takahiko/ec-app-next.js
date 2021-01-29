import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DataContext } from '../store/globalState';
import Cookie from 'js-cookie';

const Navbar = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(DataContext)
  const { auth, cart } = state

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active"
    } else {
      return ""
    }
  }

  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" })
    localStorage.removeItem("firstLogin")
    dispatch({ type: "AUTH", payload: {} })
    dispatch({ type: "NOTIFY", payload: { success: "Logged out!" } })
    return router.push("/")
  }

  const adminRouter = () => {
    return (
      <>
      <Link href="/users">
        <a className="dropdown-item">Users</a>
      </Link>
      <div className="dropdown-divider" />
      <Link href="/create">
        <a className="dropdown-item">Products</a>
      </Link>
      <div className="dropdown-divider" />
      <Link href="/categories">
        <a className="dropdown-item">Categories</a>
      </Link>
      </>
    )
  }

  const loggedRouter = () => (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
      >
        <img
          style={{
            borderRadius: "50%", width: 30, height: 30,
            transform: "translateY(-3px)", marginRight: 3,
          }}
          src={auth.user.avatar} alt={auth.user.avatar}
        /> {auth.user.name}
      </a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <Link href="/profile">
          <a className="dropdown-item" style={{ cursor: "pointer" }} >Profile</a>
        </Link>
        <div className="dropdown-divider" />
        {auth.user.role === "admin" && adminRouter()}
        <button className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</button>
      </div>
    </li>
  )

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        style={{ position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 4px 0 rgba(0, 0, 0, .3)" }}
      >
        <Link href="/">
            <a className="navbar-brand ml-4">T.I SHOP</a>
        </Link>
        <button className="navbar-toggler" style={{ outline: "none" }} type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end mr-4" id="navbarNavDropdown">
          <ul className="navbar-nav p-1">
            <li className="nav-item">
              <Link href="/cart">
                <a className={"nav-link" + isActive("/cart")}>
                  <i className="fas fa-shopping-cart position-relative" aria-hidden="true"></i>
                  {cart.length > 0 && (
                    <span
                      className="position-absolute"
                      style={{
                        padding: "2px 6px",
                        background: "#ed143dc2",
                        borderRadius: "50%",
                        color: "white",
                        fontSize: "10px",
                        transform: "translateX(-50%) translateY(-50%)"
                      }}
                    >
                      {cart.length}
                    </span>
                  )}
                    {" Cart"}
                </a>
              </Link>
            </li>
            {
              Object.keys(auth).length === 0 ? (
                <li className="nav-item">
                  <Link href="/signin">
                    <a className={"nav-link" + isActive("/signin")}>
                      <i className="fas fa-user" aria-hidden="true" />
                      {" Sign in"}
                    </a>
                  </Link>
                </li>
              ) : loggedRouter()
            }
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar
