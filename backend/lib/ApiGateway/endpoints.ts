export const API_ENDPOINTS = {
  auth: {
    value: "auth",
    signup: "signup",
    signin: "signin",
    confirm: "confirm",
    resend: "resend"
  },
  public: {
    value: "public"
  },
  user: {
    value: "user",
    chat: {
      value: "chat",
      sendMessage: "sendMessage",
      getMessages: "getMessages",
    },
  },
  admin: {
    value: "admin"
  }
} as const;