import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);

    await dbClient.end();

    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrantions = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrantions.length > 0) {
      response.status(201).json(migratedMigrantions);
    }

    response.status(200).json(migratedMigrantions);
  }

  return response.status(405).end();
}
