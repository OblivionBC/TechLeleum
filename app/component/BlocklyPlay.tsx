'use client'
import * as Blockly from "blockly/core";
import {javascriptGenerator} from 'blockly/javascript';
import {pythonGenerator} from 'blockly/python';
import { BlocklyWorkspace } from 'react-blockly';
import {useEffect, useRef, useState} from "react";
import style from "./BlocklyPlay.module.css"

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

export default function MyBlocklyEditor() {
    const [xml, setXml] = useState();

    const workspaceRef = useRef<HTMLDivElement| undefined >(undefined);
    const containerRef = useRef(null);


    function handleGenerateCode() {
        if (!xml) return;

        // 1. Convert XML string → XML DOM
        const xmlDom = Blockly.utils.xml.textToDom(xml);

        // 2. Create a temporary workspace
        const tempWorkspace = new Blockly.Workspace();

        // 3. Load XML DOM into the workspace
        Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);

        javascriptGenerator.addReservedWords('code');
        var code = javascriptGenerator.workspaceToCode(tempWorkspace);

        console.log("Generated Code:\n", code);

        pythonGenerator.addReservedWords('code');
        code = pythonGenerator.workspaceToCode(tempWorkspace);

        console.log("Generated Code:\n", code);

        // 5. Cleanup temp workspace
        tempWorkspace.dispose();
    }
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


    return (
        <div className={style.my_div}
             ref={containerRef}>
            <BlocklyWorkspace
                className={style.my_div} // you can use whatever classes are appropriate for your app's CSS
                toolboxConfiguration={MY_TOOLBOX} // this must be a JSON toolbox definition
                initialXml={xml}
                onXmlChange={setXml}
                ref={workspaceRef}
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
            <button onClick={handleGenerateCode}>
                Generate Code
            </button>
        </div>

    )
}
