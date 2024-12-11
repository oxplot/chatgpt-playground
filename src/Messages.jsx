import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import AutoExtendingTextarea from "./AutoExtendingTextarea";
import "./Messages.css";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import Mermaid from "./Mermaid";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const typeToRole = {
  'user': 'user',
  'assistant': 'assistant',
  'function_call': 'assistant',
  'function_result': 'function',
};

const nextType = {
  "user": "assistant",
  "assistant": "user",
  "function_call": "function_result",
  "function_result": "assistant",
};

function msgType(m) {
  if (m.function_call) {
    return "function_call";
  } else if (m.role == "function") {
    return "function_result";
  } else {
    return m.role;
  }
}

const customHighlighterTheme = {
  ...oneLight,
  "pre[class*=\"language-\"]": {
    ...oneLight["pre[class*=\"language-\"]"],
    margin: "0",
    padding: "0",
    borderRadius: "0",
    backgroundColor: "transparent",
  },
  "code[class*=\"language-\"]": {
    ...oneLight["pre[class*=\"language-\"]"],
    backgroundColor: "transparent",
    margin: "0",
    padding: "0",
    // fontSize: "inherit",
  },
};


function MarkdownRenderer({ content, showCaret, renderMath, renderDiagrams }) {

  const markdownComponents = useMemo(() => ({
    code({ children, className, node, ...rest }) {
      const match = /language-(\w+)/.exec(className || '')

      if (!match) {
        return <code {...rest} className={className}>
          {children}
        </code>;
      }

      if (renderDiagrams && match[1] === 'mermaid') {
        return <Mermaid chart={String(children)} />;
      }

      return <SyntaxHighlighter
        {...rest}
        PreTag="div"
        children={String(children).replace(/\n$/, '')}
        language={match[1]}
        style={customHighlighterTheme}
      />;
    }
  }), [renderDiagrams]);

  // Markdown parsing is expensive, so we memoize the result.
  return useMemo(() => {
    let rehypePlugins = [];
    let remarkPlugins = [remarkGfm];
    if (renderMath) {
      content = content.replace(/\\[[\]()]/g, '$$');
      rehypePlugins = [[rehypeKatex, { output: "html" }]];
      remarkPlugins = [...remarkPlugins, remarkMath];
    }
    return <Markdown
      linkTarget="_blank"
      remarkPlugins={remarkPlugins}
      skipHtml={false}
      rehypePlugins={rehypePlugins}
      components={markdownComponents}
      children={content + (showCaret ? '▏' : '')}
    />
  }, [content, showCaret, renderMath, renderDiagrams]);
}

