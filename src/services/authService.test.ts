import { initializeGraphClient } from "./authService";

describe("initializeGraphClient", () => {
  it("should initialize the graph client", async () => {
    const graphClient = await initializeGraphClient();
    expect(graphClient).toBeDefined();
  });
});
