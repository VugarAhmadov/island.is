import React from 'react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts'
import {
  CustomizedAxisTick,
  RenderLegend,
  COLORS,
  CustomTooltip,
  CustomizedRightAxisTick,
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

export const MixedChart = ({ graphData }: GraphProps) => {
  const { data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)[0]
  const stackIds = parsedDatakeys.bars.map((e) => e.stackId)
  const shouldStack = new Set(stackIds).size !== stackIds.length
  const rightPadding = parsedDatakeys.yAxis?.right ? 70 : 0
  return (
    <Box width="full" height="full">
      <YAxisLabel
        rightPadding={rightPadding}
        label={parsedDatakeys.yAxis?.label}
        labelRight={parsedDatakeys.yAxis?.labelRight}
      />
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={250}
          height={150}
          data={parsedData}
          margin={{
            top: 30,
            right: rightPadding,
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
          <YAxis
            yAxisId="left"
            stroke="#CCDFFF"
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#CCDFFF"
            tick={<CustomizedRightAxisTick />}
            hide={!parsedDatakeys.yAxis?.showRight}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" align="right" content={RenderLegend} />
          {parsedDatakeys.bars.map((item, index) => (
            <Bar
              key={index}
              dataKey={item.datakey}
              fill={item.color}
              stackId={item.stackId}
              barSize={16}
              yAxisId="left"
              radius={
                index === parsedDatakeys.bars.length - 1 || !shouldStack
                  ? [20, 20, 0, 0]
                  : 0
              }
            />
          ))}
          {parsedDatakeys.lines.map((item, index) => (
            <Line
              key={item.datakey}
              dataKey={item.datakey}
              stroke={item.color ? item.color : COLORS[index % COLORS.length]}
              yAxisId={parsedDatakeys.yAxis?.right ? 'right' : 'left'}
              strokeWidth={3}
              dot={{ r: 6, strokeWidth: 3 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default MixedChart
