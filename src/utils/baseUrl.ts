function getBaseUrl(): string {
    if (process.env.NODE_ENV == "production") {
        return process.env.PRODUCTION as string;
    }
    else if (process.env.NODE_ENV == "development") {
        return process.env.DEVELOPMENT as string;
    }
    else if (process.env.NODE_ENV == "staging") {
        return process.env.STAGING as string;
    }
    return process.env.LOCALHOST as string;
}

export default getBaseUrl;