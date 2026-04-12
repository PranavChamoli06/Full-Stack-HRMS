export default function PublicLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f1f5f9"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        padding: "25px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        {children}
      </div>
    </div>
  );
}