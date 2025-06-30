export const BASE_ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL || "https://erp.mawuena.com/api";

export const API_ENDPOINT = {
  SIGNUP: BASE_ENDPOINT + "/employee/signup",
  LOGIN: BASE_ENDPOINT + "/employee/login",
  LOGOUT: BASE_ENDPOINT + "/employee/logout",
  FORGOT_PASSWORD: BASE_ENDPOINT + "/employee/forgot-password",
  RESET_PASSWORD: BASE_ENDPOINT + "/employee/reset-password",
  VERIFY_EMAIL: BASE_ENDPOINT + "/employee/verify",
  RESEND_VERIFICATION_EMAIL:
    BASE_ENDPOINT + "/employee/resend-verification-email",
  // DASHBOARD
  EMPLOYEE: "/employee",

  // ADMIN
  ADMIN: "admin"

};
