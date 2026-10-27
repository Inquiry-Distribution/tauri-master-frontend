const EMAIL_KEY = "remember_email";
const PASSWORD_KEY = "remember_password";

export const getRememberedLogin = () => ({
  email: localStorage.getItem(EMAIL_KEY) || "",
  password: localStorage.getItem(PASSWORD_KEY) || "",
});

export const setRememberedLogin = (email: string, password: string) => {
  localStorage.setItem(EMAIL_KEY, email);
  localStorage.setItem(PASSWORD_KEY, password);
};

export const clearRememberedLogin = () => {
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(PASSWORD_KEY);
};

/** Clears the session and keeps a remembered email and password. */
export const clearAuthStorage = () => {
  const remembered = getRememberedLogin();
  localStorage.clear();
  if (remembered.email) {
    setRememberedLogin(remembered.email, remembered.password);
  }
};
