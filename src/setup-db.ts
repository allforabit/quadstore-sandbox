import LevelDOWN from "leveldown";
import { DataFactory } from "n3";
import { Quadstore } from "quadstore";
import { newEngine } from "quadstore-comunica";

/**
 * Setup the quadstore db
 */
export const setupDb = async () => {
  const store = new Quadstore({
    backend: LevelDOWN("./db"),
    comunica: newEngine(),
    dataFactory: DataFactory,
  });
  return store;
};
