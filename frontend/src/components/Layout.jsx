import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <main className="container-fluid py-4 px-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;