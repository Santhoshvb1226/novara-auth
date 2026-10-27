export const saveSession = (token, user, remember) => {
  clearSession();
  const store = remember ? localStorage : sessionStorage;
  store.setItem("token", token);
  store.setItem("user", JSON.stringify(user));
};

export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const getUser = () => {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  ["token", "user"].forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
};