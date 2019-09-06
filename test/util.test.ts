import Config from "../src/config";
import {getURL} from "../src/util";

test("getURL function", async function (done) {
    expect.assertions(4);

    const randomString: string = Math.random().toString(36).substring(2, 15);
    expect(getURL(randomString)).toBe(`http://${Config.HOST}:${Config.PORT}/${Config.DOCUMENTS_PATH}/${randomString}`);
    expect(getURL(randomString)).toBe(getURL(randomString, false));

    expect(getURL(randomString, true)).toBe(`http://${Config.HOST}:${Config.PORT}/${Config.DOCUMENTS_PATH}/${randomString}/${Config.VERSIONING_PATH}`);

    const randomNumber: number = Math.floor(Math.random() * Number.MAX_VALUE);
    expect(getURL(randomString, true, randomNumber)).toBe(`http://${Config.HOST}:${Config.PORT}/${Config.DOCUMENTS_PATH}/${randomString}/${Config.VERSIONING_PATH}/${randomNumber}`);
    done();
});
