// src/db/client.ts
import { createClient } from "@libsql/client";

const client = createClient({
  url: import.meta.env.DATABASE_URL ?? "",
  authToken: import.meta.env.DATABASE_TOKEN ?? "",
});


export const addUser = async (name: string, email: string, phone: number) => {
  try {
    await client.execute({
      sql: "INSERT INTO Usuarios (name, email, phone) VALUES (?, ?, ?)",
      args: [name, email, phone],
    });
  } catch (error) {
    console.error("Database error:", error);
    throw error; // Reenvía el error para que se muestre en el cliente
  }
};
