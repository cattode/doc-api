import Config from "../src/config";
import Database from "../src/Database";
import Document from "../src/models/Document";
import DocumentVersion from "../src/models/DocumentVersion";

const database: Database = new Database(Config.DB_NAME, Config.DB_COLLECTION_NAME);
const randomDocumentIdentifier1: string = Math.random().toString(36).substring(2, 15);
const randomDocumentIdentifier2: string = Math.random().toString(36).substring(2, 15);

test("Save documents", async function (done) {
    expect.assertions(6);
    const doc1v1 = database.addDocument(randomDocumentIdentifier1,  "2018-07-24T09:24:26.300Z", { foo: "bar" });
    const doc1v2 = database.addDocument(randomDocumentIdentifier1,  "2018-07-24T09:24:26.300Z", { foo: "baz" });
    const doc2v1 = database.addDocument(randomDocumentIdentifier2,  "2018-07-24T09:24:26.300Z", { foo: "bla" });
    expect(doc1v1).toBeInstanceOf(DocumentVersion);
    expect(doc1v1.getVersionId()).toBe(1);
    expect(doc1v2).toBeInstanceOf(DocumentVersion);
    expect(doc1v2.getVersionId()).toBe(2);
    expect(doc2v1).toBeInstanceOf(DocumentVersion);
    expect(doc2v1.getVersionId()).toBe(1);
    done();
});

test("Retrieve multiple documents", async function (done) {
    expect.assertions(2);
    const infoDocuments = database.getDocuments(0, 1000, true);
    expect(infoDocuments.totalCount).toBe(2);
    expect(infoDocuments.documents.length).toBe(2);
    done();
});

test("Retrieve a document", async function (done) {
    expect.assertions(2);
    const document = database.getDocument(randomDocumentIdentifier1);
    expect(document).toBeInstanceOf(Document);
    expect((document as Document).getCurrentVersion().getVersionId()).toBe(2);
    done();
});

test("Retrieve multiple versions of a document", async function (done) {
    expect.assertions(2);
    const infoVersions = database.getVersions(randomDocumentIdentifier1, 0, 1000, true);
    expect(infoVersions.totalCount).toBe(2);
    expect(infoVersions.versions.length).toBe(2);
    done();
});

test("Retrieve a version of a document", async function (done) {
    expect.assertions(2);
    const version = database.getVersion(randomDocumentIdentifier1, 1);
    expect(version).toBeInstanceOf(DocumentVersion);
    expect((version as DocumentVersion).getVersionId()).toBe(1);
    done();
});
