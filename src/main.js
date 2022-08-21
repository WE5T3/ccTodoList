let work = {}
let todoList = []
const newTodo = document.querySelector('#newTodo')
window.onload = function () {
  loadData()
  render()
  //定时器每秒调用一次fnDate()
  setInterval(function () {
    fnDate()
  }, 1000)
}



function check(checkId, checked) {
  const inputContent = document.getElementById(checkId).nextElementSibling.textContent
  work = {id: checkId, data: inputContent, done: checked}
  let workIndex
  todoList.forEach((e) => {
    if (e.id === work.id) {
      workIndex = todoList.indexOf(e)
    }
  })
  todoList.splice(workIndex, 1, work)
  saveData(todoList)
  render()
}

function remove(closeId) {       //此处一开始定义函数名为close()  但是onclick无法触发  原因为close为系统库名 函数命名冲突导致
  let workIndex
  todoList.forEach((e) => {
    if (e.id === closeId.substring(5)) {
      workIndex = todoList.indexOf(e)
    }
  })
  todoList.splice(workIndex, 1)
  saveData(todoList)
  render()
}

function clearAll() {
  localStorage.clear()
  render()
}

function clearDone() {
  console.log(todoList)
  todoList = todoList.filter(e =>
      e.done ===false
  )
  saveData(todoList)
  render()
}

function edit(inputId){
  const editContent= window.prompt().trim()
  console.log(editContent)
  if(editContent===''){
    alert('内容不能为空')
  }else {
    let workIndex
    todoList.forEach((e) => {
      if (e.id === inputId.substring(5)) {
        workIndex = todoList.indexOf(e)
      }
    })
    todoList[workIndex].data=editContent
    saveData(todoList)
    render()
  }
  
}

document.addEventListener('keypress', function (e) {
  if (document.activeElement.id === 'newTodo' && e.key === 'Enter') {
    addTodo()
  }
})

document.querySelector('.addBtn').onclick = function () {
  addTodo()
}

function saveData(data) {
  localStorage.setItem('myTodoList', JSON.stringify(data))
}

function loadData() {
  const record = localStorage.getItem('myTodoList')
  if (record !== null) {
    return JSON.parse(record)
  } else {
    return []
  }
}

function render() {
  let todo = document.querySelector('.todoList'),
      done = document.querySelector('.doneList'),
      left = document.querySelector('.leftCount'),
      todoString = '',
      doneString = '',
      leftCount = 0
  document.querySelector('#newTodo').focus()
  todoList = loadData()
  if (todoList !== null) {
    todoList.map((e) => {
      
      if (!e.done) {
        todoString = '<li>\n' +
            '                    <input type="checkbox" name="checkBtn" class="checkBtn" id="' + e.id + '" onclick="check(id,checked)" >\n' +
            '                    <p class="content" id="' + 'input' + e.id + '" ondblclick=edit(id)>' + e.data + '</p>\n' +
            '                    <button class="closeBtn"  id="' + 'close' + e.id + '" onclick=remove(id)>×</button>\n' +
            '                </li>' + todoString
        leftCount++
      } else {
        doneString += '<li>\n' +
            '                    <input type="checkbox" checked name="checkBtn" class="checkBtn" id="' + e.id + '" onclick="check(id,checked)">\n' +
            '                    <p class="content" id="' + 'input' + e.id + '" ondblclick=edit(id)>' + e.data + '</p>\n' +
            '                    <button class="closeBtn"  id="' + 'close' + e.id + '" onclick=remove(id)>×</button>\n' +
            '                </li>'
      }
    })
    todo.innerHTML = todoString
    done.innerHTML = doneString
    left.innerHTML = leftCount.toString() + 'items left'
  } else {
    todo.innerHTML = ''
    done.innerHTML = ''
    left.innerHTML = '0 items left'
  }
  
}

// 创建一个数组对象来保存用户输入的数据，数组的每一项都是一个对象，对象的"data"属性保存着用户输入的数据，"done"属性可理解为用户输入数据的标签，主要用来对"data"值进行分类。
// 每次用户输入完数据，都要更新缓存，并初始化输入框。

let uniqueId = function () { // 生成10-12位不等的字符串 唯一Id
  return (Number(Math.random().toString().substring(2)) * new Date().getTime()).toString(36).slice(0, -8)
}

function addTodo() {
  work = {
    id: '',
    data: '',
    done: false
  }
  
  newTodo.value = newTodo.value.trim()
  // console.log(newTodo.value)
  if (newTodo.value === '') {
    alert('内容不能为空')
    newTodo.value = ''
    newTodo.focus()
  } else {
    work.id = uniqueId()
    work.data = newTodo.value
    console.log(work)
    todoList.push(work)
    saveData(todoList)
    render()
    newTodo.value = ''
    newTodo.focus()
  }
}



function fnDate() {
  let timeDiv1 = document.getElementById('time1')
  let timeDiv2 = document.getElementById('time2')
  let date = new Date()
  let year = date.getFullYear() //当前年份
  let month = date.getMonth() //当前月份
  let data = date.getDate() //天
  let hours = date.getHours() //小时
  let minute = date.getMinutes() //分
  let second = date.getSeconds() //秒
  let simpleTime = fnW(hours) + ':' + fnW(minute)
  let detailTime =
      year +
      '-' +
      fnW(month + 1) +
      '-' +
      fnW(data) +
      ' ' +
      fnW(hours) +
      ':' +
      fnW(minute) +
      ':' +
      fnW(second)
  timeDiv1.innerHTML = simpleTime
  timeDiv2.innerHTML = detailTime
}

function fnW(str) {
  let num
  str >= 10 ? (num = str) : (num = '0' + str)
  return num
}

