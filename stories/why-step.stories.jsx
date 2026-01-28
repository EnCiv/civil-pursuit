//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useState, useEffect, useContext } from 'react'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import WhyStep from '../app/components/steps/why'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator, asyncSleep } from './common'

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

const myWhyByCategoryByParentId = {
  most: {
    '60b8d295f1c8ab1d2f4a1c01': {
      _id: '60b8d295f1c8ab1d2f4a1c03',
      parentId: '60b8d295f1c8ab1d2f4a1c01',
      subject: 'Existing Subject 1',
      description: 'Existing Description 1',
      category: 'most',
    },
    '60b8d295f1c8ab1d2f4a1c02': {
      _id: '60b8d295f1c8ab1d2f4a1c04',
      parentId: '60b8d295f1c8ab1d2f4a1c02',
      subject: 'Existing Subject 2',
      description: 'Existing Description 2',
      category: 'most',
    },
  },
}

const whyStepTemplate = args => {
  useState(() => {
    window.socket._socketEmitHandlers['get-user-whys'] = (ids, cb) => {
      window.socket._socketEmitHandlerResults['get-user-whys'] = ids
      setTimeout(() => {
        // Flatten whys for the current category
        const category = args.category || 'most'
        const whys = args.myWhyByCategoryByParentId && args.myWhyByCategoryByParentId[category] ? Object.values(args.myWhyByCategoryByParentId[category]) : []
        cb(whys)
      }, 1000)
    }

    window.socket._socketEmitHandlers['upsert-why'] = (why, cb) => {
      window.socket._socketEmitHandlerResults['upsert-why'].push(why)
      cb && cb(why)
    }
    window.socket._socketEmitHandlerResults['upsert-why'] = []
  })

  return <WhyStep {...args} />
}

const emptyTemplate = args => <WhyStep {...args} />

export const Empty = {
  args: {
    defaultValue: {},
    myWhyByCategoryByParentId: {},
  },
  render: emptyTemplate,
  decorators: [],
}

export const InitialNoData = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByCategoryByParentId: {},
      preRankByParentId: preRankByParentId,
    },
    category: 'most',
    myWhyByCategoryByParentId: {},
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
}

export const ReturningUser = {
  args: {
    defaultValue: {
      reducedPointList,
      myWhyByCategoryByParentId,
      preRankByParentId: preRankByParentId,
    },
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
    myWhyByCategoryByParentId,
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
}

export const UserEntersInitialData = {
  args: {
    defaultValue: {
      //_showUpsertDeltas: true, // use for debugging
      reducedPointList,
      preRankByParentId: preRankByParentId,
      myWhyByCategoryByParentId: {},
    },
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  decorators: [DeliberationContextDecorator],
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
    await userEvent.tab()
    await userEvent.type(descriptionInputs[0], 'User Description 1')
    await userEvent.tab()
    await userEvent.type(subjectInputs[1], 'User Subject 2')
    await userEvent.tab()
    await userEvent.type(descriptionInputs[1], 'User Description 2')
    await userEvent.tab()
    await waitFor(() => {
      const result = onDoneResult()
      expect(result.count).toBe(6)
      expect(result.onDoneResult).toMatchObject({
        valid: true,
        value: 1,
      })
      expect(deliberationContextData(canvas)).toMatchObject({
        myWhyByCategoryByParentId: {
          most: {
            '60b8d295f1c8ab1d2f4a1c02': {
              subject: 'User Subject 2',
              description: 'User Description 2',
              //_id: '67afd889de6a473c380615b1', ids are random
              parentId: '60b8d295f1c8ab1d2f4a1c02',
              category: 'most',
            },
            '60b8d295f1c8ab1d2f4a1c01': {
              subject: 'User Subject 1',
              description: 'User Description 1',
              //_id: '67afd888de6a473c380615b0', ids are random
              parentId: '60b8d295f1c8ab1d2f4a1c01',
              category: 'most',
            },
          },
        },
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'][0]).toMatchObject({
        subject: 'User Subject 1',
        description: '',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'][1]).toMatchObject({
        subject: 'User Subject 1',
        description: 'User Description 1',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'][2]).toMatchObject({ subject: 'User Subject 2', description: '', parentId: '60b8d295f1c8ab1d2f4a1c02' })
      expect(window.socket._socketEmitHandlerResults['upsert-why'][3]).toMatchObject({ subject: 'User Subject 2', description: 'User Description 2', parentId: '60b8d295f1c8ab1d2f4a1c02' })
      expect(window.socket._socketEmitHandlerResults['upsert-why'].length).toBe(4)
    })
  },
}

export const UserUpdatesExistingData = {
  args: {
    defaultValue: {
      reducedPointList: reducedPointList,
      preRankByParentId: preRankByParentId,
    },
    myWhyByCategoryByParentId: myWhyByCategoryByParentId, // will be used by get-user-whys
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await asyncSleep(1000)
    await waitFor(() => {
      const result = onDoneResult()
      expect(result).toMatchObject({
        count: 2,
        onDoneResult: {
          valid: true,
          value: 1,
        },
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'].length).toBe(0)
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

    await userEvent.type(subjectInputs[0], ' Updated')
    await userEvent.tab()

    await userEvent.type(descriptionInputs[0], ' Updated')
    await userEvent.tab()

    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['upsert-why'][0]).toMatchObject({
        _id: '60b8d295f1c8ab1d2f4a1c03',
        subject: 'Existing Subject 1 Updated',
        description: 'Existing Description 1',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'][1]).toMatchObject({
        _id: '60b8d295f1c8ab1d2f4a1c03',
        subject: 'Existing Subject 1 Updated',
        description: 'Existing Description 1 Updated',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'].length).toBe(2)
      const result = onDoneResult()
      expect(result).toMatchObject({
        count: 4,
        onDoneResult: {
          valid: true,
          value: 1,
        },
      })
    })
  },
}
