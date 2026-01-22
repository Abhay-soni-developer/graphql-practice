import { buildSchema } from "graphql";
import { readFileSync } from "node:fs";
import type { Employee } from "../modules/employee/type.js";

export const baseSchema = readFileSync(
  new URL("./base.schema.graphql", import.meta.url),
  "utf-8",
);
export const productSchema = readFileSync(
  new URL("./../modules/product/product.schema.graphql", import.meta.url),
  "utf-8",
);
export const employeeSchema = readFileSync(
  new URL("./../modules/employee/employee.schema.graphql", import.meta.url),
  "utf-8",
);

export const modularSchema = buildSchema(
  [baseSchema, productSchema, employeeSchema].join("\n"),
);
export const modularRootValue = {
  //mocking
  createEmployee({ employeeData }: { employeeData: Omit<Employee, "id"> }) {
    console.log(employeeData);
    return { id: "12", ...employeeData };
  },
};
