import { FC, ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="layout-container p-4 ms-2 me-2">{children}</div>
      <Footer />
    </>
  )
}

export default Layout
