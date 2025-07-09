## Escaping useState Hell in React

If you are someone who is starting out in React, you might have faced this issue where we use multiple `useState` in a single component, and it makes the code messy and less readable. In this blog, we will talk about how to overcome this using two possible solutions. But before that, let's talk about what this **useState Hell** really is.

## Let us try to understand the problem with the following scenario:

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleFirstNameInput = async (e) => {
    await setFirstName(e.target.value);
  };

  const handleLastNameInput = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    console.log({ firstName, lastName, email });
  }, [firstName, lastName, email]);

  return (
    <div className="App">
      <form>
        <label htmlFor="firstName">First name: </label>
        <input type="text" id="firstName" onChange={handleFirstNameInput} />
        <label htmlFor="lastName">Last name: </label>
        <input type="text" id="lastName" onChange={handleLastNameInput} />
        <label htmlFor="email">Email : </label>
        <input type="text" id="email" onChange={handleEmailInput} />
      </form>
    </div>
  );
}
```

In the above example, we use three separate `useState` calls. This may seem fine initially, but as the app grows, it can become hard to manage and clutter the code.

Another issue is that we are using separate handler functions for each state variable. This pattern is often referred to as **useState Hell**.

## Now, what is the solution to this?

Instead of creating multiple `useState` variables, we can combine them into a single object using `useState`.

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleFirstNameInput = (e) => {
    setFormData((prev) => ({ ...prev, firstName: e.target.value }));
  };

  const handleLastNameInput = (e) => {
    setFormData((prev) => ({ ...prev, lastName: e.target.value }));
  };

  const handleEmailInput = (e) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="App">
      <form>
        <label htmlFor="firstName">First name: </label>
        <input type="text" id="firstName" onChange={handleFirstNameInput} />
        <label htmlFor="lastName">Last name: </label>
        <input type="text" id="lastName" onChange={handleLastNameInput} />
        <label htmlFor="email">Email : </label>
        <input type="text" id="email" onChange={handleEmailInput} />
      </form>
    </div>
  );
}
```

With this approach, we reduce the number of state declarations and improve visibility. However, we still have three separate handlers. Let's improve that.

## Let's make this approach a lot better with a single handler function

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const singleHandler = (e, keyName) => {
    if (Object.keys(formData).includes(keyName)) {
      setFormData((prev) => ({ ...prev, [keyName]: e.target.value }));
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="App">
      <form>
        <label htmlFor="firstName">First name: </label>
        <input type="text" id="firstName" onChange={(e) => singleHandler(e, "firstName")} />
        <label htmlFor="lastName">Last name: </label>
        <input type="text" id="lastName" onChange={(e) => singleHandler(e, "lastName")} />
        <label htmlFor="email">Email : </label>
        <input type="text" id="email" onChange={(e) => singleHandler(e, "email")} />
      </form>
    </div>
  );
}
```

This looks cleaner and more readable. But there’s something even better: React provides something similar out-of-the-box — `useReducer`.

If you're unfamiliar with `useReducer`, check out this article for examples:  
https://blog.webdevsimplified.com/2020-06/use-reducer/

## Let's see how useReducer can make the difference

```tsx
import { useEffect, useReducer } from "react";

export default function App() {
  const [formData, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "updateFirstName":
        return { ...state, firstName: action.payload };
      case "updateLastName":
        return { ...state, lastName: action.payload };
      case "updateEmail":
        return { ...state, email: action.payload };
      default:
        return state;
    }
  }, {
    firstName: "",
    lastName: "",
    email: ""
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="App">
      <form>
        <label htmlFor="firstName">First name: </label>
        <input type="text" id="firstName" onChange={(e) => dispatch({ type: "updateFirstName", payload: e.target.value })} />
        <label htmlFor="lastName">Last name: </label>
        <input type="text" id="lastName" onChange={(e) => dispatch({ type: "updateLastName", payload: e.target.value })} />
        <label htmlFor="email">Email : </label>
        <input type="text" id="email" onChange={(e) => dispatch({ type: "updateEmail", payload: e.target.value })} />
      </form>
    </div>
  );
}
```

## Conclusion

Now that we’ve seen how `useReducer` can improve code performance and readability, the question remains: **should you use `useState` or `useReducer`?**

- For small applications or simple forms, `useState` is sufficient and easy to read.
- For larger applications that require scalability and better structure, `useReducer` is preferred because it helps in managing state more cleanly as complexity grows.