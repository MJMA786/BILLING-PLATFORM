import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import subscriptionService from "../../services/subscriptionService";
import SubscriptionTable from "../../components/subscriptions/SubscriptionTable";
import AddSubscriptionModal from "../../components/subscriptions/AddSubscriptionModal";
import DeleteSubscriptionModal from "../../components/subscriptions/DeleteSubscriptionModal";
import SubscriptionDetailsDrawer from "../../components/subscriptions/SubscriptionDetailsDrawer";
import SearchToolbar from "../../components/subscriptions/SearchToolbar";
import SubscriptionStats from "../../components/subscriptions/SubscriptionStats";
import customerService from "../../services/customerService";
import planService from "../../services/planService";
import PageHeader from "../../components/common/PageHeader";
import { useToast } from "../../context/ToastContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Subscriptions() {
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);

  // Admin New Subscription Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [creating, setCreating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [sData, cData, pData] = await Promise.all([
        subscriptionService.getAllSubscriptions().catch(() => []),
        customerService.getAllCustomers().catch(() => []),
        planService.getAllPlans().catch(() => []),
      ]);

      setSubscriptions(sData || []);
      setCustomers(cData || []);
      setPlans((pData || []).filter((p) => p.is_active || p.active));
      setError("");
    } catch (err) {
      setError("Failed to load subscription registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      setActionLoadingId(subscriptionId);
      await subscriptionService.cancel(subscriptionId);
      showToast("Subscription cancelled successfully.", "warning");
      fetchAllData();
      if (selectedSubscription?.id === subscriptionId) {
        setSelectedSubscription(null);
      }
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to cancel subscription.", "danger");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResumeSubscription = async (subscriptionId) => {
    try {
      setActionLoadingId(subscriptionId);
      await subscriptionService.resume(subscriptionId);
      showToast("Subscription resumed successfully!", "success");
      fetchAllData();
      if (selectedSubscription?.id === subscriptionId) {
        setSelectedSubscription(null);
      }
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to resume subscription.", "danger");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteSubscription = async (subscription) => {
    try {
      setActionLoadingId(subscription.id);
      await subscriptionService.delete(subscription.id);
      showToast("Subscription deleted successfully.", "success");
      setShowDeleteModal(false);
      setSubscriptionToDelete(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to delete subscription.", "danger");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdminCreateSubscription = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      showToast("Please select a customer.", "warning");
      return;
    }
    if (!selectedPlanId) {
      showToast("Please select a plan.", "warning");
      return;
    }

    try {
      setCreating(true);
      await subscriptionService.create({
        plan_id: Number(selectedPlanId),
        customer_id: Number(selectedCustomerId),
      });
      showToast("Subscription assigned successfully with automated invoice & payment cycle!", "success");
      setShowCreateModal(false);
      setSelectedCustomerId("");
      setSelectedPlanId("");
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to create subscription.", "danger");
    } finally {
      setCreating(false);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const search = searchTerm.toLowerCase();
      const companyName = subscription.customer?.company_name || "";
      const contactPerson = subscription.customer?.contact_person || "";
      const billingEmail = subscription.customer?.billing_email || "";
      const planName = subscription.plan?.name || "";

      const matchesSearch =
        companyName.toLowerCase().includes(search) ||
        contactPerson.toLowerCase().includes(search) ||
        billingEmail.toLowerCase().includes(search) ||
        planName.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || statusFilter === "all" || subscription.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage) || 1;
  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubscriptions.slice(start, start + itemsPerPage);
  }, [filteredSubscriptions, currentPage, itemsPerPage]);

  return (
    <Layout>
      <div className="container-fluid py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <PageHeader
            tag="Subscription Control"
            title="Customer Subscriptions"
            description="Manage customer plans, billing cycles, renewals, and lifecycle status."
          />
        </div>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {/* Statistics Cards */}
        <SubscriptionStats subscriptions={subscriptions} />

        {/* Search & Filter */}
        <SearchToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreate={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading subscriptions...</span>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="table-responsive p-3">
              <SubscriptionTable
                subscriptions={paginatedSubscriptions}
                onView={(subscription) => {
                  setSelectedSubscription(subscription);
                  setShowDetails(true);
                }}
                onDelete={(subscription) => {
                  setSubscriptionToDelete(subscription);
                  setShowDeleteModal(true);
                }}
                onCancel={handleCancelSubscription}
                onResume={handleResumeSubscription}
              />
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Page {currentPage} of {totalPages} ({filteredSubscriptions.length} total)
                </small>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-2 px-2.5"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-2 px-2.5"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subscription Details Drawer */}
        {selectedSubscription && (
          <SubscriptionDetailsDrawer
            show={showDetails}
            subscription={selectedSubscription}
            onClose={() => {
              setShowDetails(false);
              setSelectedSubscription(null);
            }}
            onCancel={handleCancelSubscription}
            onResume={handleResumeSubscription}
            onDelete={(sub) => {
              setShowDetails(false);
              setSelectedSubscription(null);
              setSubscriptionToDelete(sub);
              setShowDeleteModal(true);
            }}
          />
        )}

        {/* Delete Subscription Modal */}
        <DeleteSubscriptionModal
          show={showDeleteModal}
          subscription={subscriptionToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSubscriptionToDelete(null);
          }}
          onConfirm={handleDeleteSubscription}
        />

        {/* Add Subscription Modal */}
        <AddSubscriptionModal
          show={showCreateModal}
          customers={customers}
          plans={plans}
          creating={creating}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          selectedPlanId={selectedPlanId}
          setSelectedPlanId={setSelectedPlanId}
          onClose={() => setShowCreateModal(false)}
          onSave={handleAdminCreateSubscription}
        />

      </div>
    </Layout>
  );
}

export default Subscriptions;