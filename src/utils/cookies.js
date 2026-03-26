// src/utils/cookies.js
export const cookieStore = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  }),

  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookieStore.getOptions(), ...options });
  },

  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookieStore.getOptions(), ...options });
  },

  get: (req, name) => {
    return req.cookies[name];
  }
};