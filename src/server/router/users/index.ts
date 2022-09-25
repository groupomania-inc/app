import { createRouter } from "../context";
import getMe from "./me";
import newUser from "./new";

const usersRouter = createRouter().merge(newUser).merge(getMe);

export default usersRouter;
