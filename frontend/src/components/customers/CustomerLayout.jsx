import CustomerNavbar from "./CustomerNavbar";
import CustomerSidebar from "./CustomerSidebar";

function CustomerLayout({ children }) {
  return (
    <div className="d-flex">

      <CustomerSidebar />

      <div
        className="flex-grow-1"
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <CustomerNavbar />

        <main className="p-4">
          {children}
        </main>

      </div>

    </div>
  );
}

export default CustomerLayout;