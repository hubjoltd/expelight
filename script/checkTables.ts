import { db } from "../server/db";
import { sql } from "drizzle-orm";
async function main() {
  const result = await db.execute(sql\`SELECT tablename FROM pg_tables WHERE schemaname = 'public'\`);
  console.log(JSON.stringify(result.rows));
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
