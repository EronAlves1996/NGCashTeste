import { useState } from "react";
import { TransactionDataExposed, UserExposed } from "../../../types";
import { apiCaller } from "../utils/apiCaller";

export function Transferir({ user }: { user: UserExposed }) {
  const [username, setUsername] = useState("");
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <div>
      <h4>Transferir</h4>
      <form>
        <label htmlFor="to">Transferir para: </label>
        <input
          type="text"
          name="to"
          id="to"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="value">Valor: </label>
        <input
          type="number"
          name="value"
          id="value"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
        />
        <button
          type="button"
          onClick={async () => {
            const response = await apiCaller(
              "transferir",
              "POST",
              {
                "Content-Type": "application/json",
              },
              {
                transferTo: username,
                value: value,
                transferFrom: user.username,
              } as TransactionDataExposed
            );
            setMessage((await response.json()).message);
            setUsername("");
            setValue(0);
          }}
        >
          Transferir!
        </button>
        {message !== "" && <span>{message}</span>}
      </form>
    </div>
  );
}
