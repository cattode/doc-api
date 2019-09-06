import Config from "./config";
export const HTTP_METHODS = { GET: "GET", POST: "POST" };
export const ORDERING = { ASCENDING: "ascending", DESCENDING: "descending" };

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

    if (versionID === null) {
        return url;
    }

    url += `/${versionID}`;

    return url;
}
