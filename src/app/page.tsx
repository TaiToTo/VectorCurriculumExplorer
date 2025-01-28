"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { getText } from "@/api/weaviate";
import React, { PureComponent } from "react";
import { Treemap } from "recharts";

import { useEffect } from "react";
import { WeaviateField } from "weaviate-client";
import { useState } from "react";


import { TreeData } from "../models/vis-data";


const tree_data: TreeData = [
  {
    name: "axis",
    children: [
      { name: "Axes", size: 1302 },
      { name: "Axis", size: 24593 },
      { name: "AxisGridLine", size: 652 },
      { name: "AxisLabel", size: 636 },
      { name: "CartesianAxes", size: 6703 },
    ],
  },

  {
    name: "controls",
    children: [
      { name: "AnchorControl", size: 2138 },
      { name: "ClickControl", size: 3824 },
      { name: "Control", size: 1353 },
      { name: "ControlList", size: 4665 },
      { name: "DragControl", size: 2649 },
      { name: "ExpandControl", size: 2832 },
      { name: "HoverControl", size: 4896 },
      { name: "IControl", size: 763 },
      { name: "PanZoomControl", size: 5222 },
      { name: "SelectionControl", size: 7862 },
      { name: "TooltipControl", size: 8435 },
    ],
  },

];

const COLORS = [
  "#8889DD",
  "#9597E4",
  "#8DC77B",
  "#A5D297",
  "#E2CF45",
  "#F8C12D",
  "#FF8042",
  "#FFBB28",
  "#FF8042",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

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
                ? colors[Math.floor((index / root.children.length) * 6)]
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
    getText(query).then((data) => setData(data));
  }, []);

  console.log()

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      {/* {data.map((item, i) => (
            <p key={i}>{`${String(item.certainty)}, ${String(item.text)}`}</p>
          ))
      } */}

      <div style={{ margin: '20px', backgroundColor: '#fff', padding: '10px' }}>
        <Treemap
          width={1000}
          height={500}
          data={tree_data}
          dataKey="size"
          nameKey="name"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent colors={COLORS} />}
          isAnimationActive={false}
        />
      </div>
      </main>
    </div>
  );
}
