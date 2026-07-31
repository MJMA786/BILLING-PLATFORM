import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import customerService from "../../services/customerService";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerForm from "../../components/customers/CustomerForm";
import DeleteCustomerModal from "../../components/customers/DeleteCustomerModal";
import StatCard from "../../components/dashboard/StatCard";
import CustomerStatCard from "../../components/customers/CustomerStatCard";
import "../../styles/customers.css";

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

      <div className="customers-header">
        <div className="row g-4 mb-4">
      </div>

        <div>

        <span className="dashboard-tag">

            Customer Management

        </span>

        <h1>

            Customers

        </h1>

        <p>

            Manage all registered customers from one place.

        </p>

    </div>
    <div className="row g-3 mb-4">

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Customers"

            value={customers.length}

            subtitle="Registered"

            icon="bi-people-fill"

            color="primary"

        />

    </div>

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Countries"

            value={
                new Set(
                    customers.map(
                        c => c.billing_country
                    )
                ).size
            }

            subtitle="Coverage"

            icon="bi-globe"

            color="success"

        />

    </div>

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Today"

            value={
                customers.filter(c =>

                    new Date(c.created_at)
                        .toDateString() ===
                    new Date().toDateString()

                ).length
            }

            subtitle="New Customers"

            icon="bi-person-plus-fill"

            color="warning"

        />

    </div>

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Emails"

            value={customers.length}

            subtitle="Verified"

            icon="bi-envelope-fill"

            color="danger"

        />

    </div>

</div>
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