import {ServerRoute} from "@hapi/hapi";
import Config from "../config";
import {HTTP_METHODS, HTTP_STATUS} from "./util";

const routes: ServerRoute[] = [
    { method: HTTP_METHODS.GET, path: "/" + Config.DOCUMENTS_PATH, handler: function (request, h) {
        // TODO
        return h.response().code(HTTP_STATUS.NOT_IMPLEMENTED);
    } },

    { method: HTTP_METHODS.POST, path: "/" + Config.DOCUMENTS_PATH, handler: function (request, h) {
        // TODO
        return h.response().code(HTTP_STATUS.NOT_IMPLEMENTED);
    } },

    { method: HTTP_METHODS.GET, path: "/" + Config.DOCUMENTS_PATH + "/{documentId}", handler: function (request, h) {
        // TODO
        return h.response().code(HTTP_STATUS.NOT_IMPLEMENTED);
    } },

    // tslint:disable-next-line:max-line-length
    { method: HTTP_METHODS.GET, path: "/" + Config.DOCUMENTS_PATH + "/{documentId}/" + Config.VERSIONING_PATH, handler: function (request, h) {
        // TODO
        return h.response().code(HTTP_STATUS.NOT_IMPLEMENTED);
    } },

    // tslint:disable-next-line:max-line-length
    { method: HTTP_METHODS.GET, path: "/" + Config.DOCUMENTS_PATH + "/{documentId}/"  + Config.VERSIONING_PATH + "/{versionId}", handler: function (request, h) {
        // TODO
        return h.response().code(HTTP_STATUS.NOT_IMPLEMENTED);
    } }
];

export default routes;
