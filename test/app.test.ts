import expect from "expect";
import {server} from "../src/app";
import Config from "../src/config";

const randomDocumentIdentifier1: string = Math.random().toString(36).substring(2, 15);
const randomDocumentIdentifier2: string = Math.random().toString(36).substring(2, 15);

// Start application before running the test case
beforeAll((done) => {
    server.events.on("start", () => {
        done();
    });
});

// Stop application after running the test case
afterAll((done) => {
    server.events.on("stop", () => {
        done();
    });
    server.stop();
});

test("server connection OK", async function (done) {
    expect.assertions(1);
    const options = {
        method: "GET",
        url: "/"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(302);
    done();
});

test("working documents index", async function (done) {
    expect.assertions(6);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("documents");
    expect(payload.documents.length).toBe(0);
    expect(payload).toHaveProperty("totalCount");
    expect(payload.totalCount).toBe(0);
    done();
});

test("uploading documents", async function (done) {
    expect.assertions(2);
    const options = {
        method: "POST",
        url: "/" + Config.DOCUMENTS_PATH,
        payload: {
            changeDate: "2018-07-24T09:24:26.300Z",
            documentId: "",
            document: {
                property1: "value1",
                property2: "value2",
                property3: "value3"
            }
        }
    };
    options.payload.documentId = randomDocumentIdentifier1;
    const data1 = await server.inject(options);
    expect(data1.statusCode).toBe(201);

    options.payload.documentId = randomDocumentIdentifier2;
    const data2 = await server.inject(options);
    expect(data2.statusCode).toBe(201);
    done();
});

test("uploading a new version of a document", async function (done) {
    expect.assertions(1);
    const options = {
        method: "POST",
        url: "/" + Config.DOCUMENTS_PATH,
        payload: {
            changeDate: "2018-07-24T09:24:26.300Z",
            documentId: randomDocumentIdentifier2,
            document: {
                property1: "value1",
                property2: "value2",
                property3: "value3",
                property4: "value4"
            }
        }
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(201);
    done();
});

test("using the limit query parameter on the list of documents", async function (done) {
    expect.assertions(7);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "?limit=1"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("documents");
    expect(payload.documents.length).toBe(1);
    expect(payload.documents[0]).toBe(randomDocumentIdentifier2);
    expect(payload).toHaveProperty("totalCount");
    expect(payload.totalCount).toBe(2);
    done();
});

test("using the order query parameter on the list of documents", async function (done) {
    expect.assertions(5);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "?order=descending"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("documents");
    expect(payload.documents.length).toBe(2);
    expect(payload.documents[0]).toBe(randomDocumentIdentifier1);
    done();
});

test("using the offset query parameter on the list of documents", async function (done) {
    expect.assertions(5);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "?offset=1"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("documents");
    expect(payload.documents.length).toBe(1);
    expect(payload.documents[0]).toBe(randomDocumentIdentifier1);
    done();
});

test("retrieving a document", async function (done) {
    expect.assertions(2);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "/" + randomDocumentIdentifier1
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    done();
});

test("using the limit query parameter on the list of versions", async function (done) {
    expect.assertions(7);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "/" + randomDocumentIdentifier2 + "/" + Config.VERSIONING_PATH  + "?limit=1"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("versions");
    expect(payload.versions.length).toBe(1);
    expect(payload.versions[0].versionId).toBe(1);
    expect(payload).toHaveProperty("totalCount");
    expect(payload.totalCount).toBe(2);
    done();
});

test("using the order query parameter on the list of versions", async function (done) {
    expect.assertions(5);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "/" + randomDocumentIdentifier2 + "/" + Config.VERSIONING_PATH  + "?order=descending"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("versions");
    expect(payload.versions.length).toBe(2);
    expect(payload.versions[0].versionId).toBe(2);
    done();
});

test("using the offset query parameter on the list of versions", async function (done) {
    expect.assertions(5);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "/" + randomDocumentIdentifier2 + "/" + Config.VERSIONING_PATH  + "?offset=1"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    let payload;
    try {
        payload = JSON.parse(data.payload);
    } catch (e) {
        payload = {};
    }
    expect(payload).toHaveProperty("versions");
    expect(payload.versions.length).toBe(1);
    expect(payload.versions[0].versionId).toBe(2);
    done();
});

test("retrieving a specific version of a document", async function (done) {
    expect.assertions(2);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH + "/" + randomDocumentIdentifier1 + "/" + Config.VERSIONING_PATH  + "/1"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.payload).toBeDefined();
    done();
});
