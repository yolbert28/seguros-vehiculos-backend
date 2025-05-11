import { createClient } from "@libsql/client";

export const turso = createClient({
  url: "libsql://vehicle-insurance-yolbert28.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY5ODgxNTcsImlkIjoiMmUzYzdkMDQtOGNjYy00MzliLTgzY2UtYzNiZTQ0Nzc1NWUzIiwicmlkIjoiZDY3ZjIxMWEtMDBjYi00NmU1LWFjNGItZTFmNThmZTY5MWIxIn0.DzZwJFWw02Abbb7SQ3GMcpWTZ0vehIerh8R4vY03dWlgun0Z5yJCWV_PfcRf5kfPA3Ywz4F6LCACHwKCX36ODw",
});