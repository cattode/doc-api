import {ServerRoute} from "@hapi/hapi";
import documentRoutes from "./documents";
import {HTTP_METHODS, HTTP_STATUS} from "./util";

const indexRoutes: ServerRoute[] = [
    { method: HTTP_METHODS.GET, path: "/", handler: function (request, h) {
        // TODO
        return h.response().code(HTTP_STATUS.NOT_IMPLEMENTED);
    } }
];

const routes: ServerRoute[] = ([] as ServerRoute[]).concat(indexRoutes, documentRoutes);
export default routes;
