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
    solutionLink: tstArr[index][5]
  });
  mp.set(tstArr[index][6], currArr);
}