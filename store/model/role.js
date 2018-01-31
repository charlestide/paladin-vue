import Model from "../base/model";

export default class Role extends Model {

    get prototype() {
        return {
            id: Number,
            name: String,
            display_name: String,
            created_at: String,
            updated_at: String,
            permissions: Array,
            permissionNames: {
                get: function () {
                    return _.map(this.permissions, 'name');
                }
            }
        }
    }

    get name() {
        return 'role';
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
                {required: true, message: '请输入角色名称', trigger: 'blur'},
                {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
            ]
        }
    }
}