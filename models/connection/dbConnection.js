import { createClient } from "@libsql/client";

export const turso = createClient({
  url: "libsql://vehicle-insurance-yolbert28.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAA",
});