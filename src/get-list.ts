import { setupDb } from "./setup-db";
import { time } from "./utils";
import { DataFactory as DF } from "n3";

const runGet = async () => {
  const db = await setupDb();
  await db.open();

  const res = await db.get(
    {
      predicate: DF.namedNode("ex://date-modified"),
    },
    {
      offset: 0,
      limit: 10,
    }
  );

  await db.close();

  return res;
};

const run = async () => {
  const res = await time(runGet);
  console.log(`Time: ${res.time}`);
};

run().catch((e) => {
  console.error(e);
});
