import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCaller } from "./apiCaller";

export function Index({ user, setUser }: any) {
  const navigate = useNavigate();

  if (user !== null) {
    navigate("/home");
  }

  const handleSubmit = async (e: FormEvent) => {
    const data = Object.fromEntries(
      new FormData(e.currentTarget as HTMLFormElement)
    );
    const auth = btoa(
      data.username.toString().concat(`:${data.password.toString()}`)
    );
    const response = await apiCaller("login", "GET", {
      "Content-Type": "application/json",
      Authentication: `Basic ${auth}`,
    });

    if (response.status === 200) {
      setUser(await response.json());
      navigate("/home");
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <label htmlFor="">Username:</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="">Senha:</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Fazer login</button>
      </form>
      <div>
        <p>
          Ainda não é usuário? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </>
  );
}
