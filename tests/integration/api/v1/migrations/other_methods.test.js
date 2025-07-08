import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("Other methods to /api/v1/migration should return 405", async () => {
  const methods = ["PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

  for (let i = 0; i < 2; i++) {
    for (let method of methods) {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: method,
      });

      expect(response.status).toBe(405);
    }
  }
});

test("Should contain only one opened connections", async () => {
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  expect(databaseOpenedConnectionsResult.rows[0].count).toBe(1);
});
