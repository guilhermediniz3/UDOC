import "./index.css";

function Header() {
  return (
    <header className="header">
      <h1>UDoc</h1>

      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Documentos</a>
        <a href="#">Templates</a>
      </nav>
    </header>
  );
}

export default Header;