import { repeatedly } from "@thi.ng/transducers";
import faker from "faker";
import { DataFactory as DF } from "n3";
import { Quadstore } from "quadstore";
import { setupDb } from "./setup-db";

const ITEM_COUNT = 100;

const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split("-")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
};

interface Author {
  type: "Author";
  id: string;
  name: string;
}

interface Item {
  type: string;
  id: string;
  text: string;
  name: string;
  dateModified: Date;
  author: Author;
}

const authors: Author[] = [
  {
    type: "Author",
    id: "1111",
    name: "John",
  },
  {
    type: "Author",
    id: "2222",
    name: "Ben",
  },
  {
    type: "Author",
    id: "3333",
    name: "Mary",
  },
  {
    type: "Author",
    id: "4444",
    name: "June",
  },
];

const itemToQuads = (item: Item) => {
  const subject = DF.namedNode(`ex://item/${item.id}`);
  return [
    DF.quad(
      subject,
      DF.namedNode("ex://type"),
      DF.namedNode(`ex://type/${item.type}`)
    ),
    DF.quad(subject, DF.namedNode("ex://text"), DF.literal(item.text)),
    DF.quad(subject, DF.namedNode("ex://name"), DF.literal(item.name)),
    DF.quad(
      subject,
      DF.namedNode("ex://date-modified"),
      DF.literal(
        item.dateModified.toISOString(),
        DF.namedNode("http://www.w3.org/2001/XMLSchema#dateTime")
      )
    ),
    DF.quad(
      subject,
      DF.namedNode("ex://date-modified-timestamp"),
      DF.literal(item.dateModified.getTime())
    ),
    // Link to author
    DF.quad(
      subject,
      DF.namedNode("ex://author"),
      DF.namedNode(`ex://author/${item.author.id}`)
    ),
  ];
};

const authorToQuads = (author: Author) => {
  const subject = DF.namedNode(`ex://author/${author.id}`);
  return [
    DF.quad(
      subject,
      DF.namedNode("ex://type"),
      DF.namedNode(`ex://type/${author.type}`)
    ),
    DF.quad(subject, DF.namedNode("ex://name"), DF.literal(author.name)),
  ];
};

let number = 0;

const createRandomItem = async (db: Quadstore) => {
  const item: Item = {
    type: "Item",
    id: titleCase(faker.lorem.slug(3)),
    text: number.toString().padStart(3, "0") + " " + faker.lorem.sentence(20),
    name: faker.lorem.sentence(3),
    dateModified: faker.date.recent(),
    author: authors[Math.floor(Math.random() * authors.length)],
  };

  number++;

  const quads = itemToQuads(item);
  await db.multiPut(quads);
  return item;
};

const addAuthor = async (db: Quadstore, author: Author) => {
  const quads = authorToQuads(author);
  db.multiPut(quads);
};

const addAuthors = async (db: Quadstore) => {
  for await (const _item of authors.map((author) => addAuthor(db, author))) {
  }
};

export const generateItems = async (db: Quadstore) => {
  for await (const item of repeatedly(() => createRandomItem(db), ITEM_COUNT)) {
    console.log(item);
  }
};

const run = async () => {
  const db = await setupDb();
  await db.open();
  // Generate items
  await addAuthors(db);
  await generateItems(db);
  await db.close();
};

run();
