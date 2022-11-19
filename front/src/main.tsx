import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./styles/index.css";
import { Index } from "./Index";
import { App } from "./App";
import { Cadastro } from "./Cadastro";
import { Home } from "./GuardedComps/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Index />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
