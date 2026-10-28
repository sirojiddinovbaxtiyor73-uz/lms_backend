import { Pool } from "pg";
import { configDotenv } from "dotenv";
configDotenv()

const pool=new Pool({
    user: process.env.PG_NAME,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD
})

export default pool