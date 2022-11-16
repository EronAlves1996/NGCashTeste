import { useState } from "react";
import { Outlet } from "react-router-dom";

export function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}
