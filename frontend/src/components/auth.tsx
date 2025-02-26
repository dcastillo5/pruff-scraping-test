import { Dispatch, SetStateAction, useState } from "react";
import { User } from "../App";

const APP_API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const Auth = ({ setUser }: { setUser: Dispatch<SetStateAction<User | null>> }) => {
  const [authMode, setAuthMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    fetch(`${APP_API_ENDPOINT}/${authMode}`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 409 && authMode === "signup") {
          throw new Error("Usuario ya existe");
        } else if (res.status === 409 && authMode === "login") {
          throw new Error("Contraseña o email incorrecto");
        } else if (res.status === 401 && authMode === "login") {
          throw new Error("Contraseña o email incorrecto");
        } else {
          throw new Error("Ocurrio un error. Vuelve a intentarlo");
        }
      })
      .then((data) => {
        setUser(data.body);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message ?? "Ocurrio un error. Vuelve a intentarlo");
        console.error("Error:", error);
      });
  };

  return (
    <div
      className="hero min-h-screen text-primary"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1566079462783-784453c4cbe3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="hero-content w-full">
        <div className="card card-normal bg-base-100 w-full max-w-md text-center">
          <h1 className=" text-5xl font-bold mt-6">Hola!</h1>
          <p className="text-lg">
            {authMode === "login" ? "Inicia sesion" : "Crea una cuenta"} para explorar las propiedades.
          </p>
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <span className="label label-text">Email</span>
              <input
                name="email"
                type="email"
                placeholder="Ingresa tu email"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <span className="label label-text">Contrasena</span>
              <input
                name="password"
                type="password"
                placeholder="Ingresa tu constrasena"
                className="input input-bordered"
                required
              />
            </div>
            {error && <p className="label text-sm text-red-500">{error}</p>}

            <div className="label">
              <button type="button" className="label btn-link text-sm" onClick={toggleAuthMode}>
                {authMode === "login" ? "Nuevo usuario? Registrate aqui" : "Ya tienes una cuenta? Inicia sesion"}
              </button>
            </div>

            <div className="form-control mt-4">
              {isLoading ? (
                <button type="submit" className="btn">
                  <span className="loading loading-spinner"></span>
                </button>
              ) : (
                <button className="btn">{authMode === "login" ? "Iniciar sesion" : "Registrarse"}</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
