import type { FromHostToWidgetMessage, FromWidgetToHostMessage } from './types';
import './style.css';
export type { FromHostToWidgetMessage, FromWidgetToHostMessage };
export type Options = {
    node: HTMLElement | null;
    paymentToken: string;
    className?: string;
    onMessage?: (message: FromWidgetToHostMessage) => void;
};
declare const render: (options: Options) => {
    postMessage: (message: FromHostToWidgetMessage) => void;
    iframe: HTMLIFrameElement;
    cleanup: () => void;
};
export type RenderFunction = typeof render;
export type RenderResult = ReturnType<typeof render>;