export function Messages({ messages, setMessages, onSubmit, onCancel, stopReason, streaming, markdown, renderMath, renderDiagrams }) {

  const [prevStreamState, setPrevStreamState] = useState(streaming);
  useEffect(() => setPrevStreamState(streaming), [streaming]);

  const [runningCode, setRunningCode] = useState(null);

  // Auto scrolling behavior

  const lastMsgContentRef = useRef(null);
  const bottomRef = useRef(null);
  const [added, setAdded] = useState(true);
  useEffect(() => {
    if (bottomRef.current && added) {
      if (lastMsgContentRef.current) {
        lastMsgContentRef.current.focus();
      }
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      setAdded(false);
    }
  }, [added]);
  useEffect(() => {
    if (streaming && bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [messages]);

  const addMsg = useCallback(() => {
    setMessages(messages => {
      const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
      const newMsgType = lastMsg ? nextType[msgType(lastMsg)] : "user";
      const newMsg = {
        role: typeToRole[newMsgType],
        name: lastMsg && msgType(lastMsg) === "function_call" ? lastMsg.function_call.name : undefined,
        content: '',
        function_call: newMsgType === 'function_call' ? { name: '', arguments: '' } : undefined,
      };
      return [...messages, newMsg];
    });
    setAdded(true);
  }, [setMessages]);

  const deleteMsg = useCallback(i => {
    setMessages(messages => {
      return [...messages.slice(0, i), ...messages.slice(i + 1)];
    });
  }, [setMessages]);

  const switchType = useCallback(i => {
    setMessages(messages => {
      const m = messages[i];
      const types = Object.keys(nextType);
      const newType = types[(types.indexOf(msgType(m)) + 1) % types.length];
      const oldName = m.name;
      const oldFnCall = m.function_call;
      const oldContent = m.content;
      const newMsg = {
        role: typeToRole[newType],
        name: newType === "function_result" ? ((oldFnCall && oldFnCall.name) || '') : undefined,
        content: oldContent || (oldFnCall && oldFnCall.arguments) || '',
        function_call: newType === 'function_call' ? { name: oldName || '', arguments: oldContent || '' } : undefined,
      };
      return [...messages.slice(0, i), newMsg, ...messages.slice(i + 1)]
    });
  }, [setMessages]);

  useEffect(() => {
    const l = e => {
      if (streaming && e.key === 'Escape') {
        onCancel();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!streaming) {
          onSubmit();
        }
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', l, false);
    return () => document.removeEventListener('keydown', l);
  }, [streaming, onCancel, onSubmit]);

  const runCode = useCallback(() => {
    var cancel = () => {
      document.addEventListener('keydown', escapeHandler, false);
      setRunningCode(null);
      // INTERRUPT
    };
    var escapeHandler = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    };
    setRunningCode({ cancel });
    setTimeout(() => {
      cancel();
    }, 3000);
    document.addEventListener('keydown', escapeHandler, false);
  }, [setRunningCode, messages, setMessages, onSubmit]);

  useEffect(() => {
    if (!stopReason && prevStreamState && !streaming) {
      // If last streamed message was a function call, run the code.
      runCode();
    }
  }, [prevStreamState, streaming, stopReason]);

  return <>
    <div className="messages">
      {messages.map((m, i) =>
        <div className="message" key={i} data-type={msgType(m)}>
          {streaming && i === messages.length - 1 ? <label className="type" /> : <>
            <label className="type" onClick={() => switchType(i)} />
            <span className="delete" onClick={() => deleteMsg(i)} />
          </>}
          {msgType(m) === 'function_result' || msgType(m) === 'function_call' ?
            <input
              className="textarea function-name"
              onInput={(e) => {
                const mm = JSON.parse(JSON.stringify(m));
                if (mm.role === 'function') {
                  mm.name = e.target.value;
                } else {
                  mm.function_call.name = e.target.value;
                }
                setMessages([...messages.slice(0, i), mm, ...messages.slice(i + 1)]);
              }}
              type="text"
              placeholder="Function Name"
              value={m.role === 'function' ? m.name : m.function_call.name}
            />
            : ''}
          {markdown && msgType(m) === 'assistant' ?
            <div className="markdown" ref={i === messages.length - 1 ? lastMsgContentRef : undefined}>
              {m.content.trim() === '' && !(i === messages.length - 1 && streaming) ?
                <div style={{ padding: "1em 0" }}>
                  <i>empty markdown content&nbsp;-&nbsp;
                    turn off "Render Markdown" to edit.</i>
                </div>
                :
                <MarkdownRenderer key={i} renderDiagrams={renderDiagrams} renderMath={renderMath} content={m.content} showCaret={i === messages.length - 1 && streaming} />
              }
            </div>
            :
            <AutoExtendingTextarea
              ref={i === messages.length - 1 ? lastMsgContentRef : undefined}
              onInput={(e) => {
                const mm = JSON.parse(JSON.stringify(m));
                if (mm.function_call) {
                  mm.function_call.arguments = e.target.value;
                } else {
                  mm.content = e.target.value
                }
                setMessages([...messages.slice(0, i), mm, ...messages.slice(i + 1)]);
              }}
              className="content"
              value={
                (m.function_call ? m.function_call.arguments : m.content) +
                (i === messages.length - 1 && streaming ? '▏' : '')
              }
              placeholder={{
                "function_call": "Function Arguments",
                "function_result": "Function Result",
              }[msgType(m)] || ""}
              readOnly={streaming && i === messages.length - 1}
            />
          }
        </div>
      )}
    </div>
    {
      runningCode ?
        <div>
          Running code ...
          <a onClick={() => runningCode?.cancel()} style={{ marginLeft: "1em", cursor: "pointer" }}>cancel</a>
        </div>
        :
        (
          streaming ?
            <button className="cancel-request" title="Escape" onClick={onCancel}>Cancel</button>
            :
            <>
              <button onClick={addMsg}>Add</button>
              <button onClick={onSubmit} className="submit-request" title="Ctrl/Cmd+Enter">Submit</button>
            </>
        )
    }
    {stopReason ? <span className="stop-reason">{stopReason}</span> : ''}
    <div ref={bottomRef} style={{ visibility: "hidden", height: "0" }} />
  </>;
}