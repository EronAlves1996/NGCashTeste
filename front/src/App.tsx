import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { UserExposed } from "../../types";
import styles from "./styles/App.module.css";

export const useUser: () => [
  UserExposed | null,
  React.Dispatch<React.SetStateAction<UserExposed | null>>
] = () => useOutletContext();

export function App() {
  const [user, setUser] = useState<UserExposed | null>(null);

  return (
    <div className={styles["container"]}>
      <div className={styles["sub-container"]}>
        <header>
          <h2>Ng Cash Teste</h2>
        </header>
        <main>
          <Outlet context={[user, setUser]} />
        </main>
      </div>
      <footer>
        <p>Aplicativo feito para fins de teste para a empresa NG Cash</p>
      </footer>
    </div>
  );
}
