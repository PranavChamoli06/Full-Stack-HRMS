export default function Card({ children }) {
  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      padding: "25px",
      borderRadius: "10px",
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      {children}
    </div>
  );
}