import DataHelper from "../helper/data";
import Definition from "../definition";


export default {
    getters: {
        [Definition.TREE_GETTER_TREE](state) {
            return DataHelper.getChildren(
                state.list,
                null,
                state.settings.idKey,
                state.settings.parentKey
            )
        }
    }
}