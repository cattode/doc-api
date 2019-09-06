import expect from "expect";
import {server} from "../src/app";
import Config from "../src/config";

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

test("should success with server connection", async function (done) {
    expect.assertions(1);
    const options = {
        method: "GET",
        url: "/"
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    done();
});

test("should success if documents index is working", async function (done) {
    expect.assertions(1);
    const options = {
        method: "GET",
        url: "/" + Config.DOCUMENTS_PATH
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    done();
});
