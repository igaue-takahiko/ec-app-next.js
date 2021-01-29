import React from 'react'

const Toast = ({ message, handleShow, bgColor }) => {

  return (
    <div
        className={`toast show position-fixed text-light ${bgColor}`}
        style={{ top: '15px', right: '15px', zIndex: 10, minWidth: '280px' }}
        role="alert" aria-live="assertive" aria-atomic="true"
    >
        <div className={`toast-header ${bgColor} text-light`}>
            <strong className="mr-auto">{message.title}</strong>
            <button
              className="ml-2 mb-1 close text-light" type="button"
              data-dismiss="toast" aria-label="Close"
              style={{ outline: "none" }}
              onClick={handleShow}
            >
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="toast-body">
          {message.message}
        </div>
    </div>
  )
}

export default Toast
