
import Model from "../base/model";

export default class Permission extends Model {

    get prototype() {
        return {
            id: Number,
            name: String,
            description: String,
            created_at: String,
            updated_at: String,
        }
    }

    get name() {
        return 'permission';
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
                {required: true, message: '请输入权限名称', trigger: 'blur'},
                {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
            ]
        }
    }
};