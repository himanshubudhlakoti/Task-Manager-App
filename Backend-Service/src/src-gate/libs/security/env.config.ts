import * as path from "path";
import * as dotenv from "dotenv";
import { TEnvObj } from "src/src-gate/libs/types";

//for dev use this---------------------------
export const envFile = ".dev.env";
//for prod use this--------------------------
// export const envFile = ".prod.env";

dotenv.config({ path: path.normalize(`./environments/${envFile}`) });
const envObj: TEnvObj = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    SERVER_PORT: process.env.SERVER_PORT,
    //Tokens details
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    //S3 details
    
    //Client side details
    CLIENT_USER_DOMAIN: process.env.CLIENT_USER_DOMAIN,
    //Database
    DATABASE_FULL_CONNECTION_STRING: process.env.DATABASE_FULL_CONNECTION_STRING,
};
export default envObj;