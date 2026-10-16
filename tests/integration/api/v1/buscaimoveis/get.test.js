test("GET to /api/v1/buscaimoveis without finalidade should return 400", async () => {
  const response = await fetch("http://localhost:3000/api/v1/buscaimoveis");

  expect(response.status).toBe(400);
});

test("GET to /api/v1/buscaimoveis with an invalid finalidade should return 400", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/buscaimoveis?finalidade=permuta",
  );

  expect(response.status).toBe(400);
});
