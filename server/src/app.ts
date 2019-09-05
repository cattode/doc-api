import Hapi from "@hapi/hapi";
import Config from "./config";
import routes from "./routes";

export const server = new Hapi.Server({
    host: Config.HOST,
    port: Config.PORT,
    router: {
        stripTrailingSlash: true,
    },
});

const init = async () => {

    server.route(routes);

    await server.start();
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

init();
