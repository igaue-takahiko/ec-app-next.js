import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DataContext } from '../store/globalState';
import Cookie from 'js-cookie';

const Navbar = () => {
    const router = useRouter()
    const [ state, dispatch ] = useContext(DataContext)
    const { auth } = state

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
    }

    const loggedRouter = () => (
      <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img
              style={{
                borderRadius: "50%", width: 30, height: 30,
                transform: "translateY(-3px)", marginRight: 3,
              }}
              src={auth.user.avatar} alt={auth.user.avatar}
            /> {auth.user.name}
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <p className="dropdown-item" style={{ cursor: "pointer" }} >Profile</p>
              <p className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</p>
          </div>
      </li>
    )

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link href="/">
                    <a className="navbar-brand">T.I SHOP</a>
                </Link>
                <button className="navbar-toggler" style={{ outline: "none" }} type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/cart">
                                <a className={"nav-link" + isActive("/cart")}>
                                    <i className="fas fa-shopping-cart" aria-hidden="true" /> Cart
                                </a>
                            </Link>
                        </li>
                        {
                          Object.keys(auth).length === 0 ? (
                            <li className="nav-item">
                                <Link href="/signin">
                                    <a className={"nav-link" + isActive("/signin")}>
                                        <i className="fas fa-user" aria-hidden="true" /> Sign in
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
