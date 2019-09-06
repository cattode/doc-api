import Config from "./config";
export const HTTP_METHODS = { GET: "GET", POST: "POST" };
export const ORDERING = { ASCENDING: "ascending", DESCENDING: "descending" };

/**
 * Construct the URL of the API for a specific document and version
 * @param {DocumentId} documentId - The id of the document.
 * @param {boolean} includeVersions - Whether the resulting URL should include versions (default = false).
 * @param {number} versionId - The id of the version.
 * @return {string} The constructed URL.
 */
export function getURL(documentID?: string, includeVersions: boolean = false, versionID?: number): string {
    let url: string = `http://${Config.HOST}:${Config.PORT}/${Config.DOCUMENTS_PATH}`;

    if (documentID === null) {
        return url;
    }

    url += `/${documentID}`;

    if (!includeVersions) {
        return url;
    }

    url += `/${Config.VERSIONING_PATH}`;

    if (versionID === undefined) {
        return url;
    }

    url += `/${versionID}`;

    return url;
}
