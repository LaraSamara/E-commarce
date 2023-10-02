import { roles } from "../../middleware/auth.middleware.js";

export const endpoints ={
    create:[roles.User],
    cancel:[roles.User],
    changeStatus:[roles.Admin]
}