export default {
    /* Server configuration */
    HOST: "localhost",
    PORT: 3000,

    /* API pathes */
    DOCUMENTS_PATH: "documents",
    VERSIONING_PATH: "versions",
    DIFF_PATH: "diff",

    /* API rate limits */
    RATE_LIMIT: 500,

    /* Database configuration */
    DB_NAME: "db",
    DB_COLLECTION_NAME: "documents",
    // Document retrieval limits
    DOCUMENT_LIMIT_DEFAULT: 100,
    DOCUMENT_LIMIT_MAX: 1000,
    // Versions retrieval limits
    VERSION_LIMIT_DEFAULT: 100,
    VERSION_LIMIT_MAX: 1000
};
