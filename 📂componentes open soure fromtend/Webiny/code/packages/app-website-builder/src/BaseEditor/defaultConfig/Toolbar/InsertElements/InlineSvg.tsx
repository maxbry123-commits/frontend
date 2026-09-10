import React, { useCallback, useEffect, useRef } from "react";

interface InlineSvgProps {
    src: string;
    className?: string;
}

export const InlineSvg = ({ src, className = "" }: InlineSvgProps) => {
    const ref = useRef<HTMLObjectElement | null>(null);

    const setSvg = useCallback((svg: string) => {
        if (ref.current) {
            const domParser = new DOMParser();
            const svgElement = domParser.parseFromString(svg, "image/svg+xml");

            if (className.length > 0) {
                svgElement.documentElement.classList.add(...className.split(" "));
            }
            ref.current.innerHTML = svgElement.documentElement.outerHTML;
        }
    }, []);

    useEffect(() => {
        if (src.startsWith("<svg") && ref.current) {
            setSvg(src);
            return;
        }

        if (src.startsWith("data:image/svg+xml")) {
            const base64 = src.split(",")[1];
            setSvg(atob(base64));
            return;
        }

        fetch(src)
            .then(res => res.text())
            .then(svg => setSvg(svg))
            .catch(console.error);
    }, [src]);

    return <div ref={ref} />;
};
