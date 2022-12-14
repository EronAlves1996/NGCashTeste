import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserExposed } from "../../../types";
import { useUser } from "../App";
import { apiCaller } from "../utils/apiCaller";
import { Balance } from "./Balance";
import { Transacoes } from "./Transacoes";
import { Transferir } from "./Transferir";
import styles from "../styles/Home.module.css";

export function Home() {
  const [user, setUser] = useUser();
  const [reload, triggerReload] = useState(false);
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

  return (
    user && (
      <div className={styles["container"]}>
        <div className={styles["header"]}>
          <h2>
            Bem vindo à sua conta{" "}
            <span id={styles["username"]}>{user.username}</span>
          </h2>
          <button
            type="button"
            onClick={() => {
              apiCaller("logout", "GET", {
                "Content-Type": "application/json",
              });
              navigate("/");
            }}
          >
            Sair
          </button>
        </div>
        <div className={styles["aligner"]}>
          <div className={styles["sub-container"]}>
            <Balance {...{ user, reload }} />
            <Transferir {...{ user, triggerReload, reload }} />
          </div>
          <Transacoes {...{ user, reload }} />
        </div>
      </div>
    )
  );
}
