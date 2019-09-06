import Hapi from "@hapi/hapi";
import HapiRateLimit from "hapi-rate-limit";
import Config from "./config";
import Database from "./Database";
import routes from "./routes";

export const server = new Hapi.Server({
    host: Config.HOST,
    port: Config.PORT,
    router: {
        stripTrailingSlash: true,
    },
});

export const database: Database = new Database(Config.DB_NAME, Config.DB_COLLECTION_NAME);

const init = async () => {

    server.route(routes);

    await server.register({
        plugin: HapiRateLimit,
        options: {
            enabled: true,
            userLimit: Config.RATE_LIMIT,
            headers: false
        }
    });

    await server.start();
    console.log("Server running on %s", server.info.uri + `/${Config.DOCUMENTS_PATH}`);
};

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

init();
