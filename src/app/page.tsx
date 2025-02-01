"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { queryTexts } from "@/api/weaviate";
import React, { PureComponent } from "react";
import {
  Treemap,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";


import { useEffect } from "react";
import { WeaviateField } from "weaviate-client";
import { useState } from "react";

const subject_color_map ={
  "language_and_literature": "red",
  "foreign_languages": "purple",
  "mathematics": "blue",
  "natural_science": "green",
  "social_studies": "orange",
  "art": "pink",
  "technology": "cyan",
  "physical_education": "yellow",
  "religious_studies": "brown",
  "informatics": "teal",
  "career_education": "magenta",
  "entrepreneurship_studies": "lime"
}

class CustomizedContent extends PureComponent {
  render() {
    const {
      root,
      depth,
      x,
      y,
      width,
      height,
      index,
      payload,
      colors,
      rank,
      name,
    } = this.props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill:
              depth < 2
                ? subject_color_map[name]
                : "#ffffff00",
            stroke: "#fff",
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
          >
            {name}
          </text>
        ) : null}
        {depth === 1 ? (
          <text
            x={x + 4}
            y={y + 18}
            fill="#fff"
            fontSize={16}
            fillOpacity={0.9}
          >
            {index + 1}
          </text>
        ) : null}
        <g
          x={x}
          y={y}
          width={width}
          height={height}
          className={styles.treemap__rect}
        >
          <rect x={x} y={y} width={width} height={height} />
          <text x={x} y={y+height/2} fill="#fff" fontSize={11}>
            {name}
          </text>
        </g>
      </g>
    );
  }
}

export default function App() {

  const query = "Data literacy";

  const [data, setData] = useState<WeaviateField[]>([]);
  useEffect(() => {
    queryTexts(query, sliderValue).then((data) => setData(data));
  }, []);

  const [sliderValue, setSliderValue] = useState<number>(30); // Initial value set to 50


  const [queried_data, tree_data] = data;



  console.log(tree_data);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <input
          type="range"
          min="1"
          max="100"
          value={sliderValue}
          onChange={(e) => {
        const newValue = Number(e.target.value);
        setSliderValue(newValue);
        queryTexts(query, newValue).then((data) => setData(data));
          }}
          style={{ marginBottom: '20px' }}
        />
        {data.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', margin: '20px', backgroundColor: '#fff', padding: '10px' }}>
        <BarChart
          width={500}
          height={500}
          data={queried_data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" width={250} dataKey="text" />
          <Tooltip />
          <Bar dataKey="certainty" unit="kWh">
            {queried_data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={subject_color_map[entry.subject]} />
            ))}
          </Bar>
        </BarChart>
        <Treemap
          width={1000}
          height={500}
          data={tree_data}
          dataKey="size"
          nameKey="name"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
          isAnimationActive={false}
        />
          </div>
        )}
      </main>
    </div>
  );
}
