import { useEffect, useState } from "react";
import { AccountExposed, UserExposed } from "../../../types";
import { apiCaller } from "../utils/apiCaller";

export function Balance({ user }: { user: UserExposed }) {
  const [account, setAccount] = useState<AccountExposed | null>(null);

  useEffect(() => {
    (async () => {
      const response = await apiCaller("accountinfo", "GET", {
        "Content-Type": "application/json",
      });
      setAccount((await response.json()) as AccountExposed);
    })();
  }, [user]);

  return (
    account && (
      <div>
        <h4>Saldo da conta</h4>
        <p>{account?.balance}</p>
      </div>
    )
  );
}
