Understood. Here is the README file based on the current contents and description of your project:

# Treemap Demo

## Overview

This application takes data from a Weaviate database and visualizes its vectors as several charts. It also includes a Retrieval-Augmented Generation (RAG) chatbot function. The primary purpose of this application is to analyze the contents of school curriculums. Currently, the database contains texts from the curriculum of Estonia, with potential extensions to include more countries and regions.

## Features

- **Data Visualization**: Visualizes data from the Weaviate database using various charts.
- **RAG Chatbot**: Includes a chatbot function that leverages retrieval-augmented generation.
- **Curriculum Analysis**: Analyzes the contents of school curriculums, starting with Estonia.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/treemap-demo.git
   cd treemap-demo
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a 

.env

 file in the root directory and add the following variables:
   ```env
   WEAVIATE_URL=your_weaviate_url
   WEAVIATE_API_KEY=your_weaviate_api_key
   COHERE_API_KEY=your_cohere_api_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## Usage

### Data Visualization

The application fetches data from the Weaviate database and visualizes it using Recharts. The data is structured in a tree format and displayed as bar charts.

### RAG Chatbot

The chatbot function uses retrieval-augmented generation to provide responses based on the curriculum data stored in the Weaviate database.

## File Structure

- **`src/app/page.tsx`**: Main page component that renders the charts and handles data fetching on the client side.
- **`src/api/weaviate.ts`**: Contains functions to connect to the Weaviate database and fetch data.
- **`src/models/TreeData.ts`**: Defines the data models used in the application.

## Future Plans

- Extend the curriculum analysis to include more countries and regions.
- Enhance the RAG chatbot functionality.
- Add more visualization options.

## License

This project is licensed under the MIT License. See the LICENSE file for details.