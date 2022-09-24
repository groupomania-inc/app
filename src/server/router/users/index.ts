import { createRouter } from "../context";
import newUser from "./new";

const usersRouter = createRouter().merge(newUser);

export default usersRouter;
