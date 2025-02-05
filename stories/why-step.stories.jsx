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

const reducedPointList = [
  { point: { _id: '60b8d295f1c8ab1d2f4a1c01', subject: 'Point 1 Subject', description: 'Point 1 Description', parentId: '60b8d295f1c8ab1d2f4a1c05' } },
  { point: { _id: '60b8d295f1c8ab1d2f4a1c02', subject: 'Point 2 Subject', description: 'Point 2 Description', parentId: '60b8d295f1c8ab1d2f4a1c05' } },
]

const preRankByParentId = {
  '60b8d295f1c8ab1d2f4a1c01': { category: 'most' },
  '60b8d295f1c8ab1d2f4a1c02': { category: 'most' },
}

const myWhyByParentId = {
  '60b8d295f1c8ab1d2f4a1c01': {
    _id: '60b8d295f1c8ab1d2f4a1c03',
    parentId: '60b8d295f1c8ab1d2f4a1c01',
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
    window.socket._socketEmitHandlers['get-user-whys'] = (ids, cb) => {
      window.socket._socketEmitHandlerResults['get-user-whys'] = ids
      setTimeout(() => {
        const whys = Object.values(args.myWhyByParentId || {})
        cb(whys)
      }, 1000)
    }

    function generateObjectId() {
      return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    window.socket._socketEmitHandlers['upsertWhy'] = (delta, cb) => {
      // Retrieve the existing _id
      const existingWhy = args.myWhyByParentId[delta.parentId]
      const updatedDoc = {
        ...delta,
        _id: existingWhy ? existingWhy._id : generateObjectId(), // Keep the _id if it exists; otherwise, generate a new one
      }
      window.socket._socketEmitHandlerResults['upsertWhy'] = updatedDoc
      cb && cb(updatedDoc)
    }
  }, [args.myWhyByParentId])

  return (
    <DeliberationContext.Provider value={{ data, upsert: handleUpsert }}>
      <WhyStep {...args} />
    </DeliberationContext.Provider>
  )
}

const emptyTemplate = args => <WhyStep {...args} />

export const Empty = {
  args: {
    defaultValue: {},
    myWhyByParentId: {},
  },
  render: emptyTemplate,
  decorators: [],
}

export const InitialNoData = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByParentId: {},
      preRankByParentId: preRankByParentId,
    },
    category: 'most',
    myWhyByParentId: {},
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
}

export const ReturningUser = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByParentId,
      preRankByParentId: preRankByParentId,
    },
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",

    myWhyByParentId,
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
}

export const UserEntersInitialData = {
  args: {
    defaultValue: {
      reducedPointList,
      preRankByParentId: preRankByParentId,
      myWhyByParentId: {},
    },
    category: 'most',
    myWhyByParentId: {},
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    decorators: [DeliberationContextDecorator],
  },
  render: whyStepTemplate,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() => {
      const subjectInputs = canvas.getAllByPlaceholderText('Type some thing here')
      const descriptionInputs = canvas.getAllByPlaceholderText('Description')
      expect(subjectInputs.length).toBe(2)
      expect(descriptionInputs.length).toBe(2)
    })

    const subjectInputs = canvas.getAllByPlaceholderText('Type some thing here')
    const descriptionInputs = canvas.getAllByPlaceholderText('Description')

    await userEvent.type(subjectInputs[0], 'User Subject 1')
    await userEvent.type(descriptionInputs[0], 'User Description 1')
    await userEvent.tab()

    await userEvent.type(subjectInputs[1], 'User Subject 2')
    await userEvent.type(descriptionInputs[1], 'User Description 2')
    await userEvent.tab()

    await waitFor(() => {
      const result = onDoneResult()
      expect(result.count).toBe(4)
      expect(result.onDoneResult).toMatchObject({
        valid: true,
        value: [
          {
            subject: 'User Subject 1',
            description: 'User Description 1',
            parentId: '60b8d295f1c8ab1d2f4a1c01',
          },
          {
            subject: 'User Subject 2',
            description: 'User Description 2',
            parentId: '60b8d295f1c8ab1d2f4a1c02',
          },
        ],
      })
    })
  },
}

export const UserUpdatesExistingData = {
  args: {
    defaultValue: {
      reducedPointList: reducedPointList,
      myWhyByParentId: myWhyByParentId,
      preRankByParentId: preRankByParentId,
    },
    myWhyByParentId: myWhyByParentId,
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(() => {
      expect(canvas.getByText(/Of the issues you thought were Most important/i)).toBeInTheDocument()
    })

    await waitFor(
      () => {
        expect(canvas.getAllByDisplayValue('Existing Subject 1').length).toBeGreaterThan(0)
        expect(canvas.getAllByDisplayValue('Existing Description 1').length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    const subjectInputs = canvas.getAllByDisplayValue('Existing Subject 1')
    const descriptionInputs = canvas.getAllByDisplayValue('Existing Description 1')

    await userEvent.click(subjectInputs[0])
    for (let i = 0; i < 19; i++) {
      await userEvent.keyboard('{Backspace}')
    }

    await userEvent.type(subjectInputs[0], 'Updated Subject 1')

    await userEvent.click(descriptionInputs[0])
    for (let i = 0; i < 22; i++) {
      await userEvent.keyboard('{Backspace}')
    }

    await userEvent.type(descriptionInputs[0], 'Updated Description 1')

    await userEvent.tab()

    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['upsertWhy']).toMatchObject({
        _id: '60b8d295f1c8ab1d2f4a1c03',
        subject: 'Updated Subject 1',
        description: 'Updated Description 1',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
    })

    await waitFor(() => {
      const result = onDoneResult()
      expect(result.onDoneResult).toMatchObject({
        valid: true,
        value: [
          expect.objectContaining({
            subject: 'Updated Subject 1',
            description: 'Updated Description 1',
            parentId: '60b8d295f1c8ab1d2f4a1c01',
          }),
        ],
      })
    })
  },
}
