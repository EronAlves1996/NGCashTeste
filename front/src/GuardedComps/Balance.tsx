import { useEffect, useState } from "react";
import { AccountExposed, UserExposed } from "../../../types";
import { apiCaller } from "../utils/apiCaller";
import styles from "../styles/Balance.module.css";

export function Balance({
  user,
  reload,
}: {
  user: UserExposed;
  reload: boolean;
}) {
  const [account, setAccount] = useState<AccountExposed | null>(null);

  useEffect(() => {
    (async () => {
      const response = await apiCaller("informacaoConta", "GET", {
        "Content-Type": "application/json",
      });
      setAccount((await response.json()) as AccountExposed);
    })();
  }, [user, reload]);

  return (
    account && (
      <div className={styles["container"]}>
        <h3 style={{ marginBottom: "1vh" }}>Saldo da conta</h3>
        <p style={{ fontSize: "3vh" }}>R$ {account?.balance}</p>
      </div>
    )
  );
}
