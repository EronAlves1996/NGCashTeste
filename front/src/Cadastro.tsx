import { useState } from "react";
import { apiCaller } from "./apiCaller";

export function Cadastro() {
  const [verifyPassword, setVerifyPassword] = useState({
    password: "",
    repeatedPassword: "",
  });
  const [username, setUsername] = useState("");

  return (
    <>
      <h2>Cadastrar</h2>
      <form>
        <label htmlFor="username">Escolha um username</label>
        <input
          type="text"
          id="username"
          name="username"
          value="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        {username.length < 3 && (
          <span>Username deve ter ao menos 3 caracteres!</span>
        )}

        <label htmlFor="password">Escolha uma senha</label>
        <input
          type="password"
          id="password"
          name="password"
          value={verifyPassword.password}
          onChange={(e) => {
            setVerifyPassword({ ...verifyPassword, password: e.target.value });
          }}
        />
        {verifyPassword.password.length < 8 &&
          verifyPassword.password.match(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[^ ]+$/
          ) && (
            <span>
              Sua senha deve ter ao menos 8 dígitos e conter ao menos uma letra
              maiúscula e um número
            </span>
          )}
        <label htmlFor="repeatPassword">Repita sua senha</label>
        <input
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          value={verifyPassword.repeatedPassword}
          onChange={(e) => {
            setVerifyPassword({
              ...verifyPassword,
              repeatedPassword: e.target.value,
            });
          }}
        />
        {verifyPassword.password !== verifyPassword.repeatedPassword && (
          <span>Senhas não conferem!</span>
        )}
        <button
          onClick={() => {
            apiCaller(
              "cadastro",
              "POST",
              { "Content-Type": "application/json" },
              {
                username: username,
                password: verifyPassword.password,
              }
            );
          }}
        >
          Cadastrar
        </button>
      </form>
    </>
  );
}
