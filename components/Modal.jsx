import React,{ useContext } from 'react'
import { useRouter } from 'next/router';
import { DataContext } from '../store/globalState';
import { deleteItem } from '../store/actions';
import { deleteData } from '../utils/fetchData';

const Modal = () => {
  const router = useRouter()

  const { state, dispatch } = useContext(DataContext)
  const { modal, auth } = state

  const deleteUser = (item) => {
    dispatch(deleteItem(item.data, item.id, item.type))

    deleteData(`user/${item.id}`, auth.token)
    .then(res => {
        if(res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        return dispatch({ type: 'NOTIFY', payload: { success: res.message }})
    })
  }

  const deleteCategories = (item) => {
    deleteData(`categories/${item.id}`, auth.token)
    .then(res => {
        if(res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.error }})

        dispatch(deleteItem(item.data, item.id, item.type))
        return dispatch({ type: 'NOTIFY', payload: { success: res.message }})
    })
  }

  const deleteProduct = (item) => {
    dispatch({type: 'NOTIFY', payload: { loading: true }})
    deleteData(`product/${item.id}`, auth.token)
    .then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: { error: res.error }})
        dispatch({type: 'NOTIFY', payload: { success: res.message }})
        return router.push('/')
    })
  }

  const handleSubmit = () => {
    dispatch(deleteItem(modal.data, modal.id, "ADD_CART"))
    dispatch({ type: "ADD_MODAL", payload: {} })
  }

  return (
    <div
      className="modal fade" id="exampleModal" tabIndex="-1"
      role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
              <h5 className="modal-title text-capitalize" id="exampleModalLabel">
                  {modal.title}
              </h5>
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div className="modal-body">
              Do you want to delete this item?
          </div>
          <div className="modal-footer">
              <button
                type="button" className="btn btn-secondary" data-dismiss="modal"
                style={{ width: 75 }} onClick={handleSubmit}
              >
                Yes
              </button>
              <button
                type="button" className="btn btn-primary" data-dismiss="modal"
              >
                Cancel
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
