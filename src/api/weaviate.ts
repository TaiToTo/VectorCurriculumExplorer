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
    limit: 30,
    returnMetadata: ['certainty']
  });

  client.close();

  const queried_data = response.objects.map(item  => ({
    subject: item.properties.subject,
    paragraph_idx: item.properties.paragraph_idx, 
    text: item.properties.text,
    certainty: item.metadata.certainty
  }));

  // Aggregate into a list of dictionaries
  const tree_data = Object.values(
    queried_data.reduce((acc, item) => {
      if (!acc[item.subject]) {
        // If the name doesn't exist, initialize it with an empty list
        acc[item.subject] = { name: item.subject, children: [] };
      }
    acc[item.subject].children.push({ name: item.text, size: item.certainty }); // Add the item to the children list
    return acc;
    }, {} as Record<string, { name: string; children: { name: string; size: number }[] }>)
  );


  return [queried_data, tree_data];
};




