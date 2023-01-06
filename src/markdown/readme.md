<Heading>Useful JavaScript Code Snippets</Heading>
<NormalText>We will discuss some of the most asked Javascript question in the interviews.
We will discuss some of the most asked <RoundedText>Javascript</RoundedText> question in the interviews.</NormalText>
<br/>
<NormalText><span>1.</span> Select a random element</NormalText>

<Syntax language="javascript">
const items = ["Ball", "Bat", "Cup"];
const randomIndex = Math.floor(Math.random()*items.length);
console.log(items[randomIndex]);
</Syntax>

<NormalText><span>2.</span> Reverse a string</NormalText>

<Syntax language="javascript">
function reverseString(string) {
  return string.split(" ").reverse().join(" ")
}

revereseString("Random String")
</Syntax>

<NormalText><span>3.</span> Check if element has a class</NormalText>

<Syntax language="javascript">
const element = document.querySelector("#element")
element.classList.contains("active")
</Syntax>

<NormalText><span>4.</span> String interpolation</NormalText>

<Syntax language="javascript">
const name = "Jaya";
console.log("Test");
//Hi, Jaya. You have 8 new notifications.
</Syntax>

<NormalText><span>5.</span> Loop through an array</NormalText>

<Syntax language="javascript">
const cars = ["Ford", "BMW", "Audi" ]
for (let car of cars) {
  console.log(car)
}

/*
Ford
BMW
Audi
*/
</Syntax>

<NormalText><span>6.</span> Get current time</NormalText>

<Syntax language="javascript">
const date = new Date()
const currentTime = \`${date.getHours()}:${date.getMintues()}:${date.getSeconds()}`;

console.log(currentTimes)
//example output: "22:16:41"
</Syntax>

<NormalText><span>7.</span> Replace part of a string</NormalText>

<Syntax language="javascript">
const string = "You are awesome."
const replacedString = string.replace("You", "We")

console.log(replacedString) //Output: "We are awesome"
</Syntax>

<NormalText><span>8.</span> Destructing variable assignment</NormalText>

<Syntax language="javascript">
let profile = ['bob', 34, 'carpenter'];
let [name, age, job] = profile;
console.log(name);
// bob
</Syntax>

<NormalText><span>9.</span> Using the spread operator</NormalText>

<Syntax language="javascript">
let data = [1,2,3,4,5];
console.log(...data);
//  1 2 3 4 5
let data2 = [6,7,8,9,10];
let combined = [...data, ...data2];
console.log(...combined);
// 1 2 3 4 5 6 7 8 9 10
console.log(Math.max(...combined));
// 10
</Syntax>