import regex from "./regex";

type FieldOK = {
  ok: boolean;
  field?: string;
  message?: string;
};
export default {
  email: (email_address: string): Boolean => {
    // space not allowed
    if (email_address.includes(" ")) {
      return false;
    }
    // regex is allowed
    if (!regex.email.test(email_address)) {
      return false;
    }
    return true;
  },
  require_string: (string: string): FieldOK => {
    if (!string || string.trim() === "") {
      return {
        ok: false,
        field: string,
        message: "REQUIRE_FIELD_NOT_PROVIDED",
      };
    } else {
      return {
        ok: true,
      };
    }
  },
};
