import morgan from "morgan";
import { morganStream } from "../utils/serverTool/logger";

export default morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream: morganStream }
);
