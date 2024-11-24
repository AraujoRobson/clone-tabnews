import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("POST to /api/v1/migration should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response1.status).toBe(201);

  const responseBody = await response1.json();

  const migration = await database.query("select count(*) from pgmigrations ");

  expect(responseBody.length).toBeGreaterThan(0);
  expect(migration.rowCount).toBe(1);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  const migration2 = await database.query("select count(*) from pgmigrations ");

  expect(response2Body.length).toBe(0);
  expect(migration2.rowCount).toBe(1);
});
