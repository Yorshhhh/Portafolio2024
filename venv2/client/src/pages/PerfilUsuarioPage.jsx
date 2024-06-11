import Navbar from "../components/Navbar";

function PerfilUsuarioPage() {
  const user = JSON.parse(localStorage.getItem("usuario"));
  console.log(user);
  return (
    <>
      <Navbar />
      <div className="center-container">
        <hr />
        <hr />
        <hr />
        <hr />
        {/* <h2>Nombres: {`${user.nombres} ${user.apellidos}`} </h2> */}
        <h2>Nombres: {user.nombres}</h2>
        <h2>Apellidos: {user.apellidos}</h2>
        <h2>Correo: {user.correo}</h2>
        <h2>Telefono: {user.telefono}</h2>
      </div>
    </>
  );
}

export default PerfilUsuarioPage;
