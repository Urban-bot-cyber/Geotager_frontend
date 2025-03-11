import React from 'react'
import { NavLink }  from 'react-router-dom'

const Cards: React.FC = () => {
  return (
    <section className="cards-section">
      <h2>Try yourself at Geotagger!</h2>
      <p>
        Try to guess the location of an image by selecting a position on the
        map. When you guess it, it gives you the error distance.
      </p>

      <div className="cards">
        <div className="card">
          <div className="card-image locked">
            {<img src="/images/LocationsSample/velenje.png" alt="city scene" />}
          </div>
        </div>
        <div className="card">
          <div className="card-image locked">
            {<img src="/images/LocationsSample/bled.png" alt="lake view" />}
          </div>
        </div>
        <div className="card">
          <div className="card-image locked">
            {<img src="/images/LocationsSample/logatec.png" alt="european street" />}
          </div>   
        </div>
      </div>

      <div className="cards-cta">
        <NavLink to="/signup" className="btn primary">
          Sign up
        </NavLink>
      </div>
    </section>
  )
}

export default Cards