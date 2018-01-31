import auth from "./modules/auth";
import loader from "./modules/loader";
import layout from "./modules/layout";
import Menu from "./model/menu";
import form from "./modules/form";
import Role from "./model/role";
import Admin from "./model/admin";
import Permission from "./model/permission";
import PermissionCategory from "./model/permission-category"
import common from "./modules/common";


export default {
    modules: {
        auth,
        loader,
        layout,
        admin: new Admin(true),
        menu: new Menu(true),
        permission: new Permission(true),
        role: new Role(true),
        form,
        common,
        'permission-category': new PermissionCategory(true)
    }
};