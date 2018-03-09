class Libro {
    constructor(titulo, autor, isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

class UI {

    addLibro(libro) {
        const lista = document.querySelector('#book-list');
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${libro.titulo}</td> 
                          <td>${libro.autor}</td> 
                          <td>${libro.isbn}</td>
                          <td><a href="#" class="delete">X</a></td>`;
        lista.appendChild(fila);
    }

    limpiarCampos() {
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }

    showAlert(msg, className) {
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));
        container.insertBefore(div, form);
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);

    }

    eliminarLibro(target) {
        if (target.className === 'delete') {
            if (confirm('Esta Seguro?')) {
                target.parentElement.parentElement.remove();
                this.showAlert('Libro Removido', 'success');
            }
        }
    }
}

class Store {
    static getLibros() {
        let libros;
        if (localStorage.getItem('libros') === null) {
            libros = [];
        } else {
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static displayLibros() {
        const libros = Store.getLibros();
        libros.forEach(element => {
            const ui = new UI();
            ui.addLibro(element);
        });
    }

    static addLibro(libro) {
        const libros = Store.getLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static borrarLibro(isbn) {
        const libros = Store.getLibros();
        libros.forEach((element, index) => {
            if (element.isbn === isbn) {
                libros.splice(index, 1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
    }
}

document.addEventListener('DOMContentLoaded', Store.displayLibros());

document.querySelector('#book-form').addEventListener('submit', function(e) {
    const titulo = document.querySelector('#titulo').value,
        autor = document.querySelector('#autor').value,
        isbn = document.querySelector('#isbn').value;
    const libro = new Libro(titulo, autor, isbn);

    const ui = new UI();
    if (isValid(libro)) {
        ui.addLibro(libro);
        Store.addLibro(libro);
        ui.limpiarCampos();
        ui.showAlert('Libro Añadido', 'success');

    } else {
        ui.showAlert('Por favor complete todos los campos', 'error');
    }
    e.preventDefault();
});

document.querySelector('#book-list').addEventListener('click', function(e) {
    const ui = new UI();
    ui.eliminarLibro(e.target);
    Store.borrarLibro(e.target.parentElement.previousElementSibling.textContent);
    e.preventDefault();
})

function isValid(libro) {
    if (libro.titulo === '' || libro.autor === '' || libro.isbn === '') {
        return false;
    }
    return true
}