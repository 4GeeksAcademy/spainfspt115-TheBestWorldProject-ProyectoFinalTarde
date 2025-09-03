// Import necessary components from react-router-dom and other parts of the application.
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.
import { useState } from "react";

export const Signup = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return;
    }

  }

  return (
    <div>
      <div className="container  mt-5">
        <div className="card row shadow d-flex justify-content-center" style={{ width: "25rem" }}>
          <div className="card-body">
            <div className="card-title justify-content-center d-flex fs-1 border-bottom border-dark">Registrate acá</div>
            <div className="card-body mt-5">
              <form onSubmit={handleSubmit}>
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
                <label htmlFor="contraseña" className="form-label mt-2">Password</label>
                <input type="password"
                  className="form-control"
                  id="contraseña"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
                <label htmlFor="confirmarContraseña" className="form-label mt-2">Confirm your password</label>
                <input type="password"
                  className="form-control"
                  id="confirmarContraseña"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
                <div className="d-flex gap-2">
                  <button className="btn btn-success mt-3" type="submit">Registrar</button>
                  <Link to="/">
                    <button className="btn btn-primary mt-3">Login</button></Link>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>

      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
