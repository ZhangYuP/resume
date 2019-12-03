!function () {
  var view = document.querySelector('section.message')

  var model = {
    init: function () {
      var APP_ID = 'tQ3d3RGYgscmEC0pfruVB7JW-gzGzoHsz'
      var APP_KEY = 'Mtlq41jjx9HHhpyOzOVOhDJ3'
      AV.init({ appId: APP_ID, appKey: APP_KEY })
    },
    // 获取数据
    fetch: function (page = 0, num = 10) {
      var query = new AV.Query('Message');
      return query.skip(num * page).limit(num).find() // Promise 对象
    },
    // 创建数据
    save: function (name, content) {
      var Message = AV.Object.extend('Message')
      var message = new Message()
      return message.save({ // Promise 对象
        'name': name,
        'content': content
      })
    }
  }

  var controller = {
    view: null,
    model: null,
    messageList: null,
    init(view, model) {
      this.view = view
      this.model = model
      this.messageList = view.querySelector('#messageList')
      this.pageList = view.querySelector('#pages')
      this.pages = 0
      this.total = 0
      this.form = view.querySelector('form')
      this.model.init()
      this.loadPages()
      this.loadMessages()
      this.bindEvents()
    },
    loadPages() {
      this.model.fetch(0, 1000).then(messages => {
        this.total = messages.length
        this.pages = this.total % 10 === 0 ? parseInt(this.total / 10) : parseInt(this.total / 10) + 1
        for (let i = 0; i < this.pages; i++) {
          this.showPage(i)
        }
        this.pageList.firstChild.classList.add('active')
      })
    },
    loadMessages(page, num) {
      this.model.fetch(page, num).then(messages => {
        messages.forEach(item => {
          this.showMessage(item)
        })
      })
    },
    bindEvents() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault()
        this.saveMessage()
      })
      this.pageList.addEventListener('click', (e) => {
        if (e.target.nodeName === 'LI') {
          this.pageList.childNodes.forEach(item => {
            item.classList.remove('active')
          })
          e.target.classList.add('active')
          this.removeMessage()

          let page = e.target.innerText - 1
          this.loadMessages(page)
        }
      })
      let myForm = this.form
      let warnings = myForm.getElementsByClassName('warning')
      let input = myForm.querySelector('#name')
      let textarea = myForm.querySelector('#content')
      input.onclick = ()=>{
        warnings[0].style.visibility = 'hidden'
      }
      textarea.onclick = ()=>{
        warnings[1].style.visibility = 'hidden'
      }
    },
    saveMessage() {
      const escapeHTML = str =>
        str.replace(/[&<>'"]/g, tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag))
      let myForm = this.form
      let name = escapeHTML(myForm.querySelector('input[name=name]').value)
      let content = escapeHTML(myForm.querySelector('textarea').value)
      let warnings = myForm.getElementsByClassName('warning')
      if(!name.trim()){
        warnings[0].style.visibility = 'visible'
        return
      }else if(!content.trim()){
        warnings[1].style.visibility = 'visible'
        return
      }
      this.model.save(name, content).then(message => {
        this.total += 1
        if (this.total % 10 !== 1 && this.pageList.lastChild.classList.contains('active')) {
          this.showMessage(message)
        } else {
          if (this.total % 10 === 1) {
            this.showPage(this.pages)
            this.pages += 1
          }
          this.removeMessage()
          this.loadMessages(this.pages - 1)

          this.pageList.childNodes.forEach(item => {
            item.classList.remove('active')
          })
          this.pageList.lastChild.classList.add('active')
        }
        myForm.querySelector('input[name=content]').value = null
      })
    },
    removeMessage() {
      let children = this.messageList.childNodes
      for (let i = children.length - 1; i >= 0; i--) {
        this.messageList.removeChild(children[i])
      }
    },
    showMessage(message) {
      let li = document.createElement('li')
      li.innerHTML = `<b>${message.attributes.name}</b> : ${message.attributes.content}`
      this.messageList.appendChild(li)
    },
    showPage(i) {
      let li = document.createElement('li')
      li.innerText = i + 1
      this.pageList.appendChild(li)
    }
  }

  controller.init(view, model)

}.call()
