/**
 * Author: Charles.Tide<charlestide@vip.163.com>
 * Date: 2018/2/3.
 */

export default class Router {

    constructor() {
        this.routes = new Map();
        this.rootRoutes = new Map();
    }



    addRootRoute(path,component,menu,title,icon,summary) {
        this.rootRoutes.set(path,new Route({
            path,
            component,
            menu,
            title,
            icon,
            summary
        }));

        return this;
    }

    addRoute(path,component,menu,title,icon,summary) {
        this.routes.set(path,new Route({
            path,
            component,
            menu,
            title,
            icon,
            summary
        }));
        return this;
    }

    addModuleRoute(module,moduleDisplayName,menu,icon,prefix = 'pvc-') {
        this.addRoute(module,prefix + module + '-index',menu,moduleDisplayName,icon,'在这里可以对管理员进行管理');
        this.addRoute(module + '/create',prefix + module + '-create',menu,moduleDisplayName,icon,'在这里可以创建一个新的' + moduleDisplayName);
        this.addRoute(module + '/:id',prefix + module + '-show',menu,moduleDisplayName,icon,'查看' + moduleDisplayName + '的详细信息');
        this.addRoute(module + '/:id/edit',prefix + module + '-edit',menu,moduleDisplayName,'edit','在这里可以修改' + moduleDisplayName + '的信息');
        return this;
    }

    setHomeRoute(menu,title,icon,summary) {
        this.addRootRoute('/','pvc-app',menu,title,icon,summary);
        return this;
    }

    setLoginRoute(component,menu,title,icon,summary) {
        this.addRootRoute('/login',component,menu,title,icon,summary);
        return this;
    }

    setInitRoute(component,menu,title,icon,summary) {
        this.addRootRoute('/init',component,menu,title,icon,summary);
        return this;
    }

    output() {
        let routes = [];
        this.rootRoutes.forEach((rootRoute,path) => {
            if (path === '/') {
                rootRoute.setChildren(this.routes);
            }
            routes.push(rootRoute.output());
        });
        return routes;
    }

    getRouteRoute(path) {
        return this.rootRoutes.get(path);
    }

    getRoute(path) {
        return this.routes.get(path);
    }
}

export class Route {

    constructor(path,component = null,menu = null,title = null,icon = null,summary = null,children = null) {
        if (_.isObject(path)) {
            this.fromObject(path);
        } else {
            this.path = path;
            this.component = component;
            this.menu = menu;
            this.title = title;
            this.icon = icon;
            this.summary = summary;
            this.children = _.isMap(children) ? children : new Map();
        }
    }

    fromObject(map) {
        this.path = map.path;
        this.component = map.component;
        this.menu = map.menu;
        this.title = map.title;
        this.icon = map.icon;
        this.summary = map.summary;
        this.children = _.isMap(map.children) ? map.children : new Map();
    }

    output() {
        let children = [];

        this.children.forEach((child,path) => {
            children.push(child.output());
        });

        return {
            path: this.path,
            componentName: this.component,
            meta: {
                menu_name: this.menu,
                title: this.title,
                icon: this.icon,
                summary: this.summary
            },
            children: children
        }
    }

    setChildren(children) {
        if (_.isMap(children)) {
            this.children = children;
        }
    }

    addChild(child) {
        if (child instanceof Route) {
            this.children.set(child.path,child);
        }
    }
}
