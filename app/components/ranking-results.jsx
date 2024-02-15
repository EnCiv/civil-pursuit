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
    { name: 'Most', value: 0 },
    { name: 'Neutral', value: 0 },
    { name: 'Least', value: 0 },
  ]

  const dataArray = isEmpty
    ? defaultData
    : Object.keys(resultList).map(key => ({
        name: key, // This will be "Most", "Neutral", or "Least"
        value: resultList[key], // This is the corresponding number value
      }))

  return (
    <div className={cx(classes.wrapper, className)} {...props}>
      <ResponsiveContainer width="100%" height="100%" className={cx(classes.wrapper, className)} {...props}>
        <BarChart data={dataArray} width="100%" height="100%" layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" className={cx(classes.yAxisFont)} />
          <Tooltip />
          <Bar dataKey="value" maxBarSize={25}>
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
    height: '50vh',
    background: theme.colorPrimary,
  },
  yAxisFont: {
    fontWeight: 'bold',
  },
}))
