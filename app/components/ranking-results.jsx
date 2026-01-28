// https://github.com/EnCiv/civil-pursuit/issue/81
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts'

export default function RankingResults(props) {
  const { resultList, className, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)

  // Check if resultList is empty and set default data if so
  const isEmpty = Object.keys(resultList).length === 0
  const defaultData = [
    { name: 'Most', percentage: 0 },
    { name: 'Neutral', percentage: 0 },
    { name: 'Least', percentage: 0 },
  ]

  // Calculate the total sum of all values
  const total = Object.values(resultList).reduce((sum, value) => sum + value, 0)

  const dataArray =
    isEmpty || total === 0
      ? defaultData
      : Object.keys(resultList).map(key => ({
          name: key, // This will be "Most", "Neutral", or "Least"
          percentage: ((resultList[key] / total) * 100).toFixed(2), // This is the corresponding percentage value
        }))

  // Calculate the maximum percentage value ceiling in your dataArray
  const maxPercentage = Math.ceil(Math.max(...dataArray.map(item => item.percentage)))

  return (
    <div className={cx(classes.wrapper, className)} {...props}>
      <ResponsiveContainer width="100%" height="100%" className={cx(classes.wrapper, className)} {...props}>
        <BarChart data={dataArray} width="100%" height="100%" layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={tick => `${tick}%`} domain={[0, dataMax => Math.max(dataMax, maxPercentage)]} />
          <YAxis type="category" dataKey="name" className={cx(classes.yAxisFont)} />
          {/*cursor={{fill: 'transparent'}} to disable hover effect*/}
          <Tooltip />
          <Bar dataKey="percentage" maxBarSize={25}>
            {dataArray.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#038a47" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    height: '20rem',
  },
  yAxisFont: {
    fontWeight: 'bold',
  },
}))
