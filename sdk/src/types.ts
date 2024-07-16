export type FromWidgetToHostMessage =
	| {
			type: 'OPENED'
			data: {
				timestamp: number
			}
	  }
	| {
			type: 'CLOSE_WIDGET'
	  }
export type FromHostToWidgetMessage = {
	type: 'SHOW_ALERT'
	content: {
		title: string
		message: string
	}
}
