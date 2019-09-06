import DocumentVersion, { DocumentId } from "./DocumentVersion";

export default class Document {

    private readonly documentId: DocumentId;
    private readonly currentVersion: DocumentVersion;

    constructor(documentId: DocumentId, currentVersion: DocumentVersion) {
        this.documentId = documentId;
        this.currentVersion = currentVersion;
    }

    public getDocumentId(): DocumentId {
        return this.documentId;
    }

    public getCurrentVersion(): DocumentVersion {
        return this.currentVersion;
    }

}
