import { useState, useEffect } from "react";


interface WindowSize {
    width: number;
    height: number;
}

export function useScreenSize()  {
    // Initializing state
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect( () => {
        // handler to call window resize
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        // Adding the listener
        window.addEventListener('resize', handleResize);

        // Caling the handler function to call update the width & height with the initial windows size
        handleResize();

        // returning a function in useEffect to Remove the Event Listener
        return () => removeEventListener('resize', handleResize);

    }, []);

    // returning windowSize for useScreenSize() function
    return windowSize;

}

//export type useScreenSize;