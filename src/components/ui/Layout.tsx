import { FC, ReactNode } from 'react'
import Footer from './Footer'
import Header from 'components/home/Header'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="layout-container p-4 ms-2 me-2">{children}</div>
      <Footer />
    </>
  )
}

export default Layout
