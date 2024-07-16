import type { FromHostToWidgetMessage, FromWidgetToHostMessage } from './types'

export type { FromHostToWidgetMessage, FromWidgetToHostMessage }

export type Options = {
	node: HTMLElement | null
	paymentToken: string
	className?: string
	onMessage?: (message: FromWidgetToHostMessage) => void
}

let iframeElement = null as HTMLIFrameElement | null

const postMessage = (message: FromHostToWidgetMessage) => {
	console.log('trying to post message to iframe')
	if (iframeElement?.contentWindow?.postMessage) {
		console.log('posting message to iframe: ', message)
		iframeElement.contentWindow?.postMessage(message, '*')
	}
}

let cleanups = [] as any[]
let effects = [] as any[]
const cleanup = () => {
	for (let i = 0; i < cleanups.length; i++) {
		cleanups[i]?.()
		cleanups[i] = null
	}
	if (cleanups.length !== effects.length) {
		cleanups.length = effects.length
	}
}
const effect = (callback: () => undefined | VoidFunction) => {
	effects.push(callback)
}
let timeout = null as number | null
const runEffects = () => {
	if (timeout !== null) {
		clearTimeout(timeout)
	}
	timeout = setTimeout(() => {
		cleanup()
		for (let i = 0; i < effects.length; i++) {
			cleanups[i] = effects[i]?.()
			effects[i] = null
		}
	}, 0)
}

const render = (options: Options) => {
	console.log('render', options)
	runEffects()
	const { node, className, onMessage, paymentToken } = options
	effect(() => {
		const observer = new MutationObserver(() => {
			if (!node || !document.contains(node)) {
				render({ ...options, node: null })
			}
		})
		if (node?.parentElement) {
			observer.observe(node.parentElement, {
				childList: true,
				subtree: false,
				attributes: false,
			})

			return () => observer.disconnect()
		}
	})
	if (!node) {
		return null
	}

	const iframeElement = iframe({
		className,
		onMessage,
		src: 'http://localhost:5173?paymentToken=' + paymentToken,
	})

	node.replaceChildren(iframeElement)

	return {
		postMessage,
		iframe: iframeElement,
		cleanup,
	}
}

;(window as any).__pw = { render }

export type RenderFunction = typeof render
export type RenderResult = ReturnType<typeof render>

function iframe({
	src,
	onMessage,
	className,
}: {
	src: string
	className?: string
	onMessage?: Options['onMessage']
}) {
	effect(() => {
		const interval = setInterval(() => {
			console.log('mounted')
		}, 1000)
		const handleMessage = (event: MessageEvent) => {
			if (
				event.data &&
				typeof event.data === 'object' &&
				'type' in event.data
			) {
				onMessage?.(event.data as FromWidgetToHostMessage)
			}
		}
		window.addEventListener('message', handleMessage)

		return () => {
			window.removeEventListener('message', handleMessage)
			clearInterval(interval)
		}
	})

	if (!iframeElement) {
		iframeElement = document.createElement('iframe')
	}
	if (className) {
		if (!iframeElement.classList.contains(className)) {
			iframeElement.classList.add(className)
		}
	} else if (iframeElement.classList.contains(className)) {
		iframeElement.classList.remove(className)
	}
	iframeElement.setAttribute('src', src)
	return iframeElement
}
