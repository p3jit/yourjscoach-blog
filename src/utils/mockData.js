export const mockPractice = {
  problemTitle: "1. Add two numbers with javascript",
  mdContent: `<NormalText>In this task, you are required to write a function that takes two integers as input and returns their sum. The function should be able to handle positive, negative, and zero values.</NormalText>\
      <br/><Example input="2,3" output="5">Example 1</Example>\
      <br/><Example input="5,6" output="11">Example 2</Example>`,
  difficulty: "Easy",
  editorValueCode: `\
    // Complete the following function to execute the code
    function addTwoNumber (x,y) {
        return x+y;
    }
  `,
  editorValueTests: `\
  describe("addTwoNumber", () => {
    it("should match correct ouput 1", () => {
        expect(addTwoNumber(1,2)).equal(3);
    });
    it("should match correct ouput 2", () => {
        assert.equal(addTwoNumber(1,2),3);
    });
    it("should match correct ouput 3", () => {
        assert.equal(addTwoNumber(1,2),3);
    });
  });
  `,
  functionName: "addTwoNumber",
  testCases: [
    [2, 3],
    [4, 5],
  ],
  test: [1,2,3,4,5,6,7,8,9],
  correctOutput: [5, 9],
  tags: ["array", "dp"],
};

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
      description: "test1",
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
      description: "test2",
    },
  ],
};
