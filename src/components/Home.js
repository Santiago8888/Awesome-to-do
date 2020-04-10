/*

	Component used to show all tasks in a table.
	Supports toggling the Task Status, Deletion of a Task and redirects to a Task Detail & Task Creation.

	Search was implemented using a regex on the main fields of a component.
	Pagination was removed to simplify testing. (TODO: Test in conjunction with search).

	The component creates a local copy of the fetched tasks to inject the mutation methods and filter tasks.

	Docs:
	https://ant.design/components/table/

	TODO:
		- Add Support for sorting & filtering by completion status (using Ant).
		- Define PropTypes across this and every other component.

	Issues: 
		Media based column rendering:
		https://github.com/ant-design/ant-design/issues/10904

*/


import React, { useEffect, useState } from 'react'
import { Table, Input, Button } from 'antd'

import { columns } from '../config/props'
import { Link } from "react-router-dom"

import Media from "react-media"


const tableColumns = [
	...columns,
	{
		title: 'Edit',
		dataIndex: 'edit',
		key: 'edit',
		render: (t, _, idx) => <Link to={`/edit/${idx}`}><Button type="primary"> Edit </Button></Link>,
		hideOnSmall: true
	}, {
		title: 'Delete',
		dataIndex: 'eliminate',
		key: 'eliminate',
		render: (_, item) => <Button type="danger" data-testid={`Delete-${item.title}`} onClick={()=> item.eliminate(item)}> X </Button>,
		hideOnSmall: true
	}
]


const getResponsiveColumns = smallScreen => tableColumns.filter(({ hideOnSmall = false }) => !(smallScreen && hideOnSmall))

export const Home = ({ tasks, patch, eliminate }) => {
	const [rows, setRows] = useState(tasks)
	const [searchText, setSearchText] = useState('')

	const reset_rows = () => setRows(tasks.map(i => ({...i , patch, eliminate})))

	useEffect(() => { reset_rows() }, [tasks])

	const search = q => {
		setSearchText(q)
		if(q){
			const regex = new RegExp(q, 'gi' )
			const filtered_rows = rows.filter(({ title, name, id}) => [title, String(id), name].some(t => t.match(regex)))
			setRows(filtered_rows)
		} else { reset_rows() }
	}

	return <>
		<Input
          placeholder={`Search Tasks`}
          value={searchText}
          onChange={({ target }) => search(target.value)}
          style={{ width: 188, margin:'0px 20px 20px auto', display: 'block' }}
        />
		<Media query="(max-width: 599px)">{smallScreen => 
			<Table columns={ getResponsiveColumns(smallScreen) } dataSource={ rows } pagination={false}/>
		}</Media>
		<Link  to={'/create'}><Button type="primary" style={{marginTop: 30}}>Add Task</Button></Link>
	</>
}
