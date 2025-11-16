"use client"

import "./lessonNode.css";
import {useEffect, useRef, useState} from "react";

export default function LessonMap() {

    const centerRef = useRef<HTMLDivElement>(null);
    const varRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLDivElement>(null);
    const arrRef = useRef<HTMLDivElement>(null);
    const condRef = useRef<HTMLDivElement>(null);
    const funcRef = useRef<HTMLDivElement>(null);
    const eventRef = useRef<HTMLDivElement>(null);
    const arrListRef = useRef<HTMLDivElement>(null);

    const mapRef = useRef<HTMLDivElement | null>(null);

    const [lines, setLines] = useState<Array<[{ x: number; y: number }, { x: number; y: number }]>>([]);


    const cos = Math.cos(Math.PI/6)*300

    function centerOf(
        ref: React.RefObject<HTMLElement | null>,
        containerRect: DOMRect
    ) {
        if (!ref.current) return { x: 0, y: 0 };

        const rect = ref.current.getBoundingClientRect();
        return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
        };
    }

    useEffect(() => {
        function updateLines() {
            if (!mapRef.current) return;
            const rootRect = mapRef.current.getBoundingClientRect();

            const C  = centerOf(centerRef, rootRect);
            const V  = centerOf(varRef, rootRect);
            const S  = centerOf(seqRef, rootRect);
            const A  = centerOf(arrRef, rootRect);
            const D  = centerOf(condRef, rootRect);
            const F  = centerOf(funcRef, rootRect);
            const E  = centerOf(eventRef, rootRect);
            const AL = centerOf(arrListRef, rootRect);

            setLines([
                [C, V],
                [V, S],
                [V, A],
                [S, D],
                [A, D],
                [D, F],
                [D, E],
                [F, AL],
                [E, AL],
            ]);
        }

        updateLines();
        window.addEventListener("resize", updateLines);
        return () => window.removeEventListener("resize", updateLines);
    }, []);


    return (
        <div ref={mapRef} className="lesson-map">

            {/* Main Active Node */}
            <div ref={centerRef} className="lesson-node active" style={{left: "calc(50% - 80px)"}}>
                <span>Print&Output</span>
            </div>

            {/* Locked child nodes */}
            <div ref={varRef} className="lesson-node locked" style={{top: "300px", left: "calc(50% - 80px)"}}>
                <span>Variables</span>
            </div>

            <div ref={seqRef} className="lesson-node locked"
                 style={{top: "calc(300px + 150px)", left: `calc(50% - 80px - ${cos}px)`}}>
                <span>Sequences</span>
            </div>

            <div ref={arrRef} className="lesson-node locked"
                 style={{top: "calc(300px + 150px)", left: `calc(50% - 80px + ${cos}px)`}}>
                <span>Arrays & Lists</span>
            </div>


            <div ref={condRef} className="lesson-node locked"
                 style={{top: "calc(300px + 300px)", left: "calc(50% - 80px)"}}>
                <span>Conditions</span>
            </div>


            <div ref={funcRef} className="lesson-node locked"
                 style={{top: "calc(300px + 150px + 300px)", left: `calc(50% - 80px - ${cos}px)`}}>
                <span>Function</span>
            </div>

            <div ref={eventRef} className="lesson-node locked"
                 style={{top: "calc(300px + 150px + 300px)", left: `calc(50% - 80px + ${cos}px)`}}>
                <span>Event</span>
            </div>

            <div ref={arrListRef} className="lesson-node locked"
                 style={{top: "calc(300px + 300px + 300px)", left: "calc(50% - 80px)"}}>
                <span>Array & List</span>
            </div>

            {/* dashed connector lines */}
            <svg className="lesson-lines">
                {lines.map(([from, to], i) => (
                    <line
                        key={i}
                        x1={from.x}
                        y1={from.y }
                        x2={to.x}
                        y2={to.y }
                        className="dash"
                    />
                ))}
            </svg>

        </div>
    );
}
