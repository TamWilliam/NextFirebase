import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto">{children}</div>
    </div>
  )
}

export default Layout
