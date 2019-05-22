var APP_ID = 'tQ3d3RGYgscmEC0pfruVB7JW-gzGzoHsz';
var APP_KEY = 'Mtlq41jjx9HHhpyOzOVOhDJ3';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var query = new AV.Query('Message');
query.find()
  .then(
    function(messages){
      let array = messages.map((item)=> item.attributes)
      array.forEach((item)=>{
        let li = document.createElement('li')
        li.innerText = `${item.name}: ${item.content}`
        let messageList = document.querySelector('#messageList')
        messageList.append(li)
      })
    }
  )

let myForm = document.querySelector('#postMessageForm')
myForm.addEventListener('submit', function(e){
  e.preventDefault()
  let name = myForm.querySelector('input[name=name]').value
  let content = myForm.querySelector('input[name=content]').value
  var Message = AV.Object.extend('Message')
  var message = new Message()
  message.save({
    'name': name,
    'content': content
  }).then(function(object) {
    let li = document.createElement('li')
    li.innerText = `${object.attributes.name}: ${object.attributes.content}`
    let messageList = document.querySelector('#messageList')
    messageList.append(li)
    myForm.querySelector('input[name=content]').value = null
    console.log(object)
  })
})


/*
// 创建 TestObject 表
var TestObject = AV.Object.extend('TestObject');
// 在表中创建一行数据
var testObject = new TestObject();
// 保存 words: 'Hello World!' 为数据内容
// 如果保存成功，则运行 alert('')
testObject.save({
  words: 'Hello World!'
}).then(function(object) {
  alert('LeanCloud Rocks!');
})
*/