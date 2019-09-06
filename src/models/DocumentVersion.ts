export type ModificationDate = string;
export type Content = object;
export type DocumentId = string;

export interface ISimpleVersion {
    documentId: DocumentId;
    versionId: number;
    modificationDate: ModificationDate;
    content: Content;
}

/** Class representing a specific version of a document. */
export default class DocumentVersion {

    /**
     * Creates a DocumentVersion from a plain old Javascript object.
     * @param {simpleVersion} ISimpleVersion - The plain old Javascript object representing the version.
     * @return {DocumentVersion} The document version.
     */
    public static from(simpleVersion: ISimpleVersion): DocumentVersion {
        return new DocumentVersion(
            simpleVersion.documentId,
            simpleVersion.versionId,
            simpleVersion.content,
            simpleVersion.modificationDate
        );
    }

    private readonly documentId: DocumentId;
    private readonly versionId: number;
    private readonly modificationDate: ModificationDate;
    private readonly content: Content;

    /**
     * Represents a specific version of a document.
     * @constructor
     * @param {DocumentId} documentId - The id of the document.
     * @param {number} versionId - The id of the version.
     * @param {object} content - The content of the document for this version.
     * @param {ModificationDate} modificationDate - The modification date of this version.
     */
    constructor(documentId: DocumentId, versionId: number, content: Content, modificationDate: ModificationDate) {
        this.documentId = documentId;
        this.versionId = versionId;
        this.content = content;
        this.modificationDate = modificationDate;
    }

    /**
     * Get the document id.
     * @return {DocumentId} The document id.
     */
    public getDocumentId(): DocumentId {
        return this.documentId;
    }

    /**
     * Get the version id.
     * @return {number} The version id.
     */
    public getVersionId(): number {
        return this.versionId;
    }

    /**
     * Get the modification date.
     * @return {ModificationDate} The modification date.
     */
    public getModificationDate(): ModificationDate {
        return this.modificationDate;
    }

    /**
     * Get the content.
     * @return {Content} The content.
     */
    public getContent(): Content {
        return this.content;
    }
}
