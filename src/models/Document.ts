import DocumentVersion, { DocumentId } from "./DocumentVersion";

/** Class representing a document. */
export default class Document {

    private readonly documentId: DocumentId;
    private readonly currentVersion: DocumentVersion;

    /**
     * Represents a document.
     * @constructor
     * @param {DocumentId} documentId - The id of the document.
     * @param {DocumentVersion} currentVersion - The currrent version of the document.
     */
    constructor(documentId: DocumentId, currentVersion: DocumentVersion) {
        this.documentId = documentId;
        this.currentVersion = currentVersion;
    }

    /**
     * Get the document id.
     * @return {DocumentId} The document id.
     */
    public getDocumentId(): DocumentId {
        return this.documentId;
    }

    /**
     * Get the current version of the document.
     * @return {DocumentVersion} The current version.
     */
    public getCurrentVersion(): DocumentVersion {
        return this.currentVersion;
    }

}
