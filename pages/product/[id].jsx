import React, { useState, useContext } from "react";
import Head from "next/head";
import { getData } from '../../utils/fetchData';
import { DataContext } from '../../store/globalState';
import { addToCart } from '../../store/actions';

const ProductDetail = (props) => {
  const [ product, setProduct ] = useState(props.product)
  const [ tab, setTab ] = useState(0)

  const [ state, dispatch ] = useContext(DataContext)
  const { cart } = state

  const price = product.price.toLocaleString()

  const isActive = (index) => {
    if (tab === index) {
      return " active"
    }
    return ""
  }

  return (
    <div className="row detail_page">
      <Head>
        <title>Product Detail</title>
      </Head>
      <div className="col-md-6">
        <img
          className="d-block img-thumbnail rounded mt-4 w-100"
          style={{ height: 350 }}
          src={product.images[tab].url} alt={product.images[tab].url}
        />
        <div className="row mx-0" style={{ cursor: "pointer" }}>
          {product.images.map((img, index) => (
            <img
              className={`img-thumbnail rounded ${isActive(index)}`}
              style={{ height: 80, width: "20%" }}
              key={index} src={img.url} alt={img.url}
              onClick={() => setTab(index)}
            />
          ))}
        </div>
      </div>
      <div className="col-md-6" style={{ marginTop: 20 }}>
        <h2 className="text-uppercase">{product.title}</h2>
        <h5 className="text-danger">{`¥ ${price}`}</h5>
        <div className="row mx-0 d-flex justify-content-between">
          {
            product.inStock > 0
            ? <h6 className="text-danger">In Stock: {product.inStock}</h6>
            : <h6 className="text-danger">Out Stock</h6>
          }
          <h6 className="text-danger">Sold: {product.sold}</h6>
        </div>
        <div className="my-2">{product.description}</div>
        <div className="my-2">
          {product.content}
        </div>
        <button
          className="btn btn-dark d-block my-3 w-50"
          style={{ margin: "0 auto" }}
          type="button"
          onClick={() => dispatch(addToCart(product, cart))}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);
  return {
    props: {
      product: res.product,
    },
  };
}

export default ProductDetail;
