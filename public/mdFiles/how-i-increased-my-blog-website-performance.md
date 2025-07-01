<NormalText>Performance optimization is very critical skill to have for an Frontend Developer. With the rise of different new tech stack choices we often keep jumping from one framework to another framework but we skip this most valuable thing which can make you standout from other developers in an organization or in an interview. We know that slow page loads drive people away. In recent years users expect web pages to load in 3 seconds or less - even on mobile devices. Speed is considered the most important feature by some. In this blog we will talk about how I managed to increase the performance of my blog website by more than 20%. The performance is measured by Lighthouse audit or Google PageSpeed Insights. I divide this blog in multiple different blogs as we need to discuss on lot of things and I kind of want to document all of it for future reference also.</NormalText>
<br/>
<Heading>Frontend Metrics</Heading>
<NormalText>Before we begin we need to have a basic knowledge some of the metrics that we use to measure the Frontend performence. There are a lot of metrics but we will discuss only couple of them. </NormalText>
<br/>
<NormalText><strong>• TTFB (Time To First Byte)</strong></NormalText>
<NormalText>TTFB is a metric that measures the time between the request for a resource and when the first byte of a response begins to arrive. Reducing latency in connection setup time and on the backend will contribute to a lower TTFB.</NormalText>
<br/>
<NormalText><strong>• FCP (First Contentful Paint)</strong></NormalText>
<NormalText>The First Contentful Paint (FCP) metric measures the time from when the page starts loading to when any part of the page's content is rendered on the screen. For this metric, "content" refers to text, images (including background images), svg elements, or non-white canvas elements.</NormalText>
<br/>
<NormalText><strong>• LCP (Largest Contentful Paint)</strong></NormalText>
<NormalText>The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading. To provide a good user experience, sites should strive to have Largest Contentful Paint of 2.5 seconds or less. To ensure you're hitting this target for most of your users, a good threshold to measure is the 75th percentile of page loads, segmented across mobile and desktop devices.</NormalText>
<br/>
<NormalText>Like these there are couple of more metrics that are important.I will leave down a picture as a summary of all the important metrics.</NormalText>
<br/>
<ImageTag index="0" identifier="performance"></ImageTag>
<UrlTag data="https://web.dev/metrics/">Read more about the metrics on web.dev</UrlTag>
<br/>
<br/>
<Heading>Google Rail Model</Heading>
<NormalText>RAIL stands for four distinct aspects of web app life cycle: response, animation, idle, and load. Users have different performance expectations for each of these contexts, so performance goals are defined based on the context. I will attach a reference where you can read more about this in details. For summary I will attach a picture which is I believe is better for summary purpose.</NormalText>
<br/>
<ImageTag index="1" identifier="performance"></ImageTag>
<UrlTag data="https://web.dev/rail/">Read more about the RAIL on web.dev</UrlTag>
<br/>
<br/>
<Heading>Before Optimization</Heading>
<NormalText>Now that we know the basic metrics now lets move on to the main interest of this post. Lets look at the state of the application before doing any kind of optimization. We take the Lighthouse Audit as the reference. Since discussing all of the details in a single post will be huge and can also make you feel bored, I will seperate the content in two or most posts.</NormalText>
<br/>
<ImageTag index="2" identifier="performance"></ImageTag>
<br/>
<NormalText>Now lets take a look at the scores after performing the optimzations.</NormalText>
<br/>
<ImageTag index="3" identifier="performance"></ImageTag>
<br/>
<NormalText>WOW! thats a lot of improvement. Lets break down the things that made the high scores.</NormalText>
<br/>
<Heading>1. Asset Minification</Heading>
<NormalText>Whenever you are serving a HTML page you are also sending assets with the response. These assets may include text,css or js files. Minification of these assets plays a vital role when it comes to optimization. Now whenever you are going to make a web application or a web page you are most likely going to use a web framework like React or Angular. Most of these web framework starter packs comes with a bundler in them like - <RoundedText>Webpack in Create-React-App</RoundedText> or <RoundedText>Rollup in Vite</RoundedText></NormalText>
<br/>
<NormalText>These bundles most of the times do the hardwork for you and does the minification in the production builds.</NormalText>
<br/>
<ImageTag index="4" identifier="performance"></ImageTag>
<br/>
<NormalText>If you run the application without building you will see that in the Lighthouse Audit it will tell you some of the ways you can optimize the application. You can see in the above picture where it is telling us to minify the JavaScript files and also to enble text compression.</NormalText>
<NormalText>Now run the same application in production preview mode.</NormalText>
<br/>
<Syntax language="jsx">
npm run build // for building the app
npm run preview // for running in preview mode
</Syntax>
<br/>
<NormalText>I use <RoundedText>Vite</RoundedText> for my application. You can run the app in production mode using the above code. After running that and testing again with Lighthouse you will see a lot of improvement as the bundler will bundle your asset files in chunks.</NormalText>
<br/>
<ImageTag index="5" identifier="performance"></ImageTag>
<br/>
<NormalText>After running the command you will see something like the above. You can see the bundles which the bundler has made after spliting the code and minification. You might see some yellow warning message which is something we will talk and improve later in this post.</NormalText>
<br/>
<Heading>2. Image Compression</Heading>
<NormalText>Serving uncompressed images can sometimes cause performance issue when the image size is too big. I made sure all the images that I used in this blog website are somewhat compressed. You can do the samething using any compression software or website of your choice. But one thing to note is that dont compress the image to a extent where it is not understanable anymore.</NormalText>
<br/>
<ImageTag index="6" identifier="performance"></ImageTag>
<br/>
<NormalText>In the above picture you can see the differnce is size with different compression algorithm used.</NormalText>
<br/>
<Heading>3. Lazy Loading React Components and Router</Heading>
<NormalText>Lazy Loading is a technique where we dont load all the required assets at first but only when it is needed. It can improve <RoundedText>TTFB</RoundedText> and <RoundedText>TTI</RoundedText> a lot. Lets take an example of the app.jsx of the blog app</NormalText>
<br/>
<Syntax language="jsx">

