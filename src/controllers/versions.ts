import Boom from "@hapi/boom";
import { Lifecycle } from "@hapi/hapi";
import { diff } from "json-diff";
import Database from "../Database";
import DocumentVersion from "../models/DocumentVersion";
import {getURL, ORDERING} from "../util";

export const getSome: Lifecycle.Method = (request, h) => {
    const documentId: string = request.params.documentId;
    if (documentId.length === 0) {
        return h.response(Boom.badRequest("Invalid request params input"));
    }

    const ascendingOrder: boolean = request.query.order !== ORDERING.DESCENDING;

    const offset: number = Number.parseInt(request.query.offset as string, 10);
    if (isNaN(offset) || offset < 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const limit: number = Number.parseInt(request.query.limit as string, 10);
    if (isNaN(limit) || limit < 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const versionsInfo = Database.instance.getVersions(documentId, offset, limit, ascendingOrder);

    const response = {
        documentId: documentId,
        versions: versionsInfo.versions.map((version) => {
            return {
                number: version.getVersionId(),
                modificationDate: version.getModificationDate()
            };
        }),
        totalCount: versionsInfo.totalCount,
        links: [
            {
                rel: "self",
                href: request.url.toString()
            }
        ]
    };
    return h.response(response);
};

export const getOne: Lifecycle.Method = (request, h) => {
    const documentId: string = request.params.documentId;
    if (documentId.length === 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const versionId: number = Number.parseInt(request.params.versionId, 10);
    if (isNaN(versionId) || versionId < 1) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const targetVersion: DocumentVersion | null = Database.instance.getVersion(documentId, versionId);
    if (targetVersion === null) {
        if (Database.instance.getDocument(documentId) !== null) {
            return h.response(Boom.notFound(
                `No document with the id ${documentId} could be found.`
                ).output.payload);
        } else {
            return h.response(Boom.notFound(
                `No version #${versionId} could be found for the document ${documentId}.`
                ).output.payload);
        }
    }

    const response = {
        documentId: documentId,
        document: targetVersion.getContent(),
        version: versionId,
        modificationDate: targetVersion.getModificationDate,
        links: [
            {
                rel: "self",
                href: request.url.toString()
            },
            {
                rel: "document",
                href: getURL(documentId)
            }
        ]
    };

    return h.response(response);
};

export const getDiff: Lifecycle.Method = (request, h) => {
    const documentId: string = request.params.documentId;
    if (documentId.length === 0) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const versionId: number = Number.parseInt(request.params.versionId, 10);
    if (isNaN(versionId) || versionId < 2) {
        return h.response(Boom.badRequest("Invalid request params input").output.payload);
    }

    const targetVersion: DocumentVersion | null = Database.instance.getVersion(documentId, versionId);
    if (targetVersion === null) {
        return h.response(
            Boom.notFound(`No version #${versionId} could be found for the document ${documentId}.`).output.payload
        );
    }

    const previousVersion: DocumentVersion | null = Database.instance.getVersion(documentId, versionId - 1);
    if (previousVersion === null) {
        return h.response(
            Boom.internal(`No version #${versionId} could be found for the document ${documentId}.`).output.payload
        );
    }

    const response = {
        documentId: documentId,
        version: versionId,
        diff: diff(previousVersion.getContent(), targetVersion.getContent(), {color: false}),
        links: [
            {
                rel: "self",
                href: request.url.toString()
            },
            {
                rel: "document",
                href: getURL(documentId)
            }
        ]
    };

    return h.response(response);
};
