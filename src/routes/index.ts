import {ServerRoute} from "@hapi/hapi";
import Config from "../config";
import {HTTP_METHODS} from "../util";
import documentRoutes from "./documents";

const indexRoutes: ServerRoute[] = [
    { method: HTTP_METHODS.GET, path: "/", handler: function (request, h) {
        return h.response().redirect(`/${Config.DOCUMENTS_PATH}`);
    } }
];

const routes: ServerRoute[] = ([] as ServerRoute[]).concat(indexRoutes, documentRoutes);
export default routes;
