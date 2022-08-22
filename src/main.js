let work = {}
let todoList = []
let workIndex
const newTodo = document.querySelector('#newTodo')

window.onload = function () {
    render()
    //定时器每秒调用一次fnDate()
    setInterval(function () {
        fnDate()
    }, 1000)
}

//监听回车事件  当输入框获得焦点且回车键被敲击时,调用addTodo()函数
document.addEventListener('keypress', function (e) {
    if (document.activeElement.id === 'newTodo' && e.key === 'Enter') {
        addTodo()
    }
})

//将待做事项列表保存到本地存储中
function saveData(data) {
    localStorage.setItem('myTodoList', JSON.stringify(data))
}

//从本地存储中调用待做列表,当本地存储无对应列表时,返回空数组
function loadData() {
    const record = localStorage.getItem('myTodoList')
    if (record !== null) {
        return JSON.parse(record)
    } else {
        return []
    }
}

//页面渲染 主函数 获取页面需要更新的所有数据,当数据更新时将页面重新渲染
function render() {
    let todo = document.querySelector('.todoList'),
        done = document.querySelector('.doneList'),
        left = document.querySelector('.leftCount'),
        todoString = '',
        doneString = '',
        leftCount = 0
    
    document.querySelector('#newTodo').focus()
    todoList = loadData()
    if(todoList.length===0){            //设置遮罩 当没有待办事项时,显示默认遮罩div,当存在条目时,将遮罩隐藏
        document.querySelector('.mask').style.display='flex'
    }else {
        document.querySelector('.mask').style.display='none'
    }
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
        left.innerHTML = leftCount.toString() + ' items left'
    } else {
        todo.innerHTML = ''
        done.innerHTML = ''
        left.innerHTML = '0 items left'
    }
}

//重绘页面 当事项数据更改时,先存储新列表至本地存储中,然后再对页面进行渲染
function update(todoList) {
    saveData(todoList)
    render()
}

// 随机数函数  生成10-12位不等的字符串作为每一条待做事项的唯一Id
function uniqueId() {
    return (Number(Math.random().toString().substring(2)) * new Date().getTime()).toString(36).slice(0, -8)
}

// 新增待做事项条目
// 创建一个数组对象来保存用户输入的数据，数组的每一项都是一个对象
// 对象的"id"属性保存着用户输入的数据的唯一id,对象的"data"属性保存着用户输入的数据,"done"属性可理解为用户输入数据的标签,主要用于之后对多条数据进行分类。
// 每次用户输入完数据，都要更新缓存，并初始化输入框。
function addTodo() {
    work = {
        id: '',
        data: '',
        done: false
    }
    newTodo.value = newTodo.value.trim()
    if (newTodo.value === '') {
        alert('内容不能为空')
        newTodo.value = ''
        newTodo.focus()
    } else {
        work.id = uniqueId()
        work.data = newTodo.value
        todoList.push(work)
        saveData(todoList)
        render()
        newTodo.value = ''
        newTodo.focus()
    }
}

// 查找该唯一id在todoList中对应的位置 并返回其index值
function seekIndex(seekId) {
    todoList.forEach((e) => {
        if (e.id === seekId) {
            workIndex = todoList.indexOf(e)
        }
    })
}

// 当checkbox被点击时, 更新work对象中的done属性,并且更新todoList中对应的work对象,并更新页面
function check(checkId, checked) {
    const inputContent = document.getElementById(checkId).nextElementSibling.textContent
    work = {id: checkId, data: inputContent, done: checked}
    seekIndex(work.id)
    todoList.splice(workIndex, 1, work)
    update(todoList)
}

// 当删除按钮被点击时,删除todoList中的对应条目,并更新页面.
function remove(closeId) {       //此处一开始定义函数名为close(),但是onclick无法触发, 原因为函数命名与系统库名close冲突
    seekIndex(closeId.substring(5))
    todoList.splice(workIndex, 1)
    update(todoList)
}

// 当数据对象的内容框被双击时对数据条目进行重新编辑, 弹出prompt窗口获取新编辑内容,并更新页面
function edit(inputId) {
    seekIndex(inputId.substring(5))
    const editContent = window.prompt('重新编辑内容', todoList[workIndex].data).trim()
    if (editContent === '') {
        alert('内容不能为空')
    } else {
        todoList[workIndex].data = editContent
        saveData(todoList)
        render()
    }
}

//删除所有数据条目 重置本地存储,并更新页面
function clearAll() {
    localStorage.clear()
    render()
}

//filter方法检索所有已完成的事项并返回一个新数组,新数组不包括任何已完成的对象,并更新页面
function clearDone() {
    todoList = todoList.filter(e =>
        e.done === false
    )
    update(todoList)
}

// 获取当前时间 并设置页面中#time1 #time2 元素的内容
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

// 对时间数据进行处理
function fnW(str) {
    let num
    str >= 10 ? (num = str) : (num = '0' + str)
    return num
}

