import { useEffect, useState } from "react";
import { TransactionExposed } from "../../../types";
import { apiCaller } from "../utils/apiCaller";
import styles from "../styles/Transacoes.module.css";

export function Transacoes(props: any) {
  const [transacoes, setTransacoes] = useState<TransactionExposed[]>([]);
  const [transactionType, setTransactionType] = useState("");
  const [transactionDate, setTransactionDate] = useState<string>("");

  useEffect(() => {
    (async () => {
      const type = transactionType ? `type=${transactionType}` : null;
      const date = transactionDate ? `date=${transactionDate}` : null;
      let request = "transacoes";
      if (date || type) {
        request += "?";
        if (date && type) {
          request += type + "&" + date;
        } else if (date) {
          request += date;
        } else {
          request += type;
        }
      }
      const response = await apiCaller(request, "GET", {
        "Content-Type": "applcation/json",
      });
      const json = await response.json();
      setTransacoes(json);
    })();
  }, [props.user, transactionDate, transactionType, props.reload]);

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
    <div className={styles["container"]}>
      <h2>Minhas transações</h2>
      <div className={styles["filters"]}>
        <div>
          <label htmlFor="date">Data da transação</label>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => {
              setTransactionDate(e.target.value);
            }}
          />
        </div>
        <div style={{ marginInlineStart: "2vw" }}>
          <label htmlFor="type">Tipo de transação</label>
          <select
            name="type"
            id="type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="in">Créditos</option>
            <option value="out">Débitos</option>
          </select>
        </div>
      </div>
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
                  {transacao.from === props.user.username &&
                    `R$ ${transacao.value}`}
                </td>
                <td>
                  {transacao.to === props.user.username &&
                    `R$ ${transacao.value}`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Totais: </td>
              <td>R$ {totais.debited.toFixed(2)}</td>
              <td>R$ {totais.credited.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
