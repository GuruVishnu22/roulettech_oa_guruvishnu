import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card w-50 h-50 text-center bg-dark">
        <div className="card-body text-light">
          <h1 className="card-title">404 Not Found</h1>
          <p className="card-text">
            The page you are looking for does not exist.
          </p>
          <Link to="/items" className="btn btn-success">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
