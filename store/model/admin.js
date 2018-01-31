import Model from "../base/model";

export default class Admin extends Model {

    get prototype() {
        return {
            id: Number,
            name: String,
            email: String,
            password: String,
            description: String,
            status: Boolean,
            permissions: Array,
            permissionNames: {
                get: function () {
                    return _.map(this.permissions, 'name');
                },
            },
            roles: Array,
            roleNames: {
                get: function () {
                    return _.map(this.roles, 'name');
                }
            }
        }
    }

    get name() {
        return 'admin';
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
                {required: true, message: '请输入管理员用户名', trigger: 'blur'},
                {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
            ],
                email: [
                {required: true, message: '请输入邮箱', trigger: 'blur'},
                {type: 'email', message: '邮箱的格式有误', trigger: 'blur'},
            ]
        }
    }
}