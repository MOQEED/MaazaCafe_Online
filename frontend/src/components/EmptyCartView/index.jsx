import {Link} from 'react-router'

import './index.css'

const EmptyCartView = () => (
  <div className="cart-empty-view-container">
    <img
      src="/empty-cart-cafe.svg"
      className="cart-empty-image"
      alt="empty plate"
    />
    <h1 className="cart-empty-heading">Your Plate Is Empty</h1>
    <p style={{color: '#78350f', fontFamily: "'Roboto', sans-serif", marginTop: 0, marginBottom: 20}}>
      Looks like you haven&apos;t ordered any delicious food yet!
    </p>

    <Link to="/products">
      <button type="button" className="shop-now-btn">
        Explore Menu
      </button>
    </Link>
  </div>
)

export default EmptyCartView
