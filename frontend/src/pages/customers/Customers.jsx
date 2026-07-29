import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import customerService from "../../services/customerService";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerForm from "../../components/customers/CustomerForm";
import DeleteCustomerModal from "../../components/customers/DeleteCustomerModal";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const data = await customerService.getAllCustomers();

      setCustomers(data);
      setError("");
    } catch (err) {
      console.error(err);
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

      fetchCustomers();

    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Failed to update customer.");
      }
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Open Delete Modal
  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  // Delete after confirmation
  const confirmDeleteCustomer = async () => {
    try {
      await customerService.deleteCustomer(
        customerToDelete.id
      );

      setShowDeleteModal(false);
      setCustomerToDelete(null);

      fetchCustomers();

    } catch (err) {
      console.error(err);
      alert("Failed to delete customer.");
    }
  };

  return (
    <Layout>
      <div className="container-fluid">

        <div className="mb-4">
          <h2 className="fw-bold">
            Customers
          </h2>

          <p className="text-muted">
            View and manage all registered customers.
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <div
              className="spinner-border"
              role="status"
            ></div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <CustomerTable
            customers={customers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}

        {/* Edit Customer */}
        <CustomerForm
          show={showModal}
          customer={selectedCustomer}
          onClose={() => {
            setShowModal(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />

        {/* Delete Customer */}
        <DeleteCustomerModal
          show={showDeleteModal}
          customer={customerToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setCustomerToDelete(null);
          }}
          onConfirm={confirmDeleteCustomer}
        />

      </div>
    </Layout>
  );
}

export default Customers;