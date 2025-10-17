import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential, TokenCredential } from "@azure/identity";

const credential: TokenCredential = new DefaultAzureCredential();
const endpoint = process.env.COSMOS_DB_ENDPOINT_URI;
const DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME;

if (!endpoint || !DATABASE_NAME) {
  throw new Error("COSMOS_DB_ENDPOINT_URI is not set");
}

const client = new CosmosClient({
  endpoint: endpoint,
  aadCredentials: credential,
});
