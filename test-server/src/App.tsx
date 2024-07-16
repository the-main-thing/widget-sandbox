/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import type { RenderFunction, RenderResult } from './sdk'

function App() {
	const [iframeContainer, setIframeContainer] =
		useState<HTMLDivElement | null>(null)

	const [postMessage, setPostMessage] = useState<
		RenderResult['postMessage'] | null
	>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		if (!('__pw' in window)) {
			return
		}
		const render = (window as any).__pw.render as RenderFunction
		const renderResult = render({
			node: iframeContainer,
			paymentToken: 'your-payment-token',
			className: 'iframe',
		})
		window.addEventListener('message', (event: MessageEvent) => {
			if (
				event.data &&
				typeof event.data === 'object' &&
				'type' in event.data
			) {
				if (event.data.type === 'CLOSE_WIDGET') {
					setMounted(false)
				}
			}
		})

		setPostMessage(() => renderResult?.postMessage || null)
	}, [iframeContainer])

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setMounted(!mounted)}>toggle</button>
			</div>
			<form
				onSubmit={event => {
					event.preventDefault()
					const formData = new FormData(event.currentTarget)
					const title = formData.get('title') || ''
					const message = formData.get('message') || ''
					if (
						postMessage &&
						typeof message === 'string' &&
						typeof title === 'string'
					) {
						postMessage?.({
							type: 'SHOW_ALERT',
							content: {
								title,
								message,
							},
						})
					}
				}}
			>
				<label>
					Title
					<input
						name="title"
						type="text"
						placeholder="Type something"
					/>
				</label>
				<label>
					Message
					<input
						name="message"
						type="text"
						placeholder="Type something"
					/>
				</label>
				<button type="submit">Send alert to widget</button>
			</form>
			{mounted && (
				<div
					style={{ width: '700px', height: '600px' }}
					ref={setIframeContainer}
				/>
			)}
		</>
	)
}

export default App
