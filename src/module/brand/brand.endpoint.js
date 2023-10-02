import { roles } from "../../middleware/auth.middleware.js";

export const endpoints ={
    create:[roles.Admin],
    update:[roles.Admin],
    get:[roles.Admin,roles.User]
}