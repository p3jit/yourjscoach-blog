<NormalText>If you are someone who is starting out in react you might have faced this issue where we use
multiple <RoundedText>useState</RoundedText> in a single component and it makes the code dirty and not readable. In this blog we will talk about how we can overcome this using two possible solution. But before that lets talk about what this <RoundedText>useState Hell</RoundedText> really is.</NormalText>
<br/>
<Heading>Let us try to understand the problem with the following scenario</Heading>
<br/>
<Syntax language="jsx">

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
    \<div className="App">
      \<form>
        \<label htmlFor="firstName">First name: </label>
        \<input type="text" id="firstName" onChange={handleFirstNameInput} />
        \<label htmlFor="lastName">Last name: </label>
        \<input type="text" id="lastName" onChange={handleLastNameInput} />
        \<label htmlFor="email">Email : </label>
        \<input type="text" id="emil" onChange={handleEmailInput} />
      \</form>
    \</div>
  );
}

</Syntax>
<br/>
<NormalText>In the above example you can see that we have taken three useState where the three variables are taken. At front this might seem normal but when the application will grow bigger in size having so many useState can cause problem and also can make the code difficult to read.</NormalText>
<br/>
<NormalText>Another issue is that for all the state variables we are taking different handler functions which can also grow is size. This scenario is something that can be referred  to as <RoundedText>useState Hell</RoundedText></NormalText>
<br/>
<Heading>Now, what is the solution to this ?</Heading>
<br/>
<NormalText>Well, what we can do is instead to creating multiple useState variables we can combine them and use a <RoundedText>useState object</RoundedText> with multitple properties. Take the following as an example - </NormalText>
<br/>
<Syntax language="jsx">

import { useEffect, useState } from "react";

export default function App() {
  const [formData,setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const handleFirstNameInput = async (e) => {
    setFormData((prev) => {return {...prev,firstName:e.target.value}})
  };

  const handleLastNameInput = (e) => {
    setFormData((prev) => {return {...prev,lastName:e.target.value}})
  };

  const handleEmailInput = (e) => {
    setFormData((prev) => {return {...prev,email:e.target.value}})
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    \<div className="App">
      \<form>
        \<label htmlFor="firstName">First name: </label>
        \<input type="text" id="firstName" onChange={handleFirstNameInput} />
        \<label htmlFor="lastName">Last name: </label>
        \<input type="text" id="lastName" onChange={handleLastNameInput} />
        \<label htmlFor="email">Email : </label>
        \<input type="text" id="emil" onChange={handleEmailInput} />
      \</form>
    \</div>
  );
}


</Syntax>
<br/>
<NormalText>With the above process we are reducing the number of useState variables with a single useState which is resulting in better visibilty and readability. But it still does not provide a complete solution as we are still using three different handler functions to get our job done.</NormalText>
<br/>
<Heading>Lets make this approach a lot better with a single handler function</Heading>
<br/>
<Syntax language="jsx">

import { useEffect, useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const singleHandler = (e, keyName) => {
    // checking if the key is presnet in the state object
    if (Object.keys(formData).includes(keyName)) {
      setFormData((prev) => {
        return { ...prev, \[keyName]: e.target.value };
      });
    }
    console.log("Error");
  };

  useEffect(() => {
    console.log(formData);
  }, \[formData]);

  return (
    \<div className="App">
      \<form>
        \<label htmlFor="firstName">First name: </label>
        \<input
          type="text"
          id="firstName"
          onChange={(e) => {
            singleHandler(e, "firstName");
          }}
        />
        \<label htmlFor="lastName">Last name: </label>
        \<input
          type="text"
          id="lastName"
          onChange={(e) => {
            singleHandler(e, "lastName");
          }}
        />
        \<label htmlFor="email">Email : </label>
        \<input
          type="text"
          id="emil"
          onChange={(e) => {
            singleHandler(e, "email");
          }}
        />
      \</form>
    \</div>
  );
}

</Syntax>
<br/>
<NormalText>This looks much more readable and pleasing to the eyes but there is catch to this. React hooks provides something similar out of the box which is <RoundedText>useReducer</RoundedText> . Using useReducer can help in redux-ify things when the application gets more complex and can provide much more readable solution. If you dont know how useReducer works you can go <UrlTag data="https://blog.webdevsimplified.com/2020-06/use-reducer/">here</UrlTag> for the basic and complex examples.</NormalText>
<br/>
<Heading>Lets see how useReducer can make the difference</Heading>
<br/>
<Syntax language="jsx">

import { useEffect, useReducer } from "react";

export default function App() {
  const [formData, dispatch] = useReducer(
    (state, action) => {
      let newFormData = { ...state };

      switch (action.type) {
        case "updateFirstName": {
          newFormData.firstName = action.payload;
          break;
        }
        case "updateLastName": {
          newFormData.lastName = action.payload;
          break;
        }
        case "updateEmail": {
          newFormData.email = action.payload;
          break;
        }
        default: {
          break;
        }
      }
      return newFormData;
    },
    {
      firstName: "",
      lastName: "",
      email: ""
    }
  );

  useEffect(() => {
    console.log(formData);
  }, \[formData]);

  return (
    \<div className="App">
      \<form>
        \<label htmlFor="firstName">First name: </label>
        \<input
          type="text"
          id="firstName"
          onChange={(e) => {
            dispatch({ type: "updateFirstName", payload: e.target.value });
          }}
        />
       \<label htmlFor="lastName">Last name: </label>
        \<input
          type="text"
          id="lastName"
          onChange={(e) => {
            dispatch({ type: "updateLastName", payload: e.target.value });
          }}
        />
        \<label htmlFor="email">Email : </label>
        \<input
          type="text"
          id="email"
          onChange={(e) => {
            dispatch({ type: "updateEmail", payload: e.target.value });
          }}
        />
      \</form>
    \</div>
  );
}

</Syntax>
<br/>
<Heading>Conclusion</Heading>
<br/>
<NormalText>Now that we know how useReducer can improve code performance and readability the questions still rises what should we use <RoundedText>useState</RoundedText> or <RoundedText>useReducer</RoundedText>. According to me if the application is small and there is no need of sacaling in it then it is better to use <RoundedText>useState</RoundedText> as in small scale application that is much more readable and everyone is much more accustomed to it. On the other hand if you want to keep scalability in mind it is better to go with <RoundedText>useReducder</RoundedText> as it will make the code much more readable in the long run.</NormalText>