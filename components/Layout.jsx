import React from 'react';
import Navbar from './Navbar';
import Notify from './Notify';
import Modal from './Modal';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main  className="container">
          <Notify />
          <Modal />
          {children}
      </main>
    </div>
  )
}

export default Layout
