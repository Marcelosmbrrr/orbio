import * as React from 'react';
// Custom
import { ErrorIcon } from '@/Components/shared/icons/ErrorIcon';
// Types
import { LogUploaded } from '@/Pages/home/service-orders/logs/types';

interface IProps {
    log: LogUploaded;
    setIframeRefs: React.Dispatch<React.SetStateAction<React.RefObject<HTMLIFrameElement>[]>>;
}

interface IResponse {
    type: string;
    status: boolean;
    image: { filename: string, dataURL: string };
}

export function LogImageGeneration(props: IProps) {

    const log = props.log;
    const iframeRef = React.useRef(null);
    const [imageDataURL, setImageDataURL] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (iframeRef.current) {
            props.setIframeRefs((refs) => [...refs, iframeRef]);
        }
    }, []);

    // Listen for a response from the drawing process
    window.addEventListener("message", (event) => {
        if (event.origin === window.location.origin) {
            if (event.data.type === 'log-image-generation-draw-response') {
                if (!event.data.status) {
                    // erro
                }
            } else if (event.data.type === 'log-image-generation-response') {
                onImageGenerationResponse(event.data);
            }
        }
    }, false);

    function onImageGenerationResponse(response: IResponse) {
        setImageDataURL(response.image.dataURL);
        setErrorMessage(null);
    }

    // Renderização com base no estado local do componente
    if (imageDataURL && !errorMessage) {
        return (
            <div className="w-[450px] mx-auto">
                <img src={imageDataURL} width={'100%'} height={'100%'} alt="Log Image" />
            </div>
        );
    }

    if (!imageDataURL && errorMessage) {
        return (
            <div className='flex items-center gap-2'>
                <span className='text-sm'>{errorMessage}</span>
                <ErrorIcon />
            </div>
        );
    }

    if (!imageDataURL && !errorMessage) {
        return (
            <div className="w-[450px] mx-auto">
                <div id="modal-content" style={{ height: "100%" }}>
                    <iframe
                        ref={iframeRef}
                        id={"log-iframe-" +  new Date().getTime()}
                        className="w-full aspect-video"
                        onLoad={(e) => {
                            if (e.target instanceof HTMLIFrameElement) {
                                e.target.contentWindow?.postMessage(
                                    { type: 'log-image-generation-draw-request', log: log },
                                    `${window.location.origin}`
                                );
                            }
                        }}
                        src={`${window.location.origin}/home/log-image-generation`}
                        style={{ width: "100%", height: "100%" }}
                    ></iframe>
                </div>
            </div>
        );
    }
}