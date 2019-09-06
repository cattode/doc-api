import {ServerRoute} from "@hapi/hapi";
import Joi from "@hapi/joi";
import Config from "../config";
import * as DocumentsController from "../controllers/documents";
import * as VersionsController from "../controllers/versions";
import {HTTP_METHODS, ORDERING} from "../util";

const routes: ServerRoute[] = [

    /**
     * List documents
     *
     * @route {GET} /documents
     * @queryparam {number} offset - The offset at which the list of documents should start.
     * @queryparam {number} limit - The number of documents.
     * @queryparam {['ascending'|'descending']} order - the order of the list (default = ascending).
     */
    {
        method: HTTP_METHODS.GET,
        path: `/${Config.DOCUMENTS_PATH}`,
        handler: DocumentsController.getSome,
        options: {
            validate: {
                query: {
                    offset: Joi.number().integer().min(0).default(0),
                    limit: Joi.number().integer().min(1).max(Config.DOCUMENT_LIMIT_MAX)
                            .default(Config.DOCUMENT_LIMIT_DEFAULT),
                    order: Joi.string().default(ORDERING.ASCENDING)
                }
            }
        }
    },

    /**
     * Add or update a document
     *
     * @route {POST} /documents
     * @bodyparam the document to save
     */
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

    /**
     * Get a document
     *
     * @route {GET} /documents/{documentId}
     * @routeParam {string} documentId - the id of the document
     */
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

    /**
     * Get the list of versions of a document
     *
     * @route {GET} /documents/{documentId}/versions
     * @routeParam {string} documentId - the id of the document
     * @queryparam {number} offset - The offset at which the list of versions should start.
     * @queryparam {number} limit - The number of versions.
     * @queryparam {['ascending'|'descending']} order - the order of the list (default = ascending).
     */
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
                            .default(Config.DOCUMENT_LIMIT_DEFAULT),
                    order: Joi.string().default(ORDERING.ASCENDING)
                }
            }
        }
    },

    /**
     * Get a specific version of a document
     *
     * @route {GET} /documents/{documentId}/versions/{versionId}
     * @routeParam {string} documentId - the id of the document
     * @routeParam {string} versionId - the id of the version
     */
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

    /**
     * Get a diff between a specific version of a document and the previous one
     *
     * @route {GET} /documents/{documentId}/versions/{versionId}/diff
     * @routeParam {string} documentId - the id of the document
     * @routeParam {string} versionId - the id of the version
     */
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
