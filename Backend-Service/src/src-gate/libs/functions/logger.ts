const logger = require('logger').createLogger('./public/logger/development.log');

export default function setLog(err: any, path: string): boolean {
    logger.info(`${path} ------> ${err ? (JSON.stringify(err)) : "Not able to get"}`);
    return true;
}