import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Footer from "./components/footer/Footer.jsx";
import Modal from "./components/modal/Modal.jsx";
import Error from "./pages/Error";
import Home from "./pages/Home.jsx";
import SinglePost from "./pages/SinglePost.jsx";

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);

  return (
    \<div>
      \<Header />
        \<Routes>
          \<Route path="/404" element={\<Error />}></Route>
          \<Route path="/" element={\<Home />}></Route>
          \<Route path="/home" element={\<Home />}></Route>
          \<Route path="/:id" element={\<SinglePost />}></Route>
        \</Routes>
      {isModalOpen ? (
          \<Modal setIsModalOpen={setIsModalOpen} />
      ) : (
        ""
      )}
      \<Footer setIsModalOpen={setIsModalOpen} />
    </div>
  );
}

export default App;
</Syntax>
<br/>
<NormalText>This a basic app.jsx file that most people will use but with this if you run the build command and analyze the bundle sizes you get a result something like below</NormalText>
<br/>
<ImageTag index="7" identifier="performance"></ImageTag>
<br/>
<NormalText>Now lets use React Suspense and React Lazy combined with the routes.</NormalText>
<br/>
<Syntax language="jsx">
import { useContext, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Footer from "./components/footer/Footer.jsx";
import Modal from "./components/modal/Modal.jsx";

const LazyError = lazy(() => import("./pages/Error"));
const LazyHome = lazy(() => import("./pages/Home.jsx"));
const LazySinglePost = lazy(() => import("./pages/SinglePost.jsx"));

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);

  return (
    \<div>
     \<div>
        \<Header />
        \<Suspense fallback={\<Loader />}>
          \<Routes>
            \<Route path="/404" element={\<LazyError />}></Route>
            \<Route path="/" element={\<LazyHome />}></Route>
            \<Route path="/home" element={\<LazyHome />}></Route>
            \<Route path="/:id" element={\<LazySinglePost />}></Route>
          \</Routes>
        \</Suspense>

        {isModalOpen ? (
          \<Suspense fallback={\<Loader />}>
            \<Modal setIsModalOpen={setIsModalOpen} />
          </Suspense>
        ) : (
          ""
        )}
        \<Footer setIsModalOpen={setIsModalOpen} />
      </div>
    </div>
  );
}

export default App;
</Syntax>
<br/>
<NormalText>Now if we preview the production build again we can see the bundles are divided into more chunks.</NormalText>
<br/>
<ImageTag index="8" identifier="performance"></ImageTag>
<br/>
<NormalText>Just like this we can add speration of concern into react routing and only make the browser laod the files when necessary. Pretty handy way to add Lazy Loading into React. This can also be done in other components as well.</NormalText>
<br/>
<NormalText>The Suspense component accepts one fallback attribute where you can add a placeholder component such as a <RoundedText>Loading Spinner</RoundedText> or a <RoundedText>Skeleton Loader</RoundedText>. I might add another tutorial about that in the future.</NormalText>
<br/>
<Heading>4. Replace Big Bundle Size Libraries</Heading>
<NormalText>Even after doing all this things Lighthouse scores were not satisfactory to me. At that time I was using firebase as my backend and I saw that even after lazy loading firebase components it was still not performent enough. I used <RoundedText>Vite Bundle Visualizer</RoundedText> to check the bundle sizes and found that firebase exports were not tree shakeable and was causing issues.</NormalText>
<br/>
<ImageTag index="9" identifier="performance"></ImageTag>
<br/>
<NormalText>In desktop mode Lighthouse was giving good score but when it comes to mobile mode removing firebase was helpful. So the point is just because a framework is handy does not mean it will give you a good user experiance. So <RoundedText>Choose Your Tech Stack Wisely</RoundedText>. After removing firebase I moved to a CSM name Hygraph which was very lightweight compared to firebase.</NormalText>
<br/>
<Heading>Conclusion</Heading>
<NormalText>With all these small steps I managed to improve my Lighthouse scores a lot. Achieving a full mobile Lighthouse score is very difficult and also challenging. Lets quickly do a recap of what we discussed. </NormalText>
<br/>
<NormalText>• Serve compressed images</NormalText>
<NormalText>• Serve minifed css and js assets</NormalText>
<NormalText>• You Lazy Loading for React Router and React Components (if needed)</NormalText>
<NormalText>• When using big libraries make sure the library function is tree shakeable otherwise find alternative if possible.</NormalText>
<br/>
<NormalText>With the above steps I managed to improve the Lighthouse scores. I hope with this article you managed to learn something new. Thank you for reading! </NormalText>