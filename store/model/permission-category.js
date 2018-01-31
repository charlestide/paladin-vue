
import Model from "../base/model";

export default class PermissionCategory extends Model {

    get prototype() {
        return {
            id: Number,
            name: String,
            created_at: String,
            updated_at: String,
        }
    }

    get name() {
        return 'permission-category';
    }

    get namespace() {
        return true;
    }

    get restful() {
        return true;
    }

    get rules() {
        return {
            name: [
                {required: true, message: '请输入权限组名称', trigger: 'blur'},
                {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
            ]
        }
    }

    get relations() {
        return {
            permissions: 'permission'
        }
    }
};