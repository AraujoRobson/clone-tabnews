test("Other methods to /api/v1/buscaimoveis should return 405", async () => {
  const methods = ["POST", "PUT", "PATCH", "DELETE"];

  for (let method of methods) {
    const response = await fetch(
      "http://localhost:3000/api/v1/buscaimoveis?finalidade=aluguel",
      { method: method },
    );

    expect(response.status).toBe(405);
  }
});
