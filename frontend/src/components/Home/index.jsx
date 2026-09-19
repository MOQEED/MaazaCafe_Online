import {Link} from 'react-router'

import Header from '../Header'

import './index.css'

const Home = () => {
  return (
    <div className="bg-container">
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Delicious Flavors That Warm Your Soul</h1>
          <img
            src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
            alt="Maaza Cafe Delicious Food Feast"
            className="home-mobile-img"
          />
          <p className="home-description">
            Welcome to Maaza Cafe! Indulge in our authentic Hyderabadi Dum Biryani,
            slow-brewed Irani Dum Chai, Tiffins, sizzling Shawarmas, Fast Food,
            Chat Bandi, fresh Juices, and royal Desserts crafted with passion
            and authentic heritage recipes.
          </p>
          <Link to="/products">
            <button type="button" className="shop-now-button">
              Order Now
            </button>
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
          alt="Maaza Cafe Delicious Food Feast"
          className="home-desktop-img"
        />
      </div>
    </div>
  )
}

export default Home
