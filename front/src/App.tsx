import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { UserExposed } from "../../types";

export const useUser: () => [
  UserExposed | null,
  React.Dispatch<React.SetStateAction<UserExposed | null>>
] = () => useOutletContext();

export function App() {
  const [user, setUser] = useState<UserExposed | null>(null);

  return (
    <>
      <header></header>
      <main>
        <Outlet context={[user, setUser]} />
      </main>
      <footer></footer>
    </>
  );
}
