export type ModificationDate = string;
export type Content = object;
export type DocumentId = string;

export interface ISimpleVersion {
    documentId: DocumentId;
    versionId: number;
    modificationDate: ModificationDate;
    content: Content;
}

export default class DocumentVersion {

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

    constructor(documentId: DocumentId, versionId: number, content: Content, modificationDate: ModificationDate) {
        this.documentId = documentId;
        this.versionId = versionId;
        this.content = content;
        this.modificationDate = modificationDate;
    }

    public getDocumentId(): DocumentId {
        return this.documentId;
    }

    public getVersionId(): number {
        return this.versionId;
    }

    public getModificationDate(): ModificationDate {
        return this.modificationDate;
    }

    public getContent(): Content {
        return this.content;
    }

    public toSimpleVersion() {
        return {
            modificationDate: this.modificationDate,
            content: this.content
        };
    }
}
