import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCaller } from "./apiCaller";
import { Balance } from "./Balance";
import { Transferir } from "./Transferir";

export function Home(props: any) {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (props.user === null) {
        const response = await apiCaller("validate", "GET", {
          "Content-Type": "application/json",
        });
        if (response.status === 200) props.setUser(response.json());
        else
          navigate("/", {
            state: { message: "Acesso negado! Por favor realizar login" },
          });
      }
    })();
  }, [props.user]);

  return (
    <>
      <h2>Bem vindo à sua conta {props.user.username}</h2>
      <Balance user={props.user} />
      <Transferir user={props.user} />
      <Transacoes user={props.user} />
    </>
  );
}
