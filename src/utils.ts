import { Term } from "rdf-js";
import { Converter } from "sparqljson-to-tree";

export const time = async <T>(
  fn: () => Promise<T>
): Promise<{ time: number; value: T }> => {
  const start = Date.now();
  const value = await fn();
  return { time: Date.now() - start, value };
};

const converter = new Converter({
  materializeRdfJsTerms: true,
});

export const bindingsToTree = (bindings: any[], schema: any) => {
  const bindingsArray = [];

  for (const binding of bindings) {
    // const binding_ = binding as any;
    // const rawBindings = binding_.toJS();
    const reKeyedBindings: Record<string, Term> = {};
    // Removes the '?' prefix
    for (const key in binding) {
      reKeyedBindings[key.slice(1)] = binding[key];
    }
    bindingsArray.push(reKeyedBindings);
  }
  return converter.bindingsToTree(bindingsArray, schema);
};
