

var arrAll = [] // 包含 seats 大于 5 的所有 row
var arrRest = [[], [], [], [], []]


// n 代表票数
function getTargetRow(n) {

  if (rowsArr[n-1].length > 0) {
    var rows = rowsArr[n-1]
    var row = getRandomRow(rows)
    rows.remove(row)

    return row

    // var rest = row.seats
    // if (rest === 0) {
    //   rows.remove(row)
    // } else if (rest < 5) {
    //   rows.remove(row)
    //   rowsArr[rest-1].push(row)
    // }

    // return row
  } else {
    var row = getRandomRow(arrAll)

  }

  
  if (row !== undefined) {
    // 大部分情况， 复杂度为 O(1)
    row.seats = row.seats - n
    if (row.seats < 5) {
      arrAll.remove(row)
      arrRest[rest-1].push(row)   // row放入对应的 arrRest
    }

    return row
  } else {
    // arrAll 为空，代表要满座了，属于特殊情况，少数情况
    // 利用 arrRest 处理
    if (arrRest[n-1].length > 0) {
      var row = arrRest.pop()
      return row
    } else {

    }
  }
  
}


function getRows = (rows, n, m) => {
  if (m === -1) { 
    console.error('no more seats!')
    return
  }
  if (rowsArr[m].length < 0) {
    return getRows(rows, n, m - 1)
  } else {
    var targetRows = rowsArr[n - 1]
    var row = getRandomRow(targetRows)
    targetRows.remove(row)
    
    row.seats -= n
    if (row.seats < 0) {  // row 
      n = -row.seats
      rows.push(row)
      
    } else (row.seat === 0) {
      // 得到所有 rows
    } else {
      // 得到所有 rows
      // 将剩余 row 放在合适的位置
    }
  }
}