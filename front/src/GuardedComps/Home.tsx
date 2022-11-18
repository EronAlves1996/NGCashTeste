import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserExposed } from "../../../types";
import { useUser } from "../App";
import { apiCaller } from "../utils/apiCaller";
import { Balance } from "./Balance";
import { Transacoes } from "./Transacoes";
import { Transferir } from "./Transferir";

export function Home() {
  const [user, setUser] = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (user === null) {
        const response = await apiCaller("validate", "GET", {
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
      <>
        <h2>Bem vindo à sua conta {user.username}</h2>
        <Balance user={user} />
        <Transferir user={user} />
        <Transacoes user={user} />
      </>
    )
  );
}
