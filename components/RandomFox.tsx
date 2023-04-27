import { FunctionComponent, FC, useEffect, useState } from "react"
import type {ImgHTMLAttributes} from 'react';
import { useRef } from "react"

type LazyImageProps = {
    src: string,
    onLazyLoad?: (img: HTMLImageElement) => void
}

type ImageNative = ImgHTMLAttributes<HTMLImageElement>;

type Props = LazyImageProps & ImageNative;

//Implicito
// export const RandomFox = () => {
//     return <img />
//}


//Explicitas:



//la mas recomendada al dia de hoy: 15-Abril-2023
export function LazyImage({
    src,
    onLazyLoad,
    ...imgProps
  }: Props): JSX.Element {
    const node = useRef<HTMLImageElement>(null);
    const [isLazyLoaded, setIsLazyLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
    );

    useEffect(() => {

        if (isLazyLoaded) {
            return;
        }

        //new observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) =>{
                console.log(entry, node);
                
                if(!entry.isIntersecting || !node.current){                    
                    return;
                }

                setCurrentSrc(src);
                observer.disconnect();
                setIsLazyLoaded(true);

                if(typeof onLazyLoad === "function"){
                    onLazyLoad(node.current);
                }
            });
        });
        
        //observe node
        if(node.current){            
            observer.observe(node.current!) //en lugar del if, se puede usar asi: observer.observe(node.current!)
        }
        

        //dissconect
        return() => {
            observer.disconnect();
        }
    }, [src, onLazyLoad, isLazyLoaded])

    return <img ref={node} src={currentSrc} {...imgProps} />
}



// export const RandomFox: FunctionComponent = () => {
//     return <img />
// }

// export const RandomFox: FC = () => {
//     return <img />
// }