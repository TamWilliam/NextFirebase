import React from 'react'
import Account from './index'

describe('<Account />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Account />)
  })
})