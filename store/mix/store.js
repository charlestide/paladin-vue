
import RemoteHelper from "../helper/remote";
import Database from "../database/database";
import Definition from "../definition";
import TableQuery from "../../modules/table-query";

export default {
    state: {
        empty: {},
        current: {},
        list: [],
        pageLength: 20,
        page: 1,
        total: 0,
        rules: {}
    },
    getters: {
        [Definition.STORE_GETTER_EMPTY] : (state) => _.clone(state.empty),
        [Definition.STORE_GETTER_CURRENT](state) {
            if (_.isEmpty(state.current)) {
                return state.generator.create();
            } else {
                return state.current;
            }
        },
        [Definition.STORE_GETTER_LIST]: (state) => state.list,
        [Definition.STORE_GETTER_TOTAL]: (state) => state.total,
        [Definition.STORE_GETTER_PAGE_LENGTH]: (state) => state.pageLength,
        [Definition.STORE_GETTER_PAGE]: (state) => state.page,
        [Definition.STORE_GETTER_RULES]: (state) => state.settings.rules,
        [Definition.STORE_GETTER_QUERY]: (state) => {
            if (!state.query) {
                state.query = new TableQuery(state.pageLength)
            }
            return state.query;
        },
    },

    mutations: {
        /**
         * 设置current
         *
         * @param state
         * @param item
         */
        setCurrent(state,item) {
            if (item) {
                state.current = item;
            }
        },

        /**
         * 获取list
         *
         * @param state
         * @param items
         * @param total
         */
        setList(state,{items,total}) {
            state.list = items;
            state.total = total;
        },

        /**
         * 将一组items加入list
         *
         * @param state
         * @param items
         */
        addToList(state,items) {
            if (!_.isEmpty(items)) {
                if (!_.isArray(items)) {
                    items = [items];
                }
                let idKey = state.settings.idKey,
                    list = _.clone(state.list),
                    finder = {},
                    index = 0;

                for (let item of items) {
                    finder[idKey] = item[idKey];
                    if ((index = _.findIndex(list,finder)) > -1) {
                        list[index] = item;
                    } else {
                        list.push(item);
                    }
                }

                state.list = _.filter(list,(item) => !!item);
            }
        },

        /**
         * 设定当前页码
         *
         * @param state
         * @param currentPage
         */
        [Definition.STORE_MUTATION_SET_PAGE](state,currentPage) {
            state.page = currentPage;
        },

        /**
         * 重置列表查询参数
         * @param state
         */
        [Definition.STORE_MUTATION_RESET_QUERY](state) {
            state.query = new TableQuery(state.pageLength);
        }
    },
    actions: {

        /**
         * 加入数据库
         *
         * @param state
         * @param commit
         * @param items
         */
        put({state,commit},items) {
            Database.put(state.settings.name,items);
        },

        /**
         * 从数据库中删除
         *
         * @param state
         * @param commit
         * @param dispatch
         * @param id
         */
        delete({state,commit,dispatch},id) {
            Database.delete(state.settings.name,id);
            commit('setCurrent',{});
            let list = _.clone(state.list);
            _.remove(list,{id:id});
            state.list = list;
        },

        [Definition.STORE_ACTION_GET]({state,commit,dispatch},id) {
            return new Promise(resolve => {
                id = state.settings.idKeyType(id);

                Database.get(state.settings.name,id).then((item) => {
                    if (item) {
                        commit('setCurrent', item);
                        if (!_.isEmpty(state.settings.relations)) {

                            _.each(state.settings.relations,(module,key) => {
                                commit(module + '/addToList', item[key],{root:true});
                            })
                        }
                        resolve(item);

                    } else {
                        dispatch(Definition.STORE_ACTION_LOAD,id)
                            .then(item => {
                                resolve(item);
                            })
                    }
                });
            });

        },

        /**
         * 从远程获取一个数据
         *
         * @param commit
         * @param state
         * @param getters
         * @param dispatch
         * @param id
         */
        [Definition.STORE_ACTION_LOAD]({commit,state,getters,dispatch},id) {
            return new Promise((resolve,reject) => {
                commit(Definition.COMMON_MUTATION_START_LOAD,null,{root:true});

                //判断请求的item是否已经下载
                this._vm.$axios.get(state.settings.get.url.replace(':id',id))
                    .then(response => {

                        // let item = state.settings.getter(response.data.data);
                        let item = state.generator.create(response.data.data);

                        commit('setCurrent',_.clone(item));
                        dispatch('put',item);

                        if (!_.isEmpty(state.settings.relations)) {
                            _.each(state.settings.relations,(module,key) => {
                                dispatch( module + '/put', item[key], {root: true});
                                commit(module + '/addToList', item[key],{root:true});
                            })
                        }

                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        resolve(item);
                    })
                    .catch((error) => {
                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        reject(error);
                    });
            })
        },

        /**
         * 向远程保存一个item
         *
         * @param commit
         * @param state
         * @param dispatch
         * @param item
         */
        [Definition.STORE_ACTION_UPDATE]({commit,state,dispatch},item) {

            //如果数据有关联数据，则上传时先删除，以便防止转JSON时的出错
            if (!_.isEmpty(state.settings.relations)) {
                _.each(state.settings.relations,(module,key) => {
                    delete item[key];
                })
            }

            return new Promise((resolve,reject) => {
                this._vm.$axios.put(
                    state.settings.update.url.replace(':id',item[state.settings.idKey]),
                    item
                )
                    .then(response => {

                        let item = state.generator.create(response.data.data);

                        dispatch('put',item);
                        commit('setCurrent',_.clone(item));

                        commit(Definition.COMMON_MUTATION_RESET_REMOTE_FORM_ERROR,null,{root:true});
                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});

                        RemoteHelper.showRemoteMessage(this._vm,response);
                        resolve(item);
                    })
                    .catch((error) => {
                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});

                        commit(Definition.COMMON_MUTATION_SET_REMOTE_FORM_ERROR ,error,{root:true});
                        RemoteHelper.showRemoteError(this._vm,error,state.settings.update.error);

                        reject(error);
                        console.log(error.response);
                    });
            })

        },

        /**
         * 向远程创建一个item
         *
         * @param commit
         * @param state
         * @param dispatch
         * @param item
         */
        [Definition.STORE_ACTION_CREATE]({commit,state,dispatch},item) {

            //如果数据有关联数据，则上传时先删除，以便防止转JSON时的出错
            if (!_.isEmpty(state.settings.relations)) {
                _.each(state.settings.relations,(module,key) => {
                    delete item[key];
                })
            }
            return new Promise((resolve,reject) => {
                this._vm.$axios.post(state.settings.create.url,item)
                    .then(response => {
                        // let item = state.settings.getter(response.data.data);
                        let item = state.generator.create(response.data.data);

                        dispatch('put',item);
                        commit('setCurrent',_.clone(item));
                        commit(Definition.COMMON_MUTATION_RESET_REMOTE_FORM_ERROR,null,{root:true});

                        RemoteHelper.showRemoteMessage(this._vm,response);
                        resolve(item);

                    })
                    .catch((error) => {
                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        commit(Definition.COMMON_MUTATION_SET_REMOTE_FORM_ERROR ,error,{root:true});

                        RemoteHelper.showRemoteError(this._vm,error,state.settings.create.error);
                        reject(error.response);
                    })
            })

        },

        /**
         * 向远程删除一个item
         *
         * @param commit
         * @param state
         * @param dispatch
         * @param id
         */
        [Definition.STORE_ACTION_DELETE]({commit,state,dispatch},id) {
            return new Promise((resolve,reject) => {
                this._vm.$axios.delete(state.settings.delete.url.replace(':id',id))
                    .then(response => {
                        dispatch('delete',id);

                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        RemoteHelper.showRemoteMessage(this._vm,response);
                        resolve(response);
                    })
                    .catch((error) => {
                        RemoteHelper.showRemoteError(this._vm,error,state.settings.delete.error);

                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        reject(error);
                    })
            });

        },

        /**
         * 远程获取列表
         *
         * @param commit
         * @param state
         * @param getters
         * @param dispatch
         * @param limit
         * @returns {Promise<any>}
         */
        [Definition.STORE_ACTION_LIST]({commit,state,getters,dispatch},limit) {
            return new Promise((resolve,reject) => {
                commit(Definition.COMMON_MUTATION_START_LOAD,null,{root:true});
                if (limit) {
                    getters[Definition.STORE_GETTER_QUERY].setPerPage(limit);
                }

                this._vm.$axios.get(
                    state.settings.list.url,
                    {
                        params: getters[Definition.STORE_GETTER_QUERY].getQuery(state.page)
                    })
                    .then(response => {
                        let items = state.generator.create(response.data.data);
                        commit('setList', {
                            items: items,
                            total: response.data.total
                        });
                        dispatch('put',_.clone(items));


                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        resolve(items);
                    })
                    .catch((error) => {
                        RemoteHelper.showRemoteError(this._vm,error,state.settings.list.error);
                        commit(Definition.COMMON_MUTATION_END_LOAD,null,{root:true});
                        reject(error);
                    });
            });
        }
    }
};