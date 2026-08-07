function NotificationPanel({ notifications = [] }) {

  return (

    <div className="dashboard-widget">

      <div className="widget-header">

        <div>

          <h5>Recent Activity</h5>

          <p>Latest platform events</p>

        </div>

      </div>

      <div className="activity-list">

        {notifications.length === 0 ? (

          <div className="empty-state">

            <i className="bi bi-check-circle"></i>

            <p>Everything looks good.</p>

          </div>

        ) : (

          notifications.map((item, index) => (

            <div
              key={index}
              className="activity-item"
            >

              <div className={`activity-dot bg-${item.type}`}></div>

              <div>

                <strong>

                  {item.title}

                </strong>

                <p>

                  {item.message}

                </p>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default NotificationPanel;