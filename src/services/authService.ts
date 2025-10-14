import { ClientSecretCredential } from "@azure/identity";
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
} from "@microsoft/microsoft-graph-client";

let graphClient: Client | null = null;

const initializeGraphClient = async () => {
  if (
    !process.env.AZURE_TENANT_ID ||
    !process.env.AZURE_CLIENT_ID ||
    !process.env.AZURE_CLIENT_SECRET
  ) {
    throw new Error("Azure credentials are not set");
  }
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
  );

  const authProvider: AuthenticationProvider = {
    getAccessToken: async (options?: AuthenticationProviderOptions) => {
      // Use default scopes if no options are provided
      const scopes = options?.scopes ?? [
        "https://graph.microsoft.com/.default",
      ];

      try {
        const tokenResponse = await credential.getToken(scopes);
        return tokenResponse.token;
      } catch (error) {
        console.error("Failed to get access token:", error);
        throw error;
      }
    },
  };
  const graphClient = Client.initWithMiddleware({ authProvider: authProvider });
  return graphClient;
};
