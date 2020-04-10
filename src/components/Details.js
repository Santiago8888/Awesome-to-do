/*

	Minimal Component used to display the Task Detail.

	TODO:
		-	Custom render of each description item/field (e.g. Completion Status).
		-	Fetch task document from the component: use the same approach as with Forms, (evaluate a cusomt hook).
		-	Handle non-existant routes.

	Description Docs:
	https://ant.design/components/descriptions/
*/


import { Descriptions } from 'antd'
import React from 'react'

import { useParams } from "react-router-dom"
import { columns } from '../config/props'



export const Details = ({ tasks }) => {
	const { taskId } = useParams()
	return	<Descriptions title="Task Details" bordered column={1}>
		{ columns.map(({ title, dataIndex }) => 
			<Descriptions.Item label={title}> {String((tasks[taskId] || {})[dataIndex])} </Descriptions.Item>
		)}
	</Descriptions>
}
