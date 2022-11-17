import { useState } from "react";
import { Outlet } from "react-router-dom";

export function App() {
  const [user, setUser] = useState(null);

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
