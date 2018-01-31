import Model from "../base/model";
import tree from "../mix/tree";

export default class Menu extends Model {

    constructor() {
        super(true);

        this.addSetting('parentKey','parent_id');
    }

    get prototype() {
        return {
            id: Number,
            name: String,
            icon: String,
            url: String,
            parent_id: Number,
            permission_id: Number,
            created_at: String,
            updated_at: String,
        }
    }

    get name() {
        return 'menu';
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
                {required: true, message: '请输入菜单名称', trigger: 'blur'},
                {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
            ],
            url: [
                {required: true, message: 'URL是必须的', trigger: 'blur'},
            ],
            permission_id: [
                {required: true, message: '请选择一个权限，没有此权限的用户将无法看到这个菜单', trigger: 'blur'},
            ]
        }
    }

    get mixes() {
        return [tree];
    }

    get relations() {
        return {
            permission: 'permission',
            related: 'permission',
            parent: 'menu',
            children: 'menu'
        }
    }
}