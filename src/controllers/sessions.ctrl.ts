import get__sessions from "./sessions/get__sessions";
import post__create from "./sessions/post__create";

export default {
  post: {
    create: post__create,
  },
  get: {
    _: get__sessions,
  },
};
