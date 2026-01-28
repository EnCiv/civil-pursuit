import React from 'react'
import PairWise from '../app/components/pair-wise'
import { within, userEvent, waitFor } from '@storybook/test'
import expect from 'expect'

export default { title: 'Components/PairWise' }

export const Default = () => (
  <PairWise>
    <div style={{ height: '6rem', padding: '0.5rem' }}>
      Tall card A<br />
      extra line
    </div>
    <div style={{ height: '4rem', padding: '0.5rem' }}>Short card B</div>
    <div style={{ height: '5rem', padding: '0.5rem' }}>Medium card C</div>
    <div style={{ height: '7rem', padding: '0.5rem' }}>
      Tall card D<br />
      line
      <br />
      line
    </div>
    <div style={{ padding: '0.5rem' }}>
      Line 1<br />
      Line 2<br />
      Line 3<br />
      Line 4<br />
      Line 5<br />
      Line 6<br />
      Line 7<br />
      Line 8<br />
      Line 9<br />
      Line 10
    </div>
  </PairWise>
)

export const DefaultInteraction = () => (
  <PairWise>
    <div style={{ height: '6rem', padding: '0.5rem' }}>
      Tall card A<br />
      extra line
    </div>
    <div style={{ height: '4rem', padding: '0.5rem' }}>Short card B</div>
    <div style={{ height: '5rem', padding: '0.5rem' }}>Medium card C</div>
    <div style={{ height: '7rem', padding: '0.5rem' }}>
      Tall card D<br />
      line
      <br />
      line
    </div>
    <div style={{ padding: '0.5rem' }}>
      Line 1<br />
      Line 2<br />
      Line 3<br />
      Line 4<br />
      Line 5<br />
      Line 6<br />
      Line 7<br />
      Line 8<br />
      Line 9<br />
      Line 10
    </div>
  </PairWise>
)

DefaultInteraction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  // initial items visible (use regex to handle <br/> splitting)
  await canvas.findByText(/Tall card A/i)
  await canvas.findByText(/Short card B/i)

  // 1) click the left card (Tall card A) -> should be replaced by Medium card C
  await userEvent.click(canvas.getByText(/Tall card A/i))
  await waitFor(() => {
    const el = canvas.getByText(/Medium card C/i)
    const pe = window.getComputedStyle(el).pointerEvents
    if (pe === 'none') throw new Error('Medium card C not yet clickable')
    return true
  })

  // 2) click the new left card (Medium card C) -> should be replaced by Tall card D
  await userEvent.click(canvas.getByText(/Medium card C/i))
  await waitFor(() => {
    const el = canvas.getByText(/Tall card D/i)
    const pe = window.getComputedStyle(el).pointerEvents
    if (pe === 'none') throw new Error('Tall card D not yet clickable')
    return true
  })

  // 3) click the new left card (Tall card D) -> should be replaced by the verbose last card (search for its text)
  await userEvent.click(canvas.getByText(/Tall card D/i))
  await waitFor(() => {
    const el = canvas.getByText(/Line 1/i)
    const pe = window.getComputedStyle(el).pointerEvents
    if (pe === 'none') throw new Error('Line 1 not yet clickable')
    return true
  })

  // 4) final click when no next item remains: click the left verbose card -> final single should be Short card B
  await userEvent.click(canvas.getByText(/Line 1/i))
  await waitFor(() => canvas.getByText(/Short card B/i))

  // final assertion: single card is visible
  expect(canvas.getByText('Short card B')).toBeTruthy()
}

export const Single = () => (
  <PairWise>
    <div style={{ height: '6rem', padding: '0.5rem' }}>Only one</div>
  </PairWise>
)

// Single story intentionally has no interactive test here
