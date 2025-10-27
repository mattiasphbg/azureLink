import { CosmosClient, ItemDefinition, Resource } from "@azure/cosmos";
import { DefaultAzureCredential, TokenCredential } from "@azure/identity";

const getClient = () => {
  const endpoint = process.env.COSMOS_DB_ENDPOINT_URI;
  const DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME;

  if (!endpoint || !DATABASE_NAME) {
    throw new Error("COSMOS_DB_ENDPOINT_URI or DATABASE_NAME is not set");
  }

  const credential: TokenCredential = new DefaultAzureCredential();

  return new CosmosClient({
    endpoint: endpoint,
    aadCredentials: credential,
  });
};

export const createContainer = async (containerName: string) => {
  const DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME;
  if (!DATABASE_NAME) {
    throw new Error("COSMOS_DB_DATABASE_NAME is not set");
  }

  const client = getClient();

  await client.databases.createIfNotExists({
    id: DATABASE_NAME,
  });

  const { container } = await client
    .database(DATABASE_NAME)
    .containers.createIfNotExists({
      id: containerName,
      partitionKey: "/id",
    });

  return container;
};

export const createItem = async (
  containerName: string,
  item: ItemDefinition
): Promise<ItemDefinition & Resource> => {
  const DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME;
  if (!DATABASE_NAME) {
    throw new Error("COSMOS_DB_DATABASE_NAME is not set");
  }

  const client = getClient();

  const container = await client
    .database(DATABASE_NAME)
    .container(containerName);

  const { resource } = await container.items.create(item);

  if (!resource) {
    throw new Error("Failed to create item");
  }

  return resource;
};
