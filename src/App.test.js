/*

    Two main tests are included:
        1. New Task Lifecycle:
            - Navigates to Create Form.
            - Fills & Submits Form.
            - Asserts newly created Task.
            - Gets Delete Button relatd to new task.
            - Deletes Task.
            - Asserts deletion.

        2. Toggles Task-Completed Switch:
            - Waits for Tasks to Load.
            - Retrieves Status of First Switch.
            - Toggles switch based on Status.
            - Assert value has changed (via element classes).
            - Repeat Toggle & assertion.

    Libraries used:
        -   React Testing Library.
        -   Jest.

    Comments:
            - React Testing Library favors a UI-driven testing approach,
            this means that UI state and not the component's is asserted.

            - Because of this, tests were carried out on the main app component,
            moving tests on shallowly mounted components would have provided very little use.

            - Tests were carried out using the actual DB engine, creating a mock component for it
            falls outside the scope of the task. 

            - A configuration file to only run seldom tests would provide useful. 

            - According to documentation wait methods were deprecated in favor of waitFor.
            However, errors were thown when using it most-likely because of the library version.
            TODO: Reasearch more on it, update libraries if needed & refactor tests if necessary. 


    Tests were run for the last time on Friday 5am (PT), outcome: SUCESS!


    IMPORTANT:

        Ocasionally, tests timeout because of DB cold starts.
        If that happens please run them again. 

        TODO: extend the timeout parameter or used Mocked Network Requests.

*/


import { 
    wait,
    render, 
    screen, 
    fireEvent, 
    waitForElement, 
    waitForDomChange, 
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import App from './App'
import React from 'react'


//  Prevents errors during the tests. 
//  TODO: Research more about it, and document it.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), 
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})



test('1. New Task LifeCycle', async() => {

    const rdmTitle = String(Math.random())
    const { debug, getByTestId, getByText, getByLabelText, getAllByText} = render(
        <App/>
    )

    await waitForDomChange()

    const PostButton = getByText('Add Task')
    const DeleteButtons = getAllByText('X')
    console.log('Data Fetched', DeleteButtons.length)


    fireEvent.click(PostButton)
    const NameInput = getByLabelText('Name')
    fireEvent.change(NameInput, {target: { value: 'Unit Test'}})
    
    const TitleInput = getByLabelText('Title')
    fireEvent.change(TitleInput, { target: { value: rdmTitle}})

    const SubmitButton = getByText('Submit')
    fireEvent.submit(SubmitButton)
    console.log('Form Submited', rdmTitle)


    await waitForElement(()=> getByText(rdmTitle))
    expect(screen.queryByText(rdmTitle)).toBeTruthy()
    console.log('New Element Found')

    const DeleteButton = getByTestId(`Delete-${rdmTitle}`)
    fireEvent.click(DeleteButton)

    await waitForElementToBeRemoved(()=> getByTestId(`Delete-${rdmTitle}`))
    expect(screen.queryByText(rdmTitle)).toBeNull()
    console.log('Deletion Executed')

})



test('2. Toggle Task-Completed Switch', async() => {

    const completedClass = 'ant-switch-checked'
    const { debug, getAllByRole } = render(
        <App/>
    )

    await waitForDomChange()

    const SwitchButton = getAllByRole('switch')

    if(SwitchButton.length){
        const FirstSwitch = SwitchButton[0]
        const isSelected = [...FirstSwitch.classList].includes('ant-switch-checked')

        if(isSelected){
            fireEvent.click(FirstSwitch)
            await wait(()=> expect(FirstSwitch).not.toHaveClass(completedClass))
            console.log('Switch is off: ', [...FirstSwitch.classList])

            fireEvent.click(FirstSwitch)
            await wait(()=> expect(FirstSwitch).toHaveClass(completedClass))
            console.log('Task was Completed: ', [...FirstSwitch.classList])

        } else {
            fireEvent.click(FirstSwitch)
            await wait(()=> expect(FirstSwitch).toHaveClass(completedClass))
            console.log('Task was Completed: ', [...FirstSwitch.classList])

            fireEvent.click(FirstSwitch)
            await wait(()=> expect(FirstSwitch).not.toHaveClass(completedClass))
            console.log('Switch is off: ', [...FirstSwitch.classList])
        }
    }
})
