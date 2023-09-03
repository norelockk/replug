declare global {
  interface Window {
    [key: string]: any;
  }
}

interface DevtoolsState {
  isOpen: boolean;
  orientation?: string;
}

const devtools: DevtoolsState = {
  orientation: '',
  isOpen: false
};

const threshold = 170;

const emitEvent = (isOpen: boolean, orientation?: string) => {
  window.dispatchEvent(
    new window.CustomEvent<DevtoolsState>('devtoolschange', {
      detail: {
        isOpen,
        orientation,
      },
    })
  );
};

const main = ({ emitEvents = true }: { emitEvents?: boolean } = {}) => {
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  const orientation = widthThreshold ? 'vertical' : 'horizontal';

  if (
    !(heightThreshold && widthThreshold) &&
    ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) ||
      widthThreshold ||
      heightThreshold)
  ) {
    if ((!devtools.isOpen || devtools.orientation !== orientation) && emitEvents) {
      emitEvent(true, orientation);
    }

    devtools.isOpen = true;
    devtools.orientation = orientation;
  } else {
    if (devtools.isOpen && emitEvents) {
      emitEvent(false, undefined);
    }

    devtools.isOpen = false;
    devtools.orientation = undefined;
  }
};

main({ emitEvents: false });
setInterval(main, 500);

export default devtools;