import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="container-fluid">

      <h1 className="mb-4">
        My Profile
      </h1>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body">

          <div className="row mb-3">

            <div className="col-md-6">

              <label className="form-label">
                Name
              </label>

              <input
                className="form-control"
                value={user?.name || ""}
                readOnly
              />

            </div>

            <div className="col-md-6">

              <label className="form-label">
                Email
              </label>

              <input
                className="form-control"
                value={user?.email || ""}
                readOnly
              />

            </div>

          </div>

          <div className="mb-3">

            <label className="form-label">
              Role
            </label>

            <input
              className="form-control"
              value={user?.role || ""}
              readOnly
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;