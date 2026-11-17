//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useState, useEffect, useContext } from 'react'
import { userEvent, within, waitFor, expect } from 'storybook/test'
import WhyStep from '../app/components/steps/why'
import { onDoneDecorator, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator } from './common'

export default {
  component: WhyStep,
  decorators: [onDoneDecorator, socketEmitDecorator],
}

const reducedPointList = [
  { point: { _id: '60b8d295f1c8ab1d2f4a1c01', subject: 'Reliable evening bus service', description: 'More frequent trips after work help residents reach home, school, and essential services.', parentId: '60b8d295f1c8ab1d2f4a1c05' } },
  { point: { _id: '60b8d295f1c8ab1d2f4a1c02', subject: 'Safer crossings near schools', description: 'Clear crosswalks and slower traffic protect students and families walking to class.', parentId: '60b8d295f1c8ab1d2f4a1c05' } },
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
      subject: 'Late buses keep night workers connected',
      description: 'Dependable evening routes help workers reach home safely after other transportation options stop running.',
      category: 'most',
    },
    '60b8d295f1c8ab1d2f4a1c02': {
      _id: '60b8d295f1c8ab1d2f4a1c04',
      parentId: '60b8d295f1c8ab1d2f4a1c02',
      subject: 'Safer school crossings protect children',
      description: 'Lower speeds and visible crosswalks help students and families cross busy streets.',
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
      storageAvailable: false,
    },
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  decorators: [DeliberationContextDecorator],
  render: whyStepTemplate,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('1 / 2')).toBeInTheDocument()

    await waitFor(() => {
      const subjectInputs = canvas.getAllByPlaceholderText('Type some thing here')
      const descriptionInputs = canvas.getAllByPlaceholderText('Description')
      expect(subjectInputs.length).toBe(1)
      expect(descriptionInputs.length).toBe(1)
    })

    let subjectInput = canvas.getByPlaceholderText('Type some thing here')
    let descriptionInput = canvas.getByPlaceholderText('Description')

    await userEvent.type(subjectInput, 'User Subject 1')
    await userEvent.tab()
    await userEvent.type(descriptionInput, 'User Description 1')
    await userEvent.tab()

    await userEvent.click(canvas.getByRole('button', { name: 'Next reason' }))
    expect(canvas.getByText('2 / 2')).toBeInTheDocument()
    subjectInput = canvas.getByPlaceholderText('Type some thing here')
    descriptionInput = canvas.getByPlaceholderText('Description')
    await userEvent.type(subjectInput, 'User Subject 2')
    await userEvent.tab()
    await userEvent.type(descriptionInput, 'User Description 2')
    await userEvent.tab()
    await waitFor(() => {
      expect(args.onDone.mock.calls.at(-1)[0]).toMatchObject({
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
      storageAvailable: false,
    },
    myWhyByCategoryByParentId: myWhyByCategoryByParentId, // will be used by get-user-whys
    category: 'most',
    intro: "Of the issues you thought were Most important, please give a brief explanation of why it's important for everyone to consider it",
  },
  render: whyStepTemplate,
  decorators: [DeliberationContextDecorator],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await waitFor(() => {
      expect(canvas.getAllByDisplayValue('Late buses keep night workers connected').length).toBeGreaterThan(0)
      expect(canvas.getAllByDisplayValue('Dependable evening routes help workers reach home safely after other transportation options stop running.').length).toBeGreaterThan(0)
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(args.onDone.mock.calls.at(-1)?.[0]).toMatchObject({ valid: true, value: 1 })
      expect(window.socket._socketEmitHandlerResults['upsert-why'].length).toBe(0)
    })

    const subjectInputs = canvas.getAllByDisplayValue('Late buses keep night workers connected')
    const descriptionInputs = canvas.getAllByDisplayValue('Dependable evening routes help workers reach home safely after other transportation options stop running.')

    await userEvent.type(subjectInputs[0], ' Updated')
    await userEvent.tab()

    await userEvent.type(descriptionInputs[0], ' Updated')
    await userEvent.tab()

    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['upsert-why'][0]).toMatchObject({
        _id: '60b8d295f1c8ab1d2f4a1c03',
        subject: 'Late buses keep night workers connected Updated',
        description: 'Dependable evening routes help workers reach home safely after other transportation options stop running.',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'][1]).toMatchObject({
        _id: '60b8d295f1c8ab1d2f4a1c03',
        subject: 'Late buses keep night workers connected Updated',
        description: 'Dependable evening routes help workers reach home safely after other transportation options stop running. Updated',
        parentId: '60b8d295f1c8ab1d2f4a1c01',
      })
      expect(window.socket._socketEmitHandlerResults['upsert-why'].length).toBe(2)
      expect(args.onDone.mock.calls.at(-1)[0]).toMatchObject({
        valid: true,
        value: 1,
      })
    })
  },
}
