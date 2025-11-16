'use client'
import * as Blockly from "blockly/core";
import {javascriptGenerator, Order} from 'blockly/javascript';
import { BlocklyWorkspace } from 'react-blockly';
import {useEffect, useRef, useState} from "react";
import { useRouter } from "next/navigation";
import style from "./BlocklyPlay.module.css"
import { getLessonValidation, validateLessonOutput, getNextLesson } from "@/app/utils/lessons";
import { updateLessonProgress } from "@/components/utils/progressUtils";
import confetti from 'canvas-confetti';

export const MY_TOOLBOX = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Logic",
            "colour": "#5C81A6",
            "contents": [
                { "kind": "block", "type": "controls_if" },
                { "kind": "block", "type": "logic_compare" },
                { "kind": "block", "type": "logic_operation" },
                { "kind": "block", "type": "logic_boolean" },
                { "kind": "block", "type": "logic_null" },
                { "kind": "block", "type": "logic_ternary" }
            ]
        },
        {
            "kind": "category",
            "name": "Loops",
            "colour": "#5CA65C",
            "contents": [
                { "kind": "block", "type": "controls_repeat_ext" },
                { "kind": "block", "type": "controls_whileUntil" },
                { "kind": "block", "type": "controls_for" },
                { "kind": "block", "type": "controls_forEach" },
                { "kind": "block", "type": "controls_flow_statements" }
            ]
        },
        {
            "kind": "category",
            "name": "Math",
            "colour": "#5C68A6",
            "contents": [
                { "kind": "block", "type": "math_number" },
                { "kind": "block", "type": "math_arithmetic" },
                { "kind": "block", "type": "math_single" },
                { "kind": "block", "type": "math_trig" },
                { "kind": "block", "type": "math_constant" },
                { "kind": "block", "type": "math_number_property" },
                { "kind": "block", "type": "math_round" },
                { "kind": "block", "type": "math_on_list" },
                { "kind": "block", "type": "math_modulo" },
                { "kind": "block", "type": "math_constrain" },
                { "kind": "block", "type": "math_random_int" },
                { "kind": "block", "type": "math_random_float" }
            ]
        },
        {
            "kind": "category",
            "name": "Text",
            "colour": "#5CA68D",
            "contents": [
                { "kind": "block", "type": "text" },
                { "kind": "block", "type": "text_join" },
                { "kind": "block", "type": "text_append" },
                { "kind": "block", "type": "text_length" },
                { "kind": "block", "type": "text_isEmpty" },
                { "kind": "block", "type": "text_indexOf" },
                { "kind": "block", "type": "text_charAt" },
                { "kind": "block", "type": "text_getSubstring" },
                { "kind": "block", "type": "text_changeCase" },
                { "kind": "block", "type": "text_trim" },
                { "kind": "block", "type": "text_print" }
            ]
        },
        {
            "kind": "category",
            "name": "Lists",
            "colour": "#745CA6",
            "contents": [
                { "kind": "block", "type": "lists_create_with" },
                { "kind": "block", "type": "lists_repeat" },
                { "kind": "block", "type": "lists_length" },
                { "kind": "block", "type": "lists_isEmpty" },
                { "kind": "block", "type": "lists_indexOf" },
                { "kind": "block", "type": "lists_getIndex" },
                { "kind": "block", "type": "lists_setIndex" }
            ]
        },
        {
            "kind": "category",
            "name": "Variables",
            "custom": "VARIABLE",
            "colour": "#A65C81"
        },
        {
            "kind": "category",
            "name": "Functions",
            "custom": "PROCEDURE",
            "colour": "#9A5CA6"
        }
    ]
}

interface MyBlocklyEditorProps {
    toolboxConfiguration?: any;
    lessonId?: string;
}

