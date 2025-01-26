"use server";

import weaviate from "weaviate-client";

const connectWeaviate = async () =>
  await weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL || "", {
    authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY || ""),
    headers: {
      "X-Cohere-Api-Key": process.env.COHERE_API_KEY || "", // Replace with your inference API key
    },
  });

export const getText = async (query: string) => {
  const client = await connectWeaviate();

  const collections = client.collections.get("CurriculumDemo");
  const response = await collections.query.nearText(query, {
    limit: 5,
  });

  client.close();

  return response.objects.map(({ properties }) => properties.text);
};
