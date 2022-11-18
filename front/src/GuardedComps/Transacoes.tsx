import { useEffect, useState } from "react";
import { TransactionExposed } from "../../../types";
import { apiCaller } from "../utils/apiCaller";
import "./Transacoes.css";

export function Transacoes(props: any) {
  const [transacoes, setTransacoes] = useState<TransactionExposed[]>([]);

  useEffect(() => {
    (async () => {
      const response = await apiCaller("transacoes", "GET", {
        "Content-Type": "applcation/json",
      });
      const json = await response.json();
      setTransacoes(json);
    })();
  }, [props.user]);

  const digestDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const totais = transacoes.reduce(
    (obj, transacao) => {
      if (transacao.to === props.user.username) {
        obj.credited += transacao.value;
      }
      if (transacao.from === props.user.username) {
        obj.debited += transacao.value;
      }
      return obj;
    },
    { credited: 0, debited: 0 }
  );

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
      {transacoes && (
        <table>
          <thead>
            <tr>
              <th>Data da transação</th>
              <th>Usuário</th>
              <th>Debitado</th>
              <th>Creditado</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr>
                <td>{digestDate(transacao.createdAt)}</td>
                <td>
                  {transacao.to === props.user.username
                    ? transacao.from
                    : transacao.to}
                </td>
                <td>
                  {transacao.from === props.user.username && transacao.value}
                </td>
                <td>
                  {transacao.to === props.user.username && transacao.value}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Totais: </td>
              <td>{totais.debited}</td>
              <td>{totais.credited}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
