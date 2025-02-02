"use server";

import weaviate from "weaviate-client";

const connectWeaviate = async () =>
  await weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL || "", {
    authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY || ""),
    headers: {
      "X-Cohere-Api-Key": process.env.COHERE_API_KEY || "", // Replace with your inference API key
    },
  });

export const queryTexts = async (query: string, num_text_queried: number) => {
  const client = await connectWeaviate();

  const collections = client.collections.get("CurriculumDemo");
  const response = await collections.query.nearText(query, {
    limit: num_text_queried,
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






export const executeRAG = async (prompt: string, num_text_queried: number) => {
  const client = await connectWeaviate();

  const collections = client.collections.get("CurriculumDemo");
  const response = await collections.generate.nearText(prompt, 
    {
      groupedTask: prompt,
    },
    {
      limit: 3,
      returnMetadata: ['certainty']
    }
  );

  client.close();

  const generated_answer = response.generated;
  
  const rag_queried_data = response.objects.map(item  => ({
    subject: item.properties.subject,
    paragraph_idx: item.properties.paragraph_idx, 
    text: item.properties.text,
    certainty: item.metadata.certainty
  }));

  // Aggregate into a list of dictionaries
  const rag_tree_data = Object.values(
    rag_queried_data.reduce((acc, item) => {
      if (!acc[item.subject]) {
        // If the name doesn't exist, initialize it with an empty list
        acc[item.subject] = { name: item.subject, children: [] };
      }
    acc[item.subject].children.push({ name: item.text, size: item.certainty }); // Add the item to the children list
    return acc;
    }, {} as Record<string, { name: string; children: { name: string; size: number }[] }>)
  );

  console.log(generated_answer);
  console.log(rag_tree_data);

  return [generated_answer, rag_tree_data];
};
