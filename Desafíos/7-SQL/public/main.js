const socket = io();

const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
});

let formProducts = document.getElementById("productForm");
let formMessages = document.getElementById("messageForm");

formProducts.addEventListener('submit', (event) => {
    event.preventDefault();
    const product = {
        title: document.querySelector('[name="title"]').value,
        price: document.querySelector('[name="price"]').value,
        thumbnail: document.querySelector('[name="thumbnail"]').value
    }
    formProducts.reset();
    socket.emit('newProduct', product);
})

formMessages.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = {
        author: document.querySelector('[name="mail"]').value,
        text: document.querySelector('[name="message"]').value,
        date: new Date().toLocaleString().replace(',', '')
    }
    socket.emit('newMessage', message);
    document.querySelector('[name="message"]').value = '';
})




socket.on('products', data => {
    let html;
    if (data.length > 0) {
        html = data.map(product => {
            return `<tr>
                        <td>${product.title}</td>
                        <td> ${formatterPeso.format(product.price)}</td>
                        <td><img style="width: 60px" src="${product.thumbnail}" alt="${product.title}"></td>
                    </tr>`
        })
            .join(" ")
    } else {
        html = `
                <tr>
                    <td scope="row" colspan="4" style="text-align:center;">HO HAY PRODUCTOS</td>
                </tr>`;

    }
    document.getElementById("tbody").innerHTML = html;
});

socket.on('messages', data => {
    let html;
    if (data.length > 0) {
        html = data.map(
            (e, i) => `
            <div>
                <strong style="color: blue;">${e.author}</strong>
                <strong style="color: brown;">[${e.date}]:</strong>
                <em style="color: green">${e.text}</em>
            </div>
        `
        )
            .join(" ");
        document.getElementById("mensajes").innerHTML = html;
    }
});