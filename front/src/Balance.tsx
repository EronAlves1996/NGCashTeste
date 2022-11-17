import { useEffect, useState } from "react";
import { apiCaller } from "./apiCaller";

export function Balance(props: any) {
  const [account, setAccount] = useState<{ balance: string } | null>(null);
  useEffect(() => {
    (async () => {
      const response = await apiCaller("accountinfo", "GET", {
        "Content-Type": "application/json",
      });
      setAccount(await response.json());
    })();
  }, [account, props.user]);

  return (
    <div>
      <h4>Saldo da conta</h4>
      <p>{account?.balance}</p>
    </div>
  );
}
