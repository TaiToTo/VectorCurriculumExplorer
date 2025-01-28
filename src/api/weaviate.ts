"use server";

import weaviate from "weaviate-client";
import { TreeData } from "../models/vis-data";

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
    returnMetadata: ['certainty']
  });

  client.close();

  const text_tree = response.objects.map(item  => ({
    text: item.properties.text,
    paragraph_idx: item.properties.paragraph_idx, 
    certainty: item.metadata.certainty
  }));

  return text_tree;
};




