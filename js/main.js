const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', ()=> {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e =>{
    addCarrito(e)
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

const fetchData = async ()=> {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('p').textContent = producto.titulo
        templateCard.querySelector('span').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.imagen)
        templateCard.querySelector('#em').textContent =  producto.descripcion 
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        titulo: objeto.querySelector('p').textContent,
        precio: objeto.querySelector('span').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito();
}

const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.add-image').dataset.id = producto.id
        templateCarrito.querySelector('.garbage-image').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce( (acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce( (acc, {cantidad, precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        pintarCarrito()
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your basket was successfully deleted',
            showConfirmButton: false,
            timer: 1500
          })
    })
    const pagarCarrito = document.getElementById('pagar-carrito')
    pagarCarrito.addEventListener('click',() => {
        carrito = {}
        pintarCarrito()
        Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
    })

}

const btnAccion = e => {
    console.log(e.target);
    if(e.target.classList.contains('add-image')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
        Toastify({
            text: "Agreaste un libro a tu canasta",
            duration: 3000
            }).showToast();
    }
    if(e.target.classList.contains('garbage-image')){
       const producto = carrito[e.target.dataset.id]
       producto.cantidad--
       if(producto.cantidad === 0){
        delete carrito[e.target.dataset.id] 
       }
       pintarCarrito()
       Toastify({
        text: "Eliminaste un libro a tu canasta",
        duration: 3000
        }).showToast();
    }
    e.stopPropagation()
}

document.addEventListener('keyup', e =>{
    if (e.target.matches("#buscadorInput")){
        if (e.key ==="Escape")e.target.value = ""
        document.querySelectorAll(".cardsInput").forEach(libro =>{
            libro.textContent.toLowerCase().includes(e.target.value.toLowerCase())
              ?libro.classList.remove("filtro")
              :libro.classList.add("filtro")
        })
    }
  })

// const addButton = document.getElementById('addButton')
//   addButton.addEventListener('click',() => {
//         Swal.fire(
//             'Good job!',
//             'You clicked the button!',
//             'success'
//           )
//     })
