import { useEffect, useState } from "react";
import { apiCaller } from "./apiCaller";

export function Transacoes(props: any) {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await apiCaller("transacoes", "GET", {
        "Content-Type": "applcation/json",
      });
      setTransacoes(await response.json());
    })();
  });

  return (
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
  );
}
