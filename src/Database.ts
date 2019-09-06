import loki from "lokijs";
import Document from "./models/Document";
import DocumentVersion, {Content, DocumentId, ISimpleVersion, ModificationDate} from "./models/DocumentVersion";

/** Class representing the database. */
export default class Database {

    public static instance: Database;
    private documentStore: Collection<ISimpleVersion>;

    /**
     * Represents the database.
     * @constructor
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the document collection.
     */
    constructor(dbName: string, collectionName: string) {
        Database.instance = this;
        const db = new loki(dbName);
        this.documentStore = db.addCollection<ISimpleVersion>(collectionName, { indices: ["documentId"] });
    }

    /**
     * Adds a new version of a document in the database
     * @param {DocumentId} documentId - The id of the document.
     * @param {ModificationDate} modificationDate - The modification date of the new version.
     * @param {Content} content - The content of the new version.
     * @return {DocumentVersion} The new version of the document.
     */
    // tslint:disable-next-line:max-line-length
    public addDocument(documentId: DocumentId, modificationDate: ModificationDate, content: Content): DocumentVersion {
        const versionCount = this.documentStore.chain().find({documentId: { $eq: documentId}}).count();

        const simpleVersion: ISimpleVersion = {
            documentId: documentId,
            versionId: versionCount + 1,
            modificationDate: modificationDate,
            content: content
        };

        this.documentStore.insert(simpleVersion);
        return DocumentVersion.from(simpleVersion);
    }

    /**
     * Get a specific document from the database
     * @param {DocumentId} documentId - The id of the document.
     * @return {Document} The requested document.
     */
    public getDocument(documentId: DocumentId): Document | null {
        const resultSetVersions = this.documentStore.chain().find({documentId: { $eq: documentId}});

        const versionCount = resultSetVersions.count();
        if (versionCount === 0) {
            return null;
        }

        const lastVersion: ISimpleVersion | null = this.documentStore
            .findOne({documentId: documentId, versionId: versionCount});
        if (lastVersion == null) {
            return null;
        }

        return new Document(documentId, DocumentVersion.from(lastVersion));
    }

    /**
     * Get a specific version of a document from the database
     * @param {DocumentId} documentId - The id of the document.
     * @param {number} versionId - The id of the version.
     * @return {Document} The requested version of the document.
     */
    public getVersion(documentId: DocumentId, versionId: number): DocumentVersion | null {
        const targetVersion: ISimpleVersion | null = this.documentStore
            .findOne({documentId: documentId, versionId: versionId});

        if (targetVersion === null) {
            return null;
        }
        return DocumentVersion.from(targetVersion);
    }

    /**
     * Get a list of documents from the database
     * @param {number} offset - The document identifier offset at which the list should start.
     * @param {number} count - The number of documents to retrieve.
     * @param {boolean} ascendingOrder - Whether the list should be retrieved in an ascending order.
     * @return {object} info Information about the document list.
     * @return {DocumentId[]} info.documents The list of requested document identifiers.
     * @return {number} info.totalCount The total count of documents.
     */
    // tslint:disable-next-line:max-line-length
    public getDocuments(offset: number, count: number, ascendingOrder: boolean): {documents: DocumentId[], totalCount: number} {
        const resultSetDocuments = this.documentStore.chain().find({versionId: { $eq: 1}});
        const totalCount: number = resultSetDocuments.count();
        const targetDocuments = resultSetDocuments
            .simplesort("versionId", { desc: !ascendingOrder})
            .offset(offset).limit(count).data();

        return {
            documents: targetDocuments.map((version) => version.documentId),
            totalCount
        };
    }

    /**
     * Get a list of versions of a document from the database
     * @param {DocumentId} documentId - The id of the document.
     * @param {number} offset - The document identifier offset at which the list should start.
     * @param {number} count - The number of documents to retrieve.
     * @param {boolean} ascendingOrder - Whether the list should be retrieved in an ascending order.
     * @return {object} info Information about the list of the versions.
     * @return {DocumentVersion[]} info.versions The list of requested versions.
     * @return {number} info.totalCount The total count of versions.
     */
    // tslint:disable-next-line:max-line-length
    public getVersions(documentId: DocumentId, offset: number, count: number, ascendingOrder: boolean): {totalCount: number, versions: DocumentVersion[]} {
        const resultSetVersions = this.documentStore.chain().find({documentId: { $eq: documentId}});
        const totalCount: number = resultSetVersions.count();
        const targetVersions = resultSetVersions
            .simplesort("versionId", { desc: !ascendingOrder})
            .offset(offset).limit(count).data();

        return {
            totalCount,
            versions: targetVersions.map((version) => DocumentVersion.from(version))
        };
    }

}
