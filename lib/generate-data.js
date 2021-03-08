"use strict";
// import { repeatedly } from "@thi.ng/transducers";
// import faker from "faker";
// import { Quadstore } from "quadstore";
// import {DataFactory as DF} from 'n3';
// const DEFAULT_NOTE_COUNT = 10000;
// const BASE_URL = "http://localhost:3001";
// // const getData = async (path = "") => {
// //   // Default options are marked with *
// //   const response = await fetch(`${BASE_URL}/${path}`, {
// //     method: "GET", // *GET, POST, PUT, DELETE, etc.
// //     // mode: 'cors', // no-cors, *cors, same-origin
// //     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
// //     // credentials: 'same-origin', // include, *same-origin, omit
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });
// //   // TODO should the status be included here?
// //   return response.json(); // parses JSON response into native JavaScript objects
// // };
// const titleCase = (str: string) => {
//   return str
//     .toLowerCase()
//     .split("-")
//     .map(function (word) {
//       return word.charAt(0).toUpperCase() + word.slice(1);
//     })
//     .join("");
// };
// interface Item {
//   type: string,
//   id: string,
//   text: string,
//   dateCreated: Date,
//   dateModified: Date,
// }
// const toQuads = (item: Item) => {
//   // TODO fill this in
//   return [
//   ];
// }
// let number = 0;
// const createRandomItem = async (db: Quadstore) => {
//   const item = {
//     type: "NoteDigitalDocument",
//     id: titleCase(faker.lorem.slug(3)),
//     text: number.toString().padStart(3, "0") + " " + faker.lorem.sentence(20),
//     dateCreated: faker.date.recent(),
//     dateModified: faker.date.recent(),
//   };
//   number++;
//   const quads = toQuads(note);
//   await db.multiPut(quads);
//   return note;
// };
// export const generateNotes = async (db: Quadstore) => {
//   console.log("Generating notes...");
//   for await (const note of repeatedly(() => createRandomItem(db), DEFAULT_NOTE_COUNT)) {
//     console.log(note);
//   }
// };
// generateNotes().catch((e) => {
//   console.error(e.message);
// });
//# sourceMappingURL=generate-data.js.map