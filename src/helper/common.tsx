import Cookies from "js-cookie";
export const setToken = (accessToken: string, refreshToken: string) => {
  Cookies.set("token", accessToken, { expires: 1 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 });
};
