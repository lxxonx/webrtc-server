import get__current_user from "./users/get__current_user";
import post__login from "./users/post__login";
import post__refresh_token from "./users/post__refresh_token";
import post__register from "./users/post__register";

export default {
  post: {
    register: post__register,
    login: post__login,
    refreshToken: post__refresh_token,
  },
  get: {
    currentUser: get__current_user,
  },
};
