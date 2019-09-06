import {ServerRoute} from "@hapi/hapi";
import Joi from "@hapi/joi";
import Config from "../config";
import * as DocumentsController from "../controllers/documents";
import * as VersionsController from "../controllers/versions";
import {HTTP_METHODS, ORDERING} from "../util";

const routes: ServerRoute[] = [
    {
        method: HTTP_METHODS.GET,
        path: `/${Config.DOCUMENTS_PATH}`,
        handler: DocumentsController.getSome,
        options: {
            validate: {
                query: {
                    offset: Joi.number().integer().min(0).default(0),
                    limit: Joi.number().integer().min(1).max(Config.DOCUMENT_LIMIT_MAX)
                            .default(Config.DOCUMENT_LIMIT_DEFAUT),
                    order: Joi.string().default(ORDERING.ASCENDING)
                }
            }
        }
    },

    {
        method: HTTP_METHODS.POST,
        path: `/${Config.DOCUMENTS_PATH}`,
        handler: DocumentsController.add,
        options: {
            payload: {
                parse: false
            }
        }
    },

    {
        method: HTTP_METHODS.GET,
        path: `/${Config.DOCUMENTS_PATH}/{documentId}`,
        handler: DocumentsController.getOne,
        options: {
            validate: {
                params: {
                    documentId: Joi.string().required()
                }
            }
        }
    },

    {
        method: HTTP_METHODS.GET,
        path: `/${Config.DOCUMENTS_PATH}/{documentId}/${Config.VERSIONING_PATH}`,
        handler: VersionsController.getSome,
        options: {
            validate: {
                params: {
                    documentId: Joi.string().required()
                },
                query: {
                    offset: Joi.number().integer().min(0).default(0),
                    limit: Joi.number().integer().min(1).max(Config.DOCUMENT_LIMIT_MAX)
                            .default(Config.DOCUMENT_LIMIT_DEFAUT),
                    order: Joi.string().default(ORDERING.ASCENDING)
                }
            }
        }
    },

    {
        method: HTTP_METHODS.GET,
        path: `/${Config.DOCUMENTS_PATH}/{documentId}/${Config.VERSIONING_PATH}/{versionId}`,
        handler: VersionsController.getOne,
        options: {
            validate: {
                params: {
                    documentId: Joi.string().required(),
                    versionId: Joi.number().integer().min(1).required()
                }
            }
        }
    },

    {
        method: HTTP_METHODS.GET,
        path: `/${Config.DOCUMENTS_PATH}/{documentId}/${Config.VERSIONING_PATH}/{versionId}/${Config.DIFF_PATH}`,
        handler: VersionsController.getDiff,
        options: {
            validate: {
                params: {
                    documentId: Joi.string().required(),
                    versionId: Joi.number().integer().min(2).required()
                }
            }
        }
    }
];

export default routes;
