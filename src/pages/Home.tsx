import React from 'react'
import Header from '../components/home/Header'
import Hero from '../components/home/hero'
import Cards from '../components/home/Cards'
import Footer from '../components/home/Footer'
import authStore from 'stores/auth.store'

const HomePage: React.FC = () => {
  const isAuthenticated = authStore.isAuthenticated() // Check if user is authenticated

  return (
    <div className="home-page">
      <Header />
      <Hero />
      {!isAuthenticated && <Cards />} {/* Hide Cards if logged in */}
      <Footer />
    </div>
  )
}

export default HomePage