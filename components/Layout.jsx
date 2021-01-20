import React from 'react';
import Navbar from './Navbar';
import Notify from './Notify';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main  className="container">
                <Notify />
                {children}
            </main>
        </div>
    )
}

export default Layout
