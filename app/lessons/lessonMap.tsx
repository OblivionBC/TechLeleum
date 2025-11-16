"use client"

import "./lessonNode.css";
import {useEffect, useRef, useState} from "react";
import {getLessons} from "@/components/utils/lessonUtils";

import { getLessonsByTopic, Lesson } from "@/app/utils/lessons.ts";
import { useRouter } from "next/navigation";


export default function LessonMap() {

    const router = useRouter();

    const centerRef = useRef<HTMLDivElement>(null);
    const varRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLDivElement>(null);
    const arrRef = useRef<HTMLDivElement>(null);
    const condRef = useRef<HTMLDivElement>(null);
    const funcRef = useRef<HTMLDivElement>(null);
    const eventRef = useRef<HTMLDivElement>(null);
    const arrListRef = useRef<HTMLDivElement>(null);

    const [arr,setArr] = useState<Lesson[]>([]);



    const mapRef = useRef<HTMLDivElement | null>(null);

    const [lines, setLines] = useState<Array<[{ x: number; y: number }, { x: number; y: number }]>>([]);


    const cos = Math.cos(Math.PI/6)*300

    async function Click(){
        const temp = getLessonsByTopic('print')
        setArr(temp);
        console.log(temp);
    }

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


            {arr.length > 0 && (
            <div className="
                    fixed inset-0 z-20
                    flex items-center justify-center
                    bg-black/10 backdrop-blur-sm
                    ">
                <div className="flex flex-col gap-4 w-[420px]">
                    {arr.map((lesson) => (
                        <div
                            key={lesson.id}
                            onClick={() => router.push(`/lessons/${lesson.id}`)}
                            className="
          p-5 rounded-xl bg-white shadow-md border border-amber-200
          cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all
        "
                        >
                            <h2 className="text-xl font-semibold text-amber-900">
                                {lesson.title}
                            </h2>

                            <p className="text-stone-600 mt-1">
                                {lesson.description}
                            </p>

                            <p className="mt-3 text-sm font-medium text-amber-700">
                                ⏱ {lesson.estimatedTime}
                            </p>
                        </div>
                    ))}
                </div>
            </div>)}

            {/* Main Active Node */}
            <div ref={centerRef}
                 className="lesson-node active" style={{left: "calc(50% - 80px)"}}
                 onClick={Click}>
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
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        className="dash"
                    />
                ))}
            </svg>

        </div>
    );
}
