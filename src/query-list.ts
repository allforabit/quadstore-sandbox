import { BindingArrayResult } from "quadstore";
import { setupDb } from "./setup-db";
import { bindingsToTree, time } from "./utils";
import { table } from "table";

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

const queries = {
  withOptional: `
        SELECT ?id ?text ?dateModified ?name ?author_id ?author_name
        WHERE {
          ?id <ex://type> <ex://type/Item>;
              <ex://date-modified> ?dateModified;
              <ex://text> ?text;
              <ex://name> ?name.
          OPTIONAL {
            ?id <ex://author> ?author_id.
            ?author_id <ex://name> ?author_name.
          }
        }
        ORDER BY DESC(?dateModified)
        LIMIT 100
        OFFSET 0
    `,
  withoutOptional: `
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
  `,
  unorderedNoDate: `
    SELECT ?id ?text ?name ?author_id ?author_name
    WHERE {
      ?id <ex://type> <ex://type/Item>;
          <ex://text> ?text;
          <ex://name> ?name.
      ?id <ex://author> ?author_id.
      ?author_id <ex://name> ?author_name.
    }
  `,
  noAuthor: `
    SELECT ?id ?text ?name
    WHERE {
      ?id <ex://type> <ex://type/Item>;
          <ex://text> ?text;
          <ex://name> ?name.
    }
    ORDER BY DESC(?dateModified)
    LIMIT 100
    OFFSET 0
  `,
  dateTimestamp: `
    SELECT ?id ?text ?dateModified ?name ?author_id ?author_name
    WHERE {
      ?id <ex://type> <ex://type/Item>;
          <ex://date-modified-timestamp> ?dateModified;
          <ex://text> ?text;
          <ex://name> ?name.
      OPTIONAL {
        ?id <ex://author> ?author_id.
        ?author_id <ex://name> ?author_name.
      }
    }
  `,
};

const createQueryRunner = (query: string) => async () => {
  const db = await setupDb();
  await db.open();
  const res = (await db.sparql(query)) as BindingArrayResult;
  await db.close();
  const parsed = bindingsToTree(res.items, schema);
  return parsed;
};

const run = async () => {
  try {
    // const withOptional = await time(createQueryRunner(queries.withOptional));
    // const withoutOptional = await time(
    //   createQueryRunner(queries.withoutOptional)
    // );
    // const unorderedNoDate = await time(
    //   createQueryRunner(queries.unorderedNoDate)
    // );
    // const noAuthor = await time(createQueryRunner(queries.noAuthor));
    const dateTimestamp = await time(createQueryRunner(queries.dateTimestamp));
    console.log(dateTimestamp.value.length);
    console.log(dateTimestamp.time);

    return dateTimestamp;

    // console.log(
    //   table([
    //     ["With optional", withOptional.time],
    //     ["Without optional", withoutOptional.time],
    //     ["Unordered and no date", unorderedNoDate.time],
    //     ["Simple (no linked author)", noAuthor.time],
    //   ])
    // );
  } catch (e) {
    console.log(e);
  }
  // console.log(`Time: ${res.time}`);
};

run().catch((e) => {
  console.error(e);
});
