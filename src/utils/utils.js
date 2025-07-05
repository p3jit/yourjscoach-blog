import Fuse from "fuse.js";

// Returns the table data from parsed csv data
export function generateTableDataFromCsv(tstArr) {
  tstArr = tstArr.slice(0, tstArr.length - 1);
  let mp = new Map();
  for (let i = 1; i < tstArr.length; i++) {
    if (!tstArr[i]) continue;
    if (mp.has(tstArr[i][6])) {
      addinMap(i, mp, tstArr);
    } else {
      mp.set(tstArr[i][6], []);
      addinMap(i, mp, tstArr);
    }
  }
  let tableData = mapToObj(mp);
  return tableData;
}

//Logic for generating the object from map
function mapToObj(map) {
  const tableMap = [];
  for (let [key, value] of map) {
    let currData = {};
    currData.name = key;
    currData.questions = [...value];
    currData.questions.sort((a, b) => a.difficulty - b.difficulty);
    tableMap.push(currData);
  }
  return tableMap;
}

//Logic for populating the map
function addinMap(index, mp, tstArr) {
  let currArr = mp.get(tstArr[index][6]);
  currArr.push({
    questionName: tstArr[index][0],
    difficulty: parseInt(tstArr[index][1], 10),
    askedIn: tstArr[index][2].split(","),
    problemLink1: tstArr[index][3],
    problemLink2: tstArr[index][4],
    solutionLink: tstArr[index][5],
  });
  mp.set(tstArr[index][6], currArr);
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const returnColor = (difficulty) => {
  if (difficulty === 1) {
    return "text-green-600";
  } else if (difficulty === 2) {
    return "text-yellow-600";
  } else {
    return "text-red-600";
  }
};

export const returnDifficultyText = (difficulty) => {
  if (difficulty === 1) {
    return "Easy";
  } else if (difficulty === 2) {
    return "Medium";
  } else {
    return "Hard";
  }
};

export const fuzzySearchWithFuse = (obj, options, searchText) => {
  const fuse = new Fuse(obj, options);
  const fuseResult = fuse.search(searchText);
  let searchResult = [];
  if (fuseResult.length > 0) {
    searchResult = fuseResult.map((singleResult, index) => singleResult.item);
  }
  return searchResult;
};

export const isNewProblem = (timestamp) => {
  if (!timestamp) return false;
  
  const problemDate = new Date(timestamp);
  const currentDate = new Date();
  
  // Calculate the difference in milliseconds
  const diffTime = currentDate - problemDate;
  
  // Convert to days
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // Return true if less than 3 days old
  return diffDays < 10;
};
