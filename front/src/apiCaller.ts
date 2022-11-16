export async function apiCaller(
  path: string,
  method: string,
  headers: HeadersInit = { "Content-Type": "application/json" },
  body?: Object
) {
  return await fetch(import.meta.env.VITE_API_URL + path, {
    credentials: "include",
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  });
}
