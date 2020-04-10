/*

	Form component used to handle the creation and edition of ToDo Tasks.

	Props:
	Receives a method function to handle the form submission from the parent.
	Data is an optional array to inject data to the form when editing a task.
	The task to be edited is determined by the route param. 

	TODO:
	Handle routes for non-existant tasks.
	Fetch the retrieved task from the component (use in conjunction with data props as cache).

	Ant Forms provide off-the shelf support for submission, validation, accesibility and much more:
	https://ant.design/components/form/

*/


import React from 'react'

import { Form, Input, Checkbox, Button, Typography } from 'antd'
import { useParams, useHistory } from "react-router-dom"



const { Title } = Typography
const layout = { 
	labelCol: { span: 4, offset: 4 },
	wrapperCol: { span: 8 },
}

const tailLayout = {
	wrapperCol: { offset: {sm: 16, xs: 0}, span: 24 }
}

export const TaskForm = ({ method, data=[] }) => {
	const history = useHistory()
	const { taskId } = useParams()
	const FormTitle = taskId ? 'Edit Task' : 'Create Task'

	// Only provide data to the form if we are on Edit Model
	const item = taskId ? data[taskId] : null

	return <>
		<Title level={2} style={{marginBottom: '2rem'}}> { FormTitle } </Title>
		<Form
			{...layout}
			name="basic"
			initialValues={ item ? item : {completed: false}}

			// Handle Submit & Redirect.
			onFinish={(e) => {
				// If editing, pass the full object. Else only the form values.
				method(item ? {...item, ...e} : e)
				history.push('/')
			}}

			// TODO: Handle Error.
			onFinishFailed={e => console.log(e)}
		>

			<Form.Item
				label="Name"
				name="name"
				rules={[{ required: true, message: 'Please input a name!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Title"
				name="title"
				rules={[{ required: true, message: 'Please input a title!' }]}
			>
				<Input />
			</Form.Item>

			{/* TODO: Test this item. */}
			<Form.Item name="completed" valuePropName="checked" {...tailLayout}>
				<Checkbox>Completed</Checkbox>
			</Form.Item>

			<Form.Item {...tailLayout}>
				<Button type="primary" htmlType="submit" >
					Submit
				</Button>
			</Form.Item>
		</Form>
	</>
}
