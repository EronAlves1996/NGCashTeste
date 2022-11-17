import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCaller } from "./apiCaller";

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
      <div>
        <h4>Transferir</h4>
        <form>
          <label htmlFor="to">Transferir para: </label>
          <input type="text" name="to" id="to" />
          <label htmlFor="value">Valor: </label>
          <input type="number" name="value" id="value" />
          <button type="button">Transferir!</button>
        </form>
      </div>
      <div>
        <h4>Minhas transações</h4>
        <label htmlFor="date">Data da transação</label>
        <input type="date" />
        <label htmlFor="">
          <input type="checkbox" /> Créditos
        </label>
        <label htmlFor="">
          <input type="checkbox" /> Débitos
        </label>
      </div>
    </>
  );
}
