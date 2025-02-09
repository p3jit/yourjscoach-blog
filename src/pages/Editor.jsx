import Markdown from "markdown-to-jsx";
import React, { Suspense, lazy, useState } from "react";
import Heading from "../components/markdown-components/heading/Heading";
import RoundedText from "../components/markdown-components/roundedText/RoundedText";
import NormalText from "../components/markdown-components/normalText/NormalText";
import UrlTag from "../components/markdown-components/urlTag/UrlTag";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const LazyCode = lazy(() =>
  import("../components/markdown-components/newCode/NewCode")
);
const LazyVideoTag = lazy(() =>
  import("../components/markdown-components/videoTag/VideoTag")
);
const LazyImageTag = lazy(() =>
  import("../components/markdown-components/imageTag/ImageTag")
);

const Editor = () => {
  const [data, setData] = useState("<NormalText>Write something</NormalText>");
  const handleChange = (event) => {
    setData(event.target.value);
  };
  return (
    <div className="flex justify-evenly p-0">
      <PanelGroup direction="horizontal">
        <Panel minSize={30}>
          <div className="px-2">
            <textarea
              className="w-full h-[calc(100vh-250px)] outline-0 border-0 px-4 py-4 rounded-lg"
              onChange={handleChange}
              value={data}
            ></textarea>
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-zinc-800 rounded-lg" />
        <Panel minSize={30}>
          <div className="w-full px-4 py-4 overflow-auto max-h-[calc(100vh-250px)]">
            {data ? (
              <Suspense>
                <Markdown
                  options={{
                    overrides: {
                      Syntax: { component: LazyCode },
                      Heading: { component: Heading },
                      RoundedText: { component: RoundedText },
                      NormalText: { component: NormalText },
                      ImageTag: {
                        component: LazyImageTag,
                      },
                      VideoTag: {
                        component: LazyVideoTag,
                      },
                      UrlTag: {
                        component: UrlTag,
                      },
                    },
                  }}
                >
                  {data}
                </Markdown>
              </Suspense>
            ) : (
              ""
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Editor;
