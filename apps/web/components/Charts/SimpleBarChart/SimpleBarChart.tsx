import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  CustomizedAxisTick,
  RenderLegend,
  COLORS,
  CustomTooltip,
  YAxisLabel,
} from '../sharedChartComponents'
import { Box } from '@island.is/island-ui/core'

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
}
interface GraphProps {
  graphData: GraphDataProps
}
export const SimpleBarChart = ({ graphData }: GraphProps) => {
  const { data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)
  const stackIds = parsedDatakeys.bars.map((e) => e.stackId)
  const shouldStack = new Set(stackIds).size !== stackIds.length
  return (
    <Box width="full" height="full">
      <YAxisLabel label={parsedDatakeys.yAxis?.label} />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={20}
          height={150}
          data={parsedData}
          margin={{
            top: 30,
            right: 0,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="0"
            vertical={false}
            stroke="#CCDFFF"
          />
          <XAxis
            dataKey={parsedDatakeys.xAxis}
            stroke="#CCDFFF"
            tick={<CustomizedAxisTick />}
            padding={{ left: 30 }}
            tickLine={false}
          />
          <YAxis stroke="#CCDFFF" tick={<CustomizedAxisTick />} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" align="right" content={RenderLegend} />
          {parsedDatakeys.bars.map((item, index) => (
            <Bar
              key={index}
              dataKey={item.datakey}
              fill={item.color ? item.color : COLORS[index % COLORS.length]}
              stackId={item.stackId}
              barSize={16}
              radius={
                index === parsedDatakeys.bars.length - 1 || !shouldStack
                  ? [20, 20, 0, 0]
                  : 0
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default SimpleBarChart
