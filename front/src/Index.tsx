import { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserExposed } from "../../types";
import { useUser } from "./App";
import { apiCaller } from "./utils/apiCaller";
import styles from "./styles/Index.module.css";

export function Index() {
  const [user, setUser] = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (user === null) {
        const response = await apiCaller("validar", "GET", {
          "Content-Type": "application/json",
        });
        if (response.status === 200)
          setUser((await response.json()) as UserExposed);
        else
          navigate("/", {
            state: { message: "Acesso negado! Por favor realizar login" },
          });
      }
    })();
  }, [user]);

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
      <div className={styles["container"]}>
        <div className={styles["sub-container"]}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" name="username" id={styles["username"]} />
            </div>
            <div>
              <label htmlFor="password">Senha:</label>
              <input type="password" name="password" id={styles["password"]} />
            </div>
            <button type="submit">Fazer login</button>
          </form>
          <div className={styles["register"]}>
            <p>
              Ainda não é usuário? <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
