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
    ORDER BY ?dateModified
    LIMIT 100
    OFFSET 0
  `,
  orderByName: `
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
    ORDER BY ?name
    LIMIT 100
    OFFSET 0
  `,
  count: `
    SELECT (COUNT(?s) AS ?s)
    WHERE {
      ?s ?p ?o
    }
  `,
};

const createQueryRunner = (query: string) => async () => {
  const db = await setupDb();
  await db.open();
  const res = (await db.sparql(query)) as BindingArrayResult;
  await db.close();
  return res.items;
};

const run = async () => {
  try {
    const withOptional = await time(createQueryRunner(queries.withOptional));
    const withoutOptional = await time(
      createQueryRunner(queries.withoutOptional)
    );
    const noAuthor = await time(createQueryRunner(queries.noAuthor));
    const dateTimestamp = await time(createQueryRunner(queries.dateTimestamp));
    const orderByName = await time(createQueryRunner(queries.orderByName));
    const count = await time(createQueryRunner(queries.count));
    // @ts-ignore
    console.log(`Count: ${count.value[0]["?s"].value}`);
    // console.log(dateTimestamp.time);

    console.log(
      table([
        ["With optional", withOptional.time],
        ["Without optional", withoutOptional.time],
        ["Date timestamp", dateTimestamp.time],
        ["Order by name", orderByName.time],
        ["Simple (no linked author)", noAuthor.time],
      ])
    );
  } catch (e) {
    console.log(e);
  }
  // console.log(`Time: ${res.time}`);
};

run().catch((e) => {
  console.error(e);
});
