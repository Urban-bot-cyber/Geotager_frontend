import React from 'react'
import Header from '../components/home/Header'
import Hero from '../components/home/hero'
import Cards from '../components/home/Cards'
import ActivityLog from './ActivityLog'
import Footer from '../components/home/Footer'
import authStore from 'stores/auth.store'

const HomePage: React.FC = () => {
  const isAuthenticated = authStore.isAuthenticated() // Check if user is authenticated
  const isAdmin = authStore.user?.role === 'admin'  // Check if the user role is "admin"
  
  return (
    <div className="home-page">
      <Header />
      <div className="layout-container">
        {isAuthenticated ? (
          // If authenticated:
          isAdmin ? <ActivityLog /> : <Hero />
        ) : (
          // If not authenticated: show both Hero and Cards
          <>
            <Hero />
            <Cards />
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default HomePage