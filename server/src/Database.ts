import loki from "lokijs";
import Document from "./models/Document";
import DocumentVersion, {Content, DocumentId, ISimpleVersion, ModificationDate} from "./models/DocumentVersion";

export default class Database {

    public static instance: Database;

    private documentStore: Collection<ISimpleVersion>;

    constructor(dbName: string, collectionName: string) {
        Database.instance = this;
        const db = new loki(dbName);
        this.documentStore = db.addCollection<ISimpleVersion>(collectionName, { indices: ["documentId"] });
    }

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

    public getVersion(documentId: DocumentId, versionId: number): DocumentVersion | null {
        const targetVersion: ISimpleVersion | null = this.documentStore
            .findOne({documentId: documentId, versionId: versionId});

        if (targetVersion === null) {
            return null;
        }
        return DocumentVersion.from(targetVersion);
    }

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

    // tslint:disable-next-line:max-line-length
    public getVersions(documentId: DocumentId, offset: number, count: number, ascendingOrder: boolean): {documentId: DocumentId, totalCount: number, versions: DocumentVersion[]} {
        const resultSetVersions = this.documentStore.chain().find({documentId: { $eq: documentId}});
        const totalCount: number = resultSetVersions.count();
        const targetVersions = resultSetVersions
            .simplesort("versionId", { desc: !ascendingOrder})
            .offset(offset).limit(count).data();

        return {
            documentId,
            totalCount,
            versions: targetVersions.map((version) => DocumentVersion.from(version))
        };
    }

}
