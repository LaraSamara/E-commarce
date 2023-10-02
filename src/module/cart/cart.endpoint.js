import { roles } from "../../middleware/auth.middleware.js";
export const endpoints = {
    create:[roles.User],
    get:[roles.User],
    update:[roles.User]
}