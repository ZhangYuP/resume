!function(){
  let weixin = document.getElementById('weixin')
  let code = weixin.lastElementChild
  weixin.addEventListener('click', ()=>{
    code.classList.add('active')
    document.addEventListener('click', () => {
      code.classList.remove('active')
    })
  })
  weixin.addEventListener('click', (e)=>{
    e.stopPropagation()
  })

}.call()
