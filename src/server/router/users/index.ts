import { createRouter } from "../context";
import getMe from "./me";
import newUser from "./new";
import updateMe from "./update";

const usersRouter = createRouter().merge(newUser).merge(getMe).merge(updateMe);

export default usersRouter;
