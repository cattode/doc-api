import {ServerRoute} from "@hapi/hapi";
import Config from "../config";
import {METHODS} from "./util";

const routes: ServerRoute[] = [
    { method: METHODS.GET, path: "/" + Config.DOCUMENTS_PATH, handler: function (request, h) {
        // TODO
        return h.response().code(501);
    } },

    { method: METHODS.POST, path: "/" + Config.DOCUMENTS_PATH, handler: function (request, h) {
        // TODO
        return h.response().code(501);
    } },

    { method: METHODS.GET, path: "/" + Config.DOCUMENTS_PATH + "/{documentId}", handler: function (request, h) {
        // TODO
        return h.response().code(501);
    } },

    // tslint:disable-next-line:max-line-length
    { method: METHODS.GET, path: "/" + Config.DOCUMENTS_PATH + "/{documentId}/" + Config.VERSIONING_PATH, handler: function (request, h) {
        // TODO
        return h.response().code(501);
    } },

    // tslint:disable-next-line:max-line-length
    { method: METHODS.GET, path: "/" + Config.DOCUMENTS_PATH + "/{documentId}/"  + Config.VERSIONING_PATH + "/{versionId}", handler: function (request, h) {
        // TODO
        return h.response().code(501);
    } }
];

export default routes;
