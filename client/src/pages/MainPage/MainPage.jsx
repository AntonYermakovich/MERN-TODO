import React, { useState, useEffect, useContext, useCallback } from 'react'
import './MainPage.scss'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const MainPage = () => {
	const [text, setText] = useState('')
	const { userId } = useContext(AuthContext)
	const [todos, setTodos] = useState([])

	const getTodo = useCallback(async () => {
		try {
			await axios.get('http://localhost:5000/api/todo', {
				headers: {
					'Content-Type': 'application/json'
				},
				params: { userId }
			})
				.then(res => {
					setTodos(res.data)
				})
		} catch (e) {
			console.log(e)
		}
	}, [userId])

	useEffect(() => {
		getTodo()
	}, [getTodo])

	const createTodo = useCallback(async () => {
		if (!text) return null
		try {
			await axios.post('http://localhost:5000/api/todo/add', { text, userId }, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					setTodos([...todos], res.data)
					setText('')
					getTodo()
				})
		} catch (e) {
			console.log(e)
		}
	}, [text, userId, todos, getTodo])

	const removeTodos = useCallback(async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/todo/delete/${id}`, { id }, {
				headers: { 'Content-Type': 'application/json' }
			})
				.then(() => getTodo())
		} catch (e) {
			console.log(e)
		}
	}, [getTodo])

	const completedTodo = useCallback(async (id) => {
		try {
			await axios.put(`http://localhost:5000/api/todo/complete/${id}`, { id }, {
				headers: { 'Content-Type': 'application/json' }
			})
				.then((res) => {
					setTodos([...todos], res.data)
					getTodo()
				})
		} catch (e) {
			console.log(e)
		}
	}, [getTodo, todos])

	const importantTodo = useCallback(async (id) => {
		try {
			await axios.put(`http://localhost:5000/api/todo/important/${id}`, { id }, {
				headers: { 'Content-Type': 'application/json' }
			})
				.then((res) => {
					setTodos([...todos], res.data)
					getTodo()
				})
		} catch (e) {
			console.log(e)
		}
	}, [getTodo, todos])

	return (
		<div className="container">
			<div className="main-page">
				<h4>Добавить задачу</h4>
				<form className="form form-login" onSubmit={e => e.preventDefault()}>
					<div className="row">
						<div className="input-field col s12">
							<label htmlFor="input">Задача</label>
							<input
								type="text"
								id="text"
								name="input"
								value={text}
								className="validate"
								onChange={e => setText(e.target.value)}
							/>
						</div>
					</div>

					<div className="row">
						<button className="wawes-effect wawes-light btn blue" onClick={createTodo}>Добавить</button>
					</div>
				</form>

				<h3>Активные задачи</h3>
				<div className="todos">
					{
						todos.map((todo, index) => {
							let cls = ['row flex todos-item']
							if (todo.completed) {
								cls.push('completed')
							} else if (todo.important) {
								cls.push('important')
							}

							return (
								<div className={cls.join(' ')} key={index}>
									<div className="col todos-num">{index + 1}</div>
									<div className="col todos-text">{todo.text}</div>
									<div className="col todos-buttons">
										<i className="material-icons blue-text" onClick={() => completedTodo(todo._id)}>check</i>
										<i className="material-icons orange-text" onClick={() => importantTodo(todo._id)}>warning</i>
										<i className="material-icons red-text" onClick={() => removeTodos(todo._id)}>delete</i>
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		</div>
	);
}

export default MainPage;
