import { FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiCaller } from "./apiCaller";

export function Index() {
  const handleSubmit = (e: FormEvent) => {
    const data = Object.fromEntries(
      new FormData(e.currentTarget as HTMLFormElement)
    );
    const auth = btoa(
      data.username.toString().concat(`:${data.password.toString()}`)
    );
    apiCaller("login", "GET", {
      "Content-Type": "application/json",
      Authentication: `Basic ${auth}`,
    });
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
