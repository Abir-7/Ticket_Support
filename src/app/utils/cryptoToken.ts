/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import crypto from "crypto";

const cryptoToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default cryptoToken;
