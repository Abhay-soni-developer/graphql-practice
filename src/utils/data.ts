import type { UserRecords } from "./index.js";

export const USERS: UserRecords = {
  "1": { id: "1", name: "Abhay Soni", email: "abhaysoni.developer@gmail.com" },
  "2": { id: "2", name: "John Doe", email: "johndoe@gmail.com" },
  "3": { id: "3", name: "Rahul", email: null },
  "4": { id: "4", name: "Priya", email: "priya@example.com" },
};

export const UsersCollection = new Map(Object.entries(USERS));

export default UsersCollection;