export default function MyBlocklyEditor({ toolboxConfiguration = MY_TOOLBOX, lessonId }: MyBlocklyEditorProps) {
    const router = useRouter();
    const [xml, setXml] = useState<string | undefined>();
    const [workspaceReady, setWorkspaceReady] = useState(false);
    const [output, setOutput] = useState<string[]>([]);
    const [showOutput, setShowOutput] = useState(false);
    const [validationResult, setValidationResult] = useState<{ passed: boolean; message: string } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const outputRef = useRef<HTMLDivElement | null>(null);
    const confettiTriggeredRef = useRef<boolean>(false);
    const successModalTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    function handleRunCode() {
        if (!xml || !workspaceRef.current) return;

        // Reset validation state
        setValidationResult(null);
        confettiTriggeredRef.current = false;
        setShowSuccessModal(false);
        if (successModalTimeoutRef.current) {
            clearTimeout(successModalTimeoutRef.current);
            successModalTimeoutRef.current = null;
        }

        try {
            // Generate JavaScript code from the workspace
            javascriptGenerator.addReservedWords('code');
            const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

            // Clear previous output
            setOutput([]);
            setShowOutput(true);

            // Capture console.log output
            const capturedOutput: string[] = [];
            const originalLog = console.log;
            console.log = (...args: any[]) => {
                capturedOutput.push(args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '));
                originalLog.apply(console, args);
            };

            // Execute the code in a try-catch for error handling
            try {
                // Wrap code in a function to capture output
                const wrappedCode = `(function() { ${code} })();`;
                eval(wrappedCode);
                
                // Set output
                setOutput(capturedOutput.length > 0 
                    ? capturedOutput 
                    : ["Program executed successfully (no output)"]
                );
                
                // Validate if lessonId is provided
                if (lessonId) {
                    const validation = getLessonValidation(lessonId);
                    if (validation) {
                        const result = validateLessonOutput(capturedOutput, validation);
                        setValidationResult(result);
                    }
                }
            } catch (error) {
                setOutput([`Error: ${error instanceof Error ? error.message : String(error)}`]);
                setValidationResult(null);
            } finally {
                // Always restore original console.log
                console.log = originalLog;
            }
        } catch (error) {
            setOutput([`Error generating code: ${error instanceof Error ? error.message : String(error)}`]);
            setShowOutput(true);
            setValidationResult(null);
        }
    }

    // Override text_print block to use console.log instead of alert
    useEffect(() => {
        // Override the text_print block generator to use console.log
        javascriptGenerator.forBlock['text_print'] = function(block: any) {
            // Get the text value from the block
            const msg = javascriptGenerator.valueToCode(block, 'TEXT', Order.NONE) || "''";
            return `console.log(${msg});\n`;
        };
    }, []);

    useEffect(() => {
        if (validationResult?.passed && !confettiTriggeredRef.current) {
            confettiTriggeredRef.current = true;
            
            if (lessonId) {
                updateLessonProgress(lessonId, 100).catch((error) => {
                    console.error("Error saving lesson progress:", error);
                });
            }
            
            // Create a fun confetti effect
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                
                // Launch confetti from both sides
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            // Show success modal after 3 seconds
            if (successModalTimeoutRef.current) {
                clearTimeout(successModalTimeoutRef.current);
            }
            successModalTimeoutRef.current = setTimeout(() => {
                setShowSuccessModal(true);
            }, 3000);

            return () => {
                if (successModalTimeoutRef.current) {
                    clearTimeout(successModalTimeoutRef.current);
                }
            };
        }
    }, [validationResult, lessonId]);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            if (workspaceRef.current) {
                Blockly.svgResize(workspaceRef.current);
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    // Keep toolbox open
    useEffect(() => {
        if (!workspaceReady || !workspaceRef.current) return;

        const workspace = workspaceRef.current;
        const toolbox = workspace.getToolbox() as any;
        
        if (!toolbox || typeof toolbox.setExpanded !== 'function') return;
        
        toolbox.setExpanded(true);
        
        if (typeof toolbox.collapse === 'function') {
            toolbox.collapse = () => toolbox.setExpanded(true);
        }
        
        const interval = setInterval(() => {
            toolbox.setExpanded(true);
        }, 200);

        return () => clearInterval(interval);
    }, [workspaceReady]);


    // Scroll output to bottom when new output is added
    useEffect(() => {
        if (outputRef.current && showOutput) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output, showOutput]);

    return (
        <div className="flex flex-col h-full">
        <div style={{ maxHeight: 'none', overflowY: 'auto' }}
             ref={containerRef}>
            <BlocklyWorkspace
                    className={style.my_div}
                    toolboxConfiguration={toolboxConfiguration}
                initialXml={xml}
                    onXmlChange={(newXml) => {
                    setXml(newXml);
                    // Clear validation and reset state when workspace changes
                    setValidationResult(null);
                    confettiTriggeredRef.current = false;
                    setShowSuccessModal(false);
                    if (successModalTimeoutRef.current) {
                        clearTimeout(successModalTimeoutRef.current);
                        successModalTimeoutRef.current = null;
                    }
                }}
                    onWorkspaceChange={(workspace) => {
                        workspaceRef.current = workspace;
                        if (workspace) {
                            setWorkspaceReady(true);
                        }
                }}
                workspaceConfiguration={{
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: "black",
                        snap: true
                    },
                    theme: 'DarkTheme',
                    renderer: 'zelos',
                    zoom: {
                        controls: true,
                        startScale: 0.9,
                        maxScale: 3,
                        minScale: 0.3,
                        scaleSpeed: 1.2
                    },
                    trashcan: true,
                    maxTrashcanContents: 0,
                    move: {
                        scrollbars: true,
                        drag: true,
                        wheel: true
                    },
                    readOnly: false
                }}
            />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 p-4 bg-stone-50 border-t border-stone-200">
                <button 
                    onClick={handleRunCode}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                    Run Code
                </button>
                {showOutput && (
                    <button 
                        onClick={() => setShowOutput(false)}
                        className="bg-stone-400 text-white px-4 py-2 rounded-lg hover:bg-stone-500 transition-colors text-sm font-medium ml-auto"
                    >
                        Hide Output
                    </button>
                )}
            </div>

            {/* Output Panel */}
            {showOutput && (
                <div className="border-t border-stone-300 bg-stone-900 text-green-400 p-4 max-h-0" style={{ maxHeight: 'none', overflowY: 'auto' }} ref={outputRef}>
                    <div className="font-mono text-sm whitespace-pre-wrap">
                        {output.length > 0 ? output.map((line, i) => (
                            <div key={i}>{line}</div>
                        )) : (
                            <div className="text-stone-500">No output yet. Click "Run Code" to execute your program.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Validation Result - Display Below Output */}
            {validationResult !== null && (
                <div className={`border-t-4 p-6 ${
                    validationResult.passed 
                        ? 'bg-green-100 border-green-500 text-green-900 shadow-lg' 
                        : 'bg-red-100 border-red-500 text-red-900 shadow-lg'
                }`}>
                    <div className="flex items-center gap-3">
                        {validationResult.passed ? (
                            <>
                                <div className="text-4xl">🎉</div>
                                <div>
                                    <div className="font-bold text-xl mb-1">
                                        Correct!
                                    </div>
                                    <div className="font-medium text-base">
                                        {validationResult.message.replace('✅ ', '')}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl">❌</div>
                                <div>
                                    <div className="font-bold text-xl mb-1">
                                        Almost there! Try again
                                    </div>
                                    <div className="font-medium text-base">
                                        {validationResult.message.replace('❌ ', '')}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]" style={{ zIndex: 99999 }}>
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 relative z-[99999]" style={{ zIndex: 99999 }}>
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-3xl font-bold text-amber-900 mb-4">
                                Congratulations! You did that perfectly!
                            </h2>
                            <p className="text-lg text-stone-600 mb-6">
                                Ready to move on to the next lesson?
                            </p>
                            <div className="flex gap-4 justify-center">
                                {lessonId && getNextLesson(lessonId) ? (
                                    <button
                                        onClick={() => {
                                            const nextLesson = getNextLesson(lessonId);
                                            if (nextLesson) {
                                                router.push(`/lessons/${nextLesson.id}`);
                                            }
                                        }}
                                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                                    >
                                        Next Lesson
                                    </button>
                                ) : null}
                                <button
                                    onClick={() => router.push('/lessons')}
                                    className="bg-stone-600 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium"
                                >
                                    Back to Lessons
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
