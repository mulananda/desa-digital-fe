// src/services/token.service.js
import Cookies from "js-cookie";
import { AUTH_CONFIG, COOKIE_OPTIONS } from "@/utils/constants";
import { isValidToken } from "@/utils/helpers";

class TokenService {
  get() {
    return Cookies.get(AUTH_CONFIG.TOKEN_KEY);
  }

  set(token) {
    if (!isValidToken(token)) {
      throw new Error("Invalid token format");
    }

    Cookies.set(AUTH_CONFIG.TOKEN_KEY, token, {
      ...COOKIE_OPTIONS,
      expires: AUTH_CONFIG.TOKEN_EXPIRY_DAYS,
    });
  }

  remove() {
    Cookies.remove(AUTH_CONFIG.TOKEN_KEY);
  }

  exists() {
    return !!this.get();
  }
}

export const tokenService = new TokenService();
