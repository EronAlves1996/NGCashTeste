import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { apiCaller } from "./utils/apiCaller";
import { Balance } from "./Balance";
import { Transacoes } from "./Transacoes";
import { Transferir } from "./Transferir";

export function Home() {
  const [user, setUser]: any[] = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (user === null) {
        const response = await apiCaller("validate", "GET", {
          "Content-Type": "application/json",
        });
        if (response.status === 200) setUser(response.json());
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
