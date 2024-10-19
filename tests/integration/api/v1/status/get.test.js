test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);
});

test("GET to /api/v1/status should return update_at formated as ISO", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toBe(parsedUpdatedAt);
});

test("GET to /api/v1/status should return postgres version", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(responseBody.dependencies.database.version).toBe("16.0");
});

test("GET to /api/v1/status should return the number of max connections", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(responseBody.dependencies.database.max_connections).toBe(100);
});

test("GET to /api/v1/status should return the number of opened connections", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
});
