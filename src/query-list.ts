import { BindingArrayResult } from "quadstore";
import { setupDb } from "./setup-db";
import { bindingsToTree, time } from "./utils";

const schema = {
  singularizeVariables: {
    "": false,
    id: true,
    text: true,
    name: true,
    dateModified: true,
    author: true,
    author_name: true,
    author_id: true,
  },
};

const runQuery = async () => {
  const db = await setupDb();
  await db.open();

  const res = (await db.sparql(
    `
        SELECT ?id ?text ?dateModified ?name ?author_id ?author_name
        WHERE {
          ?id <ex://type> <ex://type/Item>;
              <ex://date-modified> ?dateModified;
              <ex://text> ?text;
              <ex://name> ?name.
          ?id <ex://author> ?author_id.
          ?author_id <ex://name> ?author_name.
        }
        ORDER BY DESC(?dateModified)
        LIMIT 100
        OFFSET 0
    `
  )) as BindingArrayResult;

  await db.close();

  const parsed = bindingsToTree(res.items, schema);

  return parsed;
};

const run = async () => {
  const res = await time(runQuery);
  console.log(`Time: ${res.time}`);
};

run().catch((e) => {
  console.error(e);
});
