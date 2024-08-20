function Loader() {
  return (
    <div
      className="d-flex justify-content-center align-items-center mt-2"
      style={{ width: "100%", height: "100vh", fontSize: "10rem" }}
      role="status"
    >
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
