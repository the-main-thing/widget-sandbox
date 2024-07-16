import { useEffect, useState, useRef } from 'react'
import { postMessage } from './postMessage'
import type { FromHostToWidgetMessage } from '@repo/sdk'
import './App.css'

export function App() {
	const [parentMessage, setParentMessage] = useState<
		| Extract<FromHostToWidgetMessage, { type: 'SHOW_ALERT' }>['content']
		| null
	>(null)

	const notified = useRef(false)
	useEffect(() => {
		if (notified.current) return
		postMessage({ type: 'OPENED', data: { timestamp: Date.now() } })
		notified.current = true
	}, [])

	useEffect(() => {
		const onMessage = (message: MessageEvent) => {
			if (
				message.data &&
				typeof message.data === 'object' &&
				'type' in message.data
			) {
				const data = message.data as FromHostToWidgetMessage
				if (data.type === 'SHOW_ALERT') {
					setParentMessage(data.content)
				}
			}
		}

		window.addEventListener('message', onMessage)
		return () => {
			window.removeEventListener('message', onMessage)
		}
	}, [])

	return (
		<div>
			{parentMessage && <h2>{parentMessage.title}</h2>}
			{parentMessage && <p>{parentMessage.message}</p>}
			<button onClick={() => postMessage({ type: 'CLOSE_WIDGET' })}>
				Close
			</button>
		</div>
	)
}
