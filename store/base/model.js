import Url from "./url";
import BaseFactory from "../factory/base-factory";
import Store from "../mix/store";
import Database from "../database/database";


export default class Model extends BaseFactory {

    get prototype() {
        throw exception('must specify Model.prototype');
    }

    get name() {
        throw exception('must specify Model.name');
    }

    get idKey() {
        return 'id';
    }

    get namespace() {
        return false;
    }

    get getUrl() {
        return new Url('/:name/:id');
    }

    get updateUrl() {
        return new Url('/:name/:id','put');
    }

    get createUrl() {
        return new Url('/:name','post');
    }

    get deleteUrl() {
        return new Url('/:name/:id','delete');
    }

    get listUrl() {
        return new Url('/:name');
    }

    get setter() {
        return (item) => item;
    }

    get getter() {
        return (item) => item;
    }

    get restful() {
        return true;
    }

    get init() {
        return () => {}
    }

    get rules() {
        return {};
    }

    get mixes() { return []}

    get relations() {
        return {}
    }

    constructor(namespace = true) {
        super(namespace);

        this.importCommon();
        Database.registerTable(this.name,this.idKey);

        this.importUrl();
        this.importPrototype();
        this.registerMix(Store);
        this.importMixes();
    }

    importCommon() {
        this.importSettings(['idKey','name','getter','setter','rules','relations']);
        this.addSetting('idKeyType',this.prototype[this.idKey]);
    }

    importPrototype() {
        let defineData = {},
            define = {};

        _.each(this.prototype,(type,name) => {
            if (_.includes([String, Boolean, Number, Array, Object, Function],type)) {
                defineData[name] = type();
                define[name] = {
                    get: function () {
                        let value = this._data[name];
                        if (typeof value === type.name.toLowerCase()) {
                            return value;
                        } else if (type.name === 'Array' && _.isArray(value)) {
                            return value;
                        } else if (type.name === 'String' &&  _.isNull(value)) {
                            return null;
                        } else {
                            return type(value);
                        }
                    },
                    set: function (value) {
                        if (typeof value !== type.name.toLowerCase()) {
                            if (_.isNull(value)) {
                                value = null;
                            } else if (type.name === 'Array' && _.isArray(value)) {
                            } else {
                                value = type(value);
                            }
                        }

                        return this._data[name] = value;
                    },
                    enumerable :true
                };
            } else {
                defineData[name] = null;
                define[name] = {
                    get: function () {
                        return this._data[name];
                    },
                    set: function (value) {
                        this._data[name] = value;
                    },
                    enumerable :true
                };
                define[name] = Object.assign(define[name],type);
            }
        });

        let generator =  {
            define,
            create(items) {
                let returnArray = true;
                if (!_.isArray(items)) {
                    items = [items];
                    returnArray = false;
                }

                let results = [];
                for (let item of items) {
                    results.push(Object.assign(Object.create({_data:_.clone(defineData)}, this.define), item));
                }

                return returnArray ? results : results[0];
            }
        };

        this.addState('generator',generator);
        this.addState('empty',generator.create());
    }

    importUrl() {
        for (let name of ['get','create','update','delete','list']) {
            let url = this[name + 'Url'];
            url.setVariable(this.settings);
            this.addSetting(name,url.toObject());
        }
    }

    importMixes() {
        if (_.isArray(this.mixes)) {
            for (let mix of this.mixes) {
                this.registerMix(mix);
            }
        }
    }
}