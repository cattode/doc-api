import {ServerRoute} from "@hapi/hapi";
import documentRoutes from "./documents";

export const METHODS = { GET: "GET", POST: "POST"};

const indexRoutes: ServerRoute[] = [
    { method: METHODS.GET, path: "/", handler: function (request, h) {
        // TODO
        return h.response().code(501);
    } }
];

const routes: ServerRoute[] = ([] as ServerRoute[]).concat(indexRoutes, documentRoutes);
export default routes;
