import Markdown from "markdown-to-jsx";
import React, { Suspense, lazy, useState } from "react";
import Heading from "../components/markdown-components/heading/Heading";
import RoundedText from "../components/markdown-components/roundedText/RoundedText";
import NormalText from "../components/markdown-components/normalText/NormalText";
import UrlTag from "../components/markdown-components/urlTag/UrlTag";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// Lazy-loaded components
const LazyCode = lazy(() =>
  import("../components/markdown-components/newCode/NewCode")
);
const LazyVideoTag = lazy(() =>
  import("../components/markdown-components/videoTag/VideoTag")
);
const LazyImageTag = lazy(() =>
  import("../components/markdown-components/imageTag/ImageTag")
);

// Editor panel component for input
const EditorPanel = ({ value, onChange }) => (
  <Panel minSize={30}>
    <div className="px-2">
      <textarea
        className="w-full h-[calc(100vh-250px)] outline-0 border-0 px-4 py-4 rounded-lg"
        onChange={onChange}
        value={value}
        aria-label="Markdown editor"
      />
    </div>
  </Panel>
);

// Preview panel component for rendered output
const PreviewPanel = ({ content }) => {
  // Markdown component configuration
  const markdownOptions = {
    overrides: {
      Syntax: { component: LazyCode },
      Heading: { component: Heading },
      RoundedText: { component: RoundedText },
      NormalText: { component: NormalText },
      ImageTag: { component: LazyImageTag },
      VideoTag: { component: LazyVideoTag },
      UrlTag: { component: UrlTag },
    },
  };

  return (
    <Panel minSize={30}>
      <div className="w-full px-4 py-4 overflow-auto max-h-[calc(100vh-250px)]">
        {content && (
          <Suspense fallback={<div className="p-4">Loading preview...</div>}>
            <Markdown options={markdownOptions}>
              {content}
            </Markdown>
          </Suspense>
        )}
      </div>
    </Panel>
  );
};

const Editor = () => {
  const [data, setData] = useState("<NormalText>Write something</NormalText>");
  
  const handleChange = (event) => {
    setData(event.target.value);
  };
  
  return (
    <div className="flex justify-evenly p-0">
      <PanelGroup direction="horizontal">
        <EditorPanel value={data} onChange={handleChange} />
        <PanelResizeHandle className="w-2 bg-zinc-800 rounded-lg" />
        <PreviewPanel content={data} />
      </PanelGroup>
    </div>
  );
};

export default Editor;
