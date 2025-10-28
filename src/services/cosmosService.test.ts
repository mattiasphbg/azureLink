import { createContainer, createItem } from "./cosmosService";
import type { ItemDefinition, Resource } from "@azure/cosmos";

jest.mock("@azure/cosmos", () => ({
  CosmosClient: jest.fn(),
}));

jest.mock("@azure/identity", () => ({
  DefaultAzureCredential: jest.fn(),
}));

import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

const MockCosmosClient = CosmosClient as jest.MockedClass<typeof CosmosClient>;
const MockDefaultAzureCredential = DefaultAzureCredential as jest.MockedClass<
  typeof DefaultAzureCredential
>;

describe("cosmosService", () => {
  let mockCosmosClient: any;
  let mockContainer: any;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.COSMOS_DB_ENDPOINT_URI =
      "https://test.documents.azure.com:443/";
    process.env.COSMOS_DB_DATABASE_NAME = "test-db";

    mockContainer = {
      items: {
        create: jest.fn(),
      },
    };

    mockCosmosClient = {
      databases: {
        createIfNotExists: jest.fn().mockResolvedValue({}),
      },
      database: jest.fn().mockReturnValue({
        containers: {
          createIfNotExists: jest.fn().mockResolvedValue({
            container: mockContainer,
          }),
        },
        container: jest.fn().mockReturnValue(mockContainer),
      }),
    };

    MockDefaultAzureCredential.mockImplementation(() => ({} as any));
    MockCosmosClient.mockImplementation(() => mockCosmosClient);
  });

  describe("createContainer", () => {
    it("should create a container if it does not exist", async () => {
      const containerName = "test-container";

      const result = await createContainer(containerName);

      expect(MockCosmosClient).toHaveBeenCalledWith({
        endpoint: "https://test.documents.azure.com:443/",
        aadCredentials: expect.any(Object),
      });

      expect(mockCosmosClient.databases.createIfNotExists).toHaveBeenCalledWith(
        {
          id: "test-db",
        }
      );

      expect(result).toBeDefined();
    });

    it("should throw error if DATABASE_NAME is not set", async () => {
      delete process.env.COSMOS_DB_DATABASE_NAME;

      await expect(createContainer("test")).rejects.toThrow(
        "COSMOS_DB_DATABASE_NAME is not set"
      );
    });
  });

  describe("createItem", () => {
    it("should create an item in the container", async () => {
      const testItem: ItemDefinition = { id: "123", name: "Test Item" };
      const mockResource: ItemDefinition & Resource = {
        id: "123",
        name: "Test Item",
        _rid: "abc",
        _self: "dbs/test-db/colls/test-container/docs/abc",
        _etag: "test-etag",
        _attachments: "attachments/",
        _ts: Date.now() / 1000,
      };

      mockContainer.items.create.mockResolvedValue({
        resource: mockResource,
      });

      const result = await createItem("test-container", testItem);

      expect(result).toEqual(mockResource);
      expect(mockContainer.items.create).toHaveBeenCalledWith(testItem);
    });

    it("should throw error if item creation fails", async () => {
      const testItem: ItemDefinition = { id: "123" };

      mockContainer.items.create.mockResolvedValue({
        resource: null,
      });

      await expect(createItem("test-container", testItem)).rejects.toThrow(
        "Failed to create item"
      );
    });

    it("should throw error if DATABASE_NAME is not set", async () => {
      delete process.env.COSMOS_DB_DATABASE_NAME;

      await expect(createItem("test", { id: "123" })).rejects.toThrow(
        "COSMOS_DB_DATABASE_NAME is not set"
      );
    });
  });
});
