import Boom from "@hapi/boom";
import { Lifecycle } from "@hapi/hapi";
import Joi from "@hapi/joi";
import Database from "../Database";
import Document from "../models/Document";
import DocumentVersion from "../models/DocumentVersion";
import {getURL, ORDERING} from "../util";

interface IPayload {
    changeDate: string;
    documentId: string;
    document: object;
}

const payloadSchema = Joi.object({
    changeDate: Joi.string().isoDate().required(),
    documentId: Joi.string().required(),
    document: Joi.object().required()
});

export const getSome: Lifecycle.Method = (request, h) => {
    const ascendingOrder: boolean = request.query.order !== ORDERING.DESCENDING;

    const offset: number = Number.parseInt(request.query.offset as string, 10);
    if (isNaN(offset) || offset < 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const limit: number = Number.parseInt(request.query.limit as string, 10);
    if (isNaN(limit) || limit < 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const documentsInfo = Database.instance.getDocuments(offset, limit, ascendingOrder);

    const response = {
        documents: documentsInfo.documents,
        totalCount: documentsInfo.totalCount,
        links: [
            {
                rel: "self",
                href: request.url.toString()
            }
        ]
    };
    return h.response(response);
};

export const add: Lifecycle.Method = (request, h) => {
    let payload: IPayload;
    try {
        payload = JSON.parse(request.payload.toString() as string) as IPayload;
        const validationResult = payloadSchema.validate(payload);
        if (validationResult.error !== null) {
            return h.response(Boom.badRequest("Invalid request payload input").output.payload);
        }
    } catch (e) {
        return h.response(Boom.badRequest("Invalid request payload input").output.payload);
    }

    const modificationDate: string = payload.changeDate;
    const documentId: string = payload.documentId;
    const content: object = payload.document;

    try {
        const newVersion: DocumentVersion = Database.instance.addDocument(documentId, modificationDate, content);
        return h.response().code(201).location(getURL(documentId, true, newVersion.getVersionId()));
    } catch (e) {
        return h.response(Boom.internal());
    }
};

export const getOne: Lifecycle.Method = (request, h) => {
    const documentId: string = request.params.documentId;
    if (documentId.length === 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const targetDocument: Document | null = Database.instance.getDocument(documentId);
    if (targetDocument !== null) {
        const currentVersion: DocumentVersion = targetDocument.getCurrentVersion();
        const response = {
            documentId: documentId,
            document: currentVersion.getContent(),
            lastModified: currentVersion.getModificationDate,
            currentVersion: currentVersion.getVersionId(),
            links: [
                {
                    rel: "self",
                    href: request.url.toString()
                },
                {
                    rel: "versions",
                    href: getURL(documentId, true)
                },
                {
                    rel: "version",
                    href: getURL(documentId, true, currentVersion.getVersionId())
                }
            ]
        };
        return h.response(response);
    } else {
        return h.response(Boom.notFound(`No document with the id ${documentId} could be found.`).output.payload);
    }
};
