/*

	Root Component of the App:
	Holds common UI elements (NavBar) and Router Component.
	Supports four routes: TaskList, TaskDetail, TaskCreation & TaskEdition.

	TODO:
	Add Breadcrumbs to improve Navigation UX.

	The UI-Framework used to render components is Ant:
	https://ant.design/docs/react/introduce

	Pros & Cons:
	+ 	It provides an amazing integration with React, a wide variety of components and powerful props.
	-	In terms of styling, it lacks the beauty and simplictity of other libraries, i.e. Bulma & Grommet. 
	-	Is very opinionated and documentation is partly on Chinese.

	TODO: 
	Add library to support a Data-Driven Development approach, example:
	https://amplitude.com/

*/


import React, { useEffect, useState } from 'react'
import { Menu, Layout } from 'antd'

import './App.css'

import { TaskForm } from './components/TaskForm'
import { Details } from './components/Details'
import { Home } from './components/Home'


import { 
	AnonymousCredential 
} from 'mongodb-stitch-browser-sdk'


import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom"

import {
	client,
	get_tasks,
	patch_task,
	delete_task,
	post_task,
	put_task
} from './config/db'



const { Header, Content, Footer } = Layout

const App = () => {
	const [tasks, setTasks] = useState([])

	useEffect(() => {
        async function fetchData(){
            await client.auth.loginWithCredential(new AnonymousCredential())
			const tasks = await get_tasks()
			setTasks(tasks)
		}
		fetchData()
	}, [])	


	// TODO: Move Queries to a Context Component.
	const put = async task => {
		await put_task(task)
		const new_tasks = tasks.map(t => t._id === task._id ? task : t)
		setTasks(new_tasks)
	}


	const patch = async task => {
		/*
			TODO: Revert the order of the methods:
			First update the DOM, then make the DB request.
			Add a fallback to the DOM in case of error.	
		*/
		const patched_task = await patch_task(task)
		const new_tasks = tasks.map(t => t._id === patched_task._id ? patched_task : t)
		setTasks(new_tasks)
	}

	const post = async task => {
		const new_id = tasks[tasks.length - 1].id + 1
		const new_doc = await post_task({...task, key: new_id, id: new_id})
		setTasks([...tasks, new_doc])
	}

	const eliminate = async task => {
		await delete_task(task)
		const new_tasks =  tasks.filter(({_id}) => _id !== task._id)
		setTasks(new_tasks)
	}


	return <Router>
		<Layout className="layout" style={{minHeight: '100vh'}}>
			<Header style={{marginBottom: '2rem'}}>
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
					<Menu.Item key="Home"> 
						<Link to={'/'}>Todo App</Link> 
					</Menu.Item>
				</Menu>
			</Header>

			<Content style={{ padding: '0 50px', textAlign: 'center' }}>
				<Switch>
					<Route path="/edit/:taskId">
						<TaskForm method={put} data={tasks}/>
					</Route>

					<Route path="/create">
						<TaskForm method={post}/>
					</Route>

					<Route path={`/details/:taskId`}>
						<Details tasks={tasks}/>
					</Route>

					<Route path="/">
						<Home tasks={tasks} patch={patch} eliminate={eliminate}/>
					</Route>
				</Switch>

			</Content>

			<Footer style={{ textAlign: 'center', maxHeight: '10vh' }}>Todo App !©2020 Created by Santiago M.</Footer>
		</Layout>
	</Router>
}

export default App
