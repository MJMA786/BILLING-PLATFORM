import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import customerService from "../../services/customerService";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerForm from "../../components/customers/CustomerForm";
import DeleteCustomerModal from "../../components/customers/DeleteCustomerModal";
import CustomerProfileDrawer from "../../components/subscriptions/CustomerProfileDrawer";
import CustomerStatCard from "../../components/customers/CustomerStatCard";
import { useToast } from "../../context/ToastContext";
import "../../styles/customers.css";

function Customers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data || []);
      setError("");
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSaveCustomer = async (customerData) => {
    try {
      await customerService.updateCustomer(
        selectedCustomer.id,
        customerData
      );

      setShowModal(false);
      setSelectedCustomer(null);
      showToast("Customer updated successfully!", "success");
      fetchCustomers();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to update customer.", "danger");
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDeleteCustomer = async () => {
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      showToast("Customer deleted successfully!", "success");
      fetchCustomers();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to delete customer.", "danger");
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-2">
        <div className="customers-header mb-4">
          <div>
            <span className="dashboard-tag">Customer Management</span>
            <h1 className="fw-bold mb-1">Customers</h1>
            <p className="text-secondary mb-0">
              Manage registered customers, filter directory, and review full profile details.
            </p>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Total Customers"
              value={customers.length}
              subtitle="Registered users"
              icon="bi-people-fill"
              color="primary"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Coverage"
              value={new Set(customers.map((c) => c.country)).size}
              subtitle="Countries"
              icon="bi-globe"
              color="success"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="New Today"
              value={
                customers.filter(
                  (c) =>
                    new Date(c.created_at).toDateString() ===
                    new Date().toDateString()
                ).length
              }
              subtitle="Joined today"
              icon="bi-person-plus-fill"
              color="warning"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Verified Emails"
              value={customers.length}
              subtitle="System verified"
              icon="bi-envelope-fill"
              color="danger"
            />
          </div>
        </div>

        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading customers...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {!loading && !error && (
          <CustomerTable
            customers={customers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onView={(customer) => setViewCustomer(customer)}
          />
        )}

        {/* Edit Form Modal */}
        <CustomerForm
          show={showModal}
          customer={selectedCustomer}
          onClose={() => {
            setShowModal(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />

        {/* Delete Confirmation Modal */}
        <DeleteCustomerModal
          show={showDeleteModal}
          customer={customerToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setCustomerToDelete(null);
          }}
          onConfirm={confirmDeleteCustomer}
        />

        {/* Profile Details Drawer */}
        <CustomerProfileDrawer
          show={viewCustomer !== null}
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
        />
      </div>
    </Layout>
  );
}

export default Customers;