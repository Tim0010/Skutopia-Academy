function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" style={{ color: "#007bff", textDecoration: "underline" }}>
        Go to Home
      </a>
    </div>
  );
}

export default NotFoundPage;
