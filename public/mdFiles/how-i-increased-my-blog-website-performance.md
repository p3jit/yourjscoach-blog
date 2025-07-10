Performance optimization is a very critical skill to have for a Frontend Developer. With the rise of different new tech stacks, we often keep jumping from one framework to another, but we skip this most valuable thing that can make you stand out from other developers — both in organizations and interviews. 

We know that slow page loads drive people away. In recent years, users expect web pages to load in 3 seconds or less — even on mobile devices. Speed is considered the most important feature by some. In this blog, we’ll talk about how I managed to increase the performance of my blog website by more than 20%, measured using Lighthouse audit or Google PageSpeed Insights.

I’ve divided this blog into multiple posts, as there’s a lot to discuss and I want to document it all for future reference.

## Frontend Metrics

Before we begin, we need to understand some basic metrics used to measure frontend performance. There are many, but here are a few key ones:

**• TTFB (Time To First Byte)**  
TTFB measures the time between the request for a resource and when the first byte of a response starts to arrive. Reducing latency in connection setup and backend speed contributes to a lower TTFB.

**• FCP (First Contentful Paint)**  
FCP measures the time from when the page starts loading to when any visible content (text, images, etc.) is rendered on screen.

**• LCP (Largest Contentful Paint)**  
LCP reports the render time of the largest visible content element. Good LCP is 2.5 seconds or less for 75% of users.

There are other metrics as well, but this gives a good start.  
![Image Placeholder](http://localhost:1339/uploads/performance_0_3bda95036f.png)  
https://web.dev/metrics/

## Google Rail Model

RAIL stands for Response, Animation, Idle, and Load — four aspects of a web app's life cycle. Users have different performance expectations in each context.

![Image Placeholder](http://localhost:1339/uploads/performance_1_61a6b9f0ae.png)  
https://web.dev/rail/

## Before Optimization

Now that we know the basic metrics, let’s look at the performance state before any optimizations (using Lighthouse audit).

![Image Placeholder](http://localhost:1339/uploads/performance_2_85c221a868.png)

Now let’s take a look at the scores **after** performing optimizations.

![Image Placeholder](http://localhost:1339/uploads/performance_3_8cf0c25139.png)

WOW! That’s a lot of improvement. Let’s break down what caused the jump.

## 1. Asset Minification

Every time you serve an HTML page, you’re also sending assets (CSS, JS). Minifying them is critical.

If you're using frameworks like React or Vite:
- Create-React-App uses `Webpack`
- Vite uses `Rollup`

These tools typically handle minification automatically in production builds.

![Image Placeholder](http://localhost:1339/uploads/performance_4_47bcc60c87.png)

Running the app without building shows suggestions like JS minification and enabling text compression.

Now run in **production preview mode**:

```bash
npm run build    # build the app
npm run preview  # run in preview mode
```

I use `Vite` for my app. After testing with Lighthouse again, you'll see improvements — code is split and bundled.

![Image Placeholder](http://localhost:1339/uploads/performance_5_e4c372d2c8.png)

You may also see some warnings — we’ll address those later.

## 2. Image Compression

Serving large uncompressed images hurts performance. I ensured all images in my blog were compressed using a compression tool.

![Image Placeholder](http://localhost:1339/uploads/performance_6_e6ce5345df.png)

The image above shows how different algorithms affect image size.

## 3. Lazy Loading React Components and Router

Lazy Loading defers component loading until needed. It improves **TTFB** and **TTI**.

Example without lazy loading:

```jsx
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
    <div>
      <Header />
      <Routes>
        <Route path="/404" element={<Error />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:id" element={<SinglePost />} />
      </Routes>
      {isModalOpen ? <Modal setIsModalOpen={setIsModalOpen} /> : ""}
      <Footer setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
export default App;
```

![Image Placeholder](http://localhost:1339/uploads/performance_7_5fb77e7e96.png)

Now let’s add `React.lazy` and `Suspense`:

```jsx
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
    <div>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/404" element={<LazyError />} />
          <Route path="/" element={<LazyHome />} />
          <Route path="/home" element={<LazyHome />} />
          <Route path="/:id" element={<LazySinglePost />} />
        </Routes>
      </Suspense>
      {isModalOpen ? (
        <Suspense fallback={<Loader />}>
          <Modal setIsModalOpen={setIsModalOpen} />
        </Suspense>
      ) : (
        ""
      )}
      <Footer setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
export default App;
```

![Image Placeholder](http://localhost:1339/uploads/performance_8_ff6d13acdf.png)

This separates routes and components, loading them only when necessary.

Use fallback like a `Loading Spinner` or `Skeleton Loader` inside `Suspense`.

## 4. Replace Big Bundle Size Libraries

Even after lazy loading, scores weren’t great. I was using Firebase, and even though I lazy loaded it, the bundle was still large.

I used `Vite Bundle Visualizer` to identify Firebase as the issue — it wasn't tree-shakeable.

![Image Placeholder](http://localhost:1339/uploads/performance_9_0f0a89fd86.png)

On desktop it was okay, but on mobile Lighthouse, removing Firebase helped.

So the takeaway: **Choose Your Tech Stack Wisely.**  
I moved to Hygraph (a CMS), which was much lighter.

## Conclusion

With these small steps, I improved my Lighthouse scores significantly.

### Recap:

- Serve compressed images  
- Minify CSS and JS  
- Use lazy loading for routes and components  
- Avoid non-tree-shakeable libraries

Hope this helped you learn something new. Thanks for reading!
