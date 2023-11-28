import Api from "./Api";
import authHeader from "../services/auth-header";

const END_POINT = "me";

export default {
  me() {
    return Api.get(END_POINT, { headers: authHeader() });
  },
};
