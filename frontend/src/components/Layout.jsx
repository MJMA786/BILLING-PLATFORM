import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/admin.css";

function Layout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="layout-content">

    <Navbar />

    <main className="main-content">

        {children}

    </main>

</div>
    </div>
  );
}

export default Layout;