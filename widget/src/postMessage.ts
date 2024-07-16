import type { FromWidgetToHostMessage } from '@repo/sdk'

export const postMessage = (message: FromWidgetToHostMessage) => {
	try {
		window.parent.postMessage(message, '*')
	} catch (error) {
		console.error('Error posting message to parent:', error)
	}
}
