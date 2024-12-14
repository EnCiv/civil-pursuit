//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useState, useEffect } from 'react'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import WhyStep from '../app/components/steps/why'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, socketEmitDecorator } from './common'
import DeliberationContext from '../app/components/deliberation-context'

export default {
  component: WhyStep,
  decorators: [onDoneDecorator, socketEmitDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const discussionId = '1001'

const reducedPointList = [
  { _id: 'point1', subject: 'Point 1 Subject', description: 'Point 1 Description', parentId: discussionId },
  { _id: 'point2', subject: 'Point 2 Subject', description: 'Point 2 Description', parentId: discussionId },
]

const myWhyByParentId = {
  point1: {
    _id: 'why1',
    parentId: 'point1',
    subject: 'Existing Subject 1',
    description: 'Existing Description 1',
    category: 'most',
  },
}

const whyStepTemplate = args => {
  const { defaultValue } = args

  const [data, setData] = useState({}) // Data is initially an empty object

  useEffect(() => {
    setData(prevData => ({ ...prevData, ...defaultValue }))
  }, [defaultValue])

  const handleUpsert = newData => {
    setData(prevData => ({ ...prevData, ...newData }))
  }

  useEffect(() => {
    window.socket._socketEmitHandlers = window.socket._socketEmitHandlers || {}

    window.socket._socketEmitHandlers['getUserWhys'] = (ids, cb) => {
      window.socket._socketEmitHandlerResults['getUserWhys'] = ids
      setTimeout(() => {
        const whys = Object.values(myWhyByParentId || {})
        cb(whys)
      }, 1000)
    }

    window.socket._socketEmitHandlers['upsertWhy'] = (delta, cb) => {
      // Retrieve the existing _id
      const existingWhy = myWhyByParentId[delta.parentId]
      const updatedDoc = {
        ...delta,
        _id: existingWhy ? existingWhy._id : 'new_id', // Keep the _id if it exists; otherwise, generate a new one
      }
      window.socket._socketEmitHandlerResults['upsertWhy'] = updatedDoc
      cb && cb(updatedDoc)
    }
  }, [myWhyByParentId])

  return (
    <DeliberationContext.Provider value={{ data, upsert: handleUpsert }}>
      <WhyStep {...args} />
    </DeliberationContext.Provider>
  )
}

const emptyTemplate = args => <WhyStep {...args} />

export const Empty = {
  args: {
    defaultValue: {}, // Data is initially an empty object
    myWhyByParentId: {}, // Simulate server returning no data
  },
  render: emptyTemplate,
  decorators: [],
}

export const InitialNoData = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByParentId: {},
      category: 'most',
      intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    },
    myWhyByParentId: {},
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
}

export const ReturningUser = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByParentId, // Includes the user's previous `why` data
      category: 'most',
      intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    },
    myWhyByParentId,
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
}

export const UserEntersInitialData = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByParentId: {}, // Initially no data
      category: 'most',
      intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    },
    myWhyByParentId: {}, // Simulate server returning no data
    decorators: [DeliberationContextDecorator],
  },
  render: whyStepTemplate,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for two input boxes to render
    await waitFor(() => {
      const subjectInputs = canvas.getAllByPlaceholderText('Type some thing here')
      const descriptionInputs = canvas.getAllByPlaceholderText('Description')
      expect(subjectInputs.length).toBe(2)
      expect(descriptionInputs.length).toBe(2)
    })

    const subjectInputs = canvas.getAllByPlaceholderText('Type some thing here')
    const descriptionInputs = canvas.getAllByPlaceholderText('Description')

    // Enter the first why
    await userEvent.type(subjectInputs[0], 'User Subject 1')
    await userEvent.type(descriptionInputs[0], 'User Description 1')
    await userEvent.tab()

    // Enter the second why
    await userEvent.type(subjectInputs[1], 'User Subject 2')
    await userEvent.type(descriptionInputs[1], 'User Description 2')
    await userEvent.tab()

    // Wait for onDoneDecorator to show the result
    await waitFor(() => {
      const result = onDoneResult()
      expect(result.count).toBe(4)
      expect(result.onDoneResult).toMatchObject({
        valid: true,
        value: [
          {
            subject: 'User Subject 1',
            description: 'User Description 1',
            parentId: 'point1',
            category: 'most',
          },
          {
            subject: 'User Subject 2',
            description: 'User Description 2',
            parentId: 'point2',
            category: 'most',
          },
        ],
      })
    })
  },
}

export const UserUpdatesExistingData = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByParentId,
      category: 'most',
      intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    },
    myWhyByParentId,
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() => {
      expect(canvas.getByText("Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it")).toBeInTheDocument()
    })

    const subjectInputs = canvas.getAllByDisplayValue('Existing Subject 1')
    const descriptionInputs = canvas.getAllByDisplayValue('Existing Description 1')

    await userEvent.clear(subjectInputs[0])
    await userEvent.type(subjectInputs[0], 'Updated Subject 1')
    await userEvent.clear(descriptionInputs[0])
    await userEvent.type(descriptionInputs[0], 'Updated Description 1')

    await userEvent.tab()

    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['upsertWhy']).toMatchObject({
        _id: 'why1',
        subject: 'Updated Subject 1',
        description: 'Updated Description 1',
        parentId: 'point1',
        category: 'most',
      })
    })

    await waitFor(() => {
      const result = onDoneResult()
      expect(result.onDoneResult).toMatchObject({
        valid: false,
        value: {
          subject: 'Updated Subject 1',
          description: 'Updated Description 1',
          parentId: 'point1',
          category: 'most',
        },
      })
    })
  },
}
