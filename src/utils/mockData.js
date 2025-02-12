export const mockPractice = {
  problemTitle: "1. Add two numbers with javascript",
  mdContent: `<NormalText>In this task, you are required to write a function that takes two integers as input and returns their sum. The function should be able to handle positive, negative, and zero values.</NormalText>\
      <br/><Example input="2,3" output="5">Example 1</Example>\
      <br/><Example input="5,6" output="11">Example 2</Example>`,
  difficulty: "Easy",
  editorValueCode: `\
    // Complete the following function to execute the code
    function addTwoNumber (x,y) {
      console.log("Test1", "Test2");
      return x+y;
    }
  `,
  editorValueTests: `\
  describe("addTwoNumber", () => {
    it("should match correct ouput 1", () => {
        expect(addTwoNumber(1,2)).equal(3);
    });
    it("should match correct ouput 2", () => {
        expect(addTwoNumber(3,4)).equal(7);
    });
    it("should match correct ouput 3", () => {
        expect(addTwoNumber(5,6)).equal(120012);
    });
  });
  `,
  functionName: "addTwoNumber",
  sampleTestInput: [1, 2],
  test: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  correctOutput: [5, 9],
  tags: ["array", "dp"],
};

export const mockQuestions = [
  {
    questionName: "Contains Duplicate",
    difficulty: 0,
    askedIn: ["Google", "Adobe", "Microsoft", "Amazon"],
    id: "contains-duplicate",
    topics: ["Array", "DP", "Graph"],
  },
  {
    questionName: "Concatanation of Array",
    difficulty: 1,
    askedIn: ["Ola", "Oracle", "Airbnb", "Amazon"],
    id: "concatanation-of-array",
    topics: ["Array", "DP", "Graph"],
  },
  {
    questionName: "Second largest element in the array",
    difficulty: 0,
    askedIn: ["Google", "Adobe", "Microsoft", "Amazon"],
    id: "second-largest-element-in-the-array",
    topics: ["Array", "DP", "Graph"],
  },
  {
    questionName: "Remove duplicates from an sorted array",
    difficulty: 0,
    askedIn: ["Google", "Adobe", "Microsoft", "Amazon"],
    id: "remove-duplicates-from-an-sorted-array",
    topics: ["Array", "DP", "Graph"],
  },
];

export const mockBlogData = {
  data: [
    {
      mdFile: "what-is-usestatehell-and-how-to-overcome-it",
      displayId: "what-is-usestatehell-and-how-to-overcome-it",
      title: "What is useStateHell and how to overcome it",
      bannerImage: null,
      timeStamp: 123334444123,
      imageList: [],
      videoList: [],
      tags: ["tag1", "tag2"],
      description:
        "If you are someone who is starting out in react you might have faced this issue where we use multiple useState in a single component and it makes the code dirty and not readable. In this blog we will talk about how we can overcome this using two possible solution. But before that lets talk about what this useState Hell really is.",
    },
    {
      mdFile: "how-i-increased-my-blog-website-performance",
      displayId: "how-i-increased-my-blog-website-performance",
      title: "How I increased my blog website performance",
      bannerImage: null,
      timeStamp: 123334444123,
      imageList: [],
      videoList: [],
      tags: ["tag1", "tag2"],
      description:
        "If you are someone who is starting out in react you might have faced this issue where we use multiple useState in a single component and it makes the code dirty and not readable. In this blog we will talk about how we can overcome this using two possible solution. But before that lets talk about what this useState Hell really is.",
    },
  ],
};
