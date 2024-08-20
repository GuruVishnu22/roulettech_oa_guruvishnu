import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@123";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      navigate("/items/");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-success">
      <div className="card border-success">
        <div className="card-body">
          <h2 className="card-title text-center fw-light">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email Here..."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password Here..."
                required
                minLength={8}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
