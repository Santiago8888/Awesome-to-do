/*

	The File holds utilities used across the app.
	In this case the columns that represent the fields of each task document are defined.
	They are used on Table & Description components.
	
	TODO: 
	Enforce the use of a Typing System, i.e. TypeScript or Flow. 

*/


import React from 'react'

import { Link } from "react-router-dom"
import { Switch as Swap } from 'antd'


export const columns = [{
	title: 'Id',
	dataIndex: 'id',
	key: 'id'
}, {
	title: 'Name',
	dataIndex: 'name',
	key: 'name',
	render: (text, _, idx) => <Link to={`/details/${idx}`}>{text}</Link>
}, {
	title: 'Title',
	dataIndex: 'title',
	key: 'title',
	hideOnSmall: true	
}, {
	title: 'Completed',
	dataIndex: 'completed',
	key: 'completed',
	render: (text, item) => <Swap checked={text} onChange={()=> item.patch(item)} />,
	hideOnSmall: true
}]
