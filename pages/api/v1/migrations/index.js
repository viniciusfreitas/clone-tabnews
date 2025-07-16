import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: "true",
    migrationsTable: "migrationsTable",
  }

  if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      await dbClient.end();
      response.status(200).send(pendingMigrations);
  }

  if (request.method === "POST") {
      const migrateMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      await dbClient.end();

      if (migrateMigrations.length > 0) {
        response.status(201).send(migrateMigrations);    
      }
    
    response.status(200).send(migrateMigrations);
  }

  response.status(405).end();

}