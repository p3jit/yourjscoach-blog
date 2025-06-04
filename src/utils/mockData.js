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
  askedIn: ["Google", "Adobe", "Microsoft", "Amazon"]
};
