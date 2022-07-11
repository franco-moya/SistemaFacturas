// Aqui van todos las funciones 
let ruta_2 = 'db/gestionarFacturas.php'
let cargarFacturas = document.getElementById("contenedorFacturas")
let resumenFacturas = document.getElementById("contenedorResumen")


let selectProveedores = document.getElementById("select-proveedor")
let selectObras = document.getElementById("select-obra")
let selectCompradores = document.getElementById("select-comprador")
let TablaCompradores = document.getElementById("TablaCompradores")

let FormOrdenar = document.getElementById("ordenar")
FormOrdenar.addEventListener("submit", OrdenarFacturas)

let formularioComprador = document.getElementById("formularioComprador")
formularioComprador.addEventListener("submit",AgregarCompradores)


listarProveedores()
// ListarLasObrasEnSelect()
listarCompradores()

var idObraTemporal

let fmFacturas = document.getElementById("formularioFacturas")
fmFacturas.addEventListener("submit", agregarFacturas)




function objetoFetch(datos) {
    return {
        method: "POST",
        body: datos
    }
}

function agregarFacturas(e) {
    e.preventDefault()

    let datos = new FormData(fmFacturas)
    datos.append("tipoOperacion", "AgregarFacturas")
    datos.append("id_Obra", idObraTemporal)

    fetch(ruta_2, objetoFetch(datos))
        .then(response => response.text())
        .then(data => {
            fmFacturas.reset()
            alert("Se agregó una nueva factura")
            ListarFacturas(idObraTemporal)
        })

}


// Funcion recibe una ruta y un select



function listarProveedores() {
    let datos = new FormData()
    datos.append("tipoOperacion", "listarProveedores")

    fetch(ruta_2, objetoFetch(datos))
        .then(response => response.json())
        .then(data => {
            cargarProveedores(data)
        })
}

function cargarProveedores(arr) {
    selectProveedores.innerHTML = "<option value=''>Seleccione</option>"
    arr.forEach(proveedores => {
        selectProveedores.innerHTML += `<option value=${proveedores["ID_Proveedor"]}>${proveedores["Nombre_Proveedor"]}</option>`
    })
}

function listarCompradores() {
    let datos = new FormData()
    datos.append("tipoOperacion", "listarCompradores")

    fetch(ruta_2, objetoFetch(datos))
        .then(response => response.json())
        .then(data => {
            cargarCompradores(data)
        })
}

function cargarCompradores(arr) {
    selectCompradores.innerHTML = "<option value=''>Seleccione</option>"
    arr.forEach(compradores => {
        selectCompradores.innerHTML += `<option value=${compradores["ID_Comprador"]}>${compradores["Nombre_Comprador"]}</option>`

        TablaCompradores.innerHTML += `
                            <tr>
                                <th scope="row">${compradores["ID_Comprador"]}</th>
                                <td>${compradores["Nombre_Comprador"]}</td>
                            </tr>  
        
        `


    })
}
function AgregarCompradores(e){
    e.preventDefault()
    let datos = new FormData(formularioComprador)
    datos.append("tipoOperacion", "AgregarCompradores")

    fetch(ruta_2,{
        method: "POST",
        body:datos
    })
    .then( respuesta => respuesta.text() ) 
    .then( contenido => {
        if (contenido == "ok") {
            

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Comprador Ingresado',
                showConfirmButton: false,
                timer: 1500
              })
              listarCompradores()      
        }else if(contenido == "Error") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Comprador no Ingresado',
                showConfirmButton: false,
                timer: 1500
              })
        }
            

        
        
    } ) 

}

// function ListarLasObrasEnSelect() {
//     let datos = new FormData()
//     datos.append("tipoOperacion", "ListarLasObras")

//     fetch(ruta_2, objetoFetch(datos))
//         .then(response => response.json())
//         .then(data => {
//             cargarObrasEnSelect(data)
//         })

// }

// function cargarObrasEnSelect(arr) {
//     selectObras.innerHTML = "<option value=''>Seleccione</option>"
//     arr.forEach(obras => {
//         selectObras.innerHTML += `<option value=${obras["ID_Obra"]}>${obras["Nombre_Obra"]}</option>`
//     })
// }

function ListarFacturas(id_Obra) {
    fmFacturas.reset()
    montototal = 0
    i = 0
    cargarFacturas.innerHTML = ``
    let datos = new FormData()
    datos.append("tipoOperacion", "ListarFacturas")
    datos.append("id_Obra", id_Obra)
    fetch(ruta_2, {
        method: "POST",
        body: datos
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(factura => {
                let IVA = IVAFuncion(parseInt(factura["Monto"]))
                let NETO = parseInt(factura["Monto"])
                let Liquido = IVA + NETO
                if (parseInt((factura["N°_Factura"])) > 0) {
                    i++
                }
                else if ((factura["N°_Factura"]) = ``) {
                    i = ``
                }
                if (parseInt((factura["Monto"])) > 0) {
                    montototal = montototal + Liquido
                }
                cargarFacturas.innerHTML += `
                <div class="card mb-3" style="width: 50%;">
                    <div class="card-body">
                        <h4 class="card-title">Factura N°${factura["N°_Factura"]}</h4>
                        <img src="${factura["IMG"].substr(3)}" class="card-img-top my-4" alt="IMG_FACTURA">
                    </div>

                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>Fecha de emision:</b> ${formato_fecha(factura["Fecha_Factura"])}</li>
                        <li class="list-group-item"><b>Proveedor:</b> ${factura["Nombre_Proveedor"]}</li>
                        <li class="list-group-item"><b>Comprador:</b> ${factura["Nombre_Comprador"]}</li>
                        <li class="list-group-item"><b>Monto:</b> ${FormatoNumeros(NETO)}</li>
                        <li class="list-group-item"><b>Monto IVA:</b> ${FormatoNumeros(IVA)}</li>
                        <li class="list-group-item"><b>Monto Total:</b> ${FormatoNumeros(Liquido)}</li>
                        <button id="btnEliminar" class="btn btn-sm btn-danger mt-2" 
                            onclick="EliminarFactura(${factura["N°_Factura"]})">
                                <i class="fas fa-trash-alt"></i>
                        </button>
                    </ul>
                </div>
                `

                resumenFacturas.innerHTML = `
                <div class="card p-3 border border-dark rounded">
                    <div class="card-body">
                        <h5 class="card-title">${factura["Nombre_Obra"]}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Gastos totales: ${FormatoNumeros(montototal)}</li>
                        <li class="list-group-item">Facturas Emitidas: ${i}</li>
                    </ul>
                </div>
                `
            })
        })
    idObraTemporal = id_Obra
    // console.log(idObraTemporal)
}

function ListarFacturasComercio(id_Proveedor) {
    montototal = 0
    i = 0
    resumenFacturas.innerHTML = `
    <div class="card p-3 border border-dark rounded">
        <div class="card-body">
            <h5 class="card-title">Aun no se ingresan facturas</h5>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Gastos totales: $0 </li>
            <li class="list-group-item">Facturas Emitidas: 0</li>
        </ul>
    </div>
    `
    cargarFacturas.innerHTML = ``
    let datos = new FormData()
    datos.append("tipoOperacion", "ListarFacturasComercio")
    datos.append("id_Proveedor", id_Proveedor)
    fetch(ruta_2, {
        method: "POST",
        body: datos
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(factura => {
                let IVA = IVAFuncion(parseInt(factura["Monto"]))
                let NETO = parseInt(factura["Monto"])
                let Liquido = IVA + NETO
                if (parseInt((factura["N°_Factura"])) > 0) {
                    i++
                }
                else {
                    i = 0
                }
                if (parseInt((factura["Monto"])) > 0) {
                    montototal = montototal + Liquido
                }
                cargarFacturas.innerHTML += `
             <div class="card mb-3" style="width: 25%;">
             
                 <div class="card-body">
                     <h4 class="card-title">Factura N°${factura["N°_Factura"]}</h4>
                     <img src="${factura["IMG"].substr(3)}" class="card-img-top my-4" alt="IMG_FACTURA">
                 </div>
                 <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Fecha de emision:</b> ${formato_fecha(factura["Fecha_Factura"])}</li>
                     <li class="list-group-item"><b>Obra:</b> ${factura["Nombre_Obra"]}</li>
                     <li class="list-group-item"><b>Comprador:</b> ${factura["Nombre_Comprador"]}</li>
                     <li class="list-group-item"><b>Monto:</b> ${FormatoNumeros(NETO)}</li>
                     <li class="list-group-item"><b>Monto IVA:</b> ${FormatoNumeros(IVA)}</li>
                     <li class="list-group-item"><b>Monto Total:</b> ${FormatoNumeros(Liquido)}</li>
                     
                 </ul>
             </div>
             `

                resumenFacturas.innerHTML = `
             <div class="card p-3 border border-dark rounded">
                 <div class="card-body">
                     <h5 class="card-title">${factura["Nombre_Proveedor"]}</h5>
                 </div>
                 <ul class="list-group list-group-flush">
                    <li class="list-group-item">Gastos totales: ${FormatoNumeros(montototal)}</li>
                    <li class="list-group-item">Facturas Emitidas: ${i}</li>
                 </ul>
             </div>
             `
            })
        })
}
function EliminarFactura($NFactura) {
    Swal.fire({
        title: '¿Desea eliminar la factura?',
        text: "Los cambios son irreversibles",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let datos = new FormData()
            datos.append("tipoOperacion", "EliminarFactura")
            datos.append("N°_Factura", $NFactura)
            fetch(ruta_2, {
                method: "POST",
                body: datos
            })
                .then(respuesta => respuesta.text())
                .then(contenido => {
                    if (contenido == "Ok") {
                        Swal.fire(
                            'Factura eliminada!',
                            'La factura fue eliminada exitosamente.',
                            'success'
                        )
                        ListarFacturas(idObraTemporal)
                    } else {
                        Swal.fire(
                            'Opss...',
                            'No se pudo eliminar la factura',
                            'error'
                        )
                    }
                })
        }
    })


}
function OrdenarFacturas(e) {
    e.preventDefault();
    cargarFacturas.innerHTML = ""

    let input = document.getElementById("ordenarNumero").value
    let datos = new FormData()
    datos.append("tipoOperacion", "OrdenarFacturas")
    datos.append("N°_Factura", input)

    fetch(ruta_2, {
        method: "POST",
        body: datos
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(factura => {
                let IVA = IVAFuncion(parseInt(factura["Monto"]))
                let NETO = parseInt(factura["Monto"])
                let Liquido = IVA + NETO
                if (parseInt((factura["N°_Factura"])) > 0) {
                    i++
                }
                else {
                    i = 0
                }
                if (parseInt((factura["Monto"])) > 0) {
                    montototal = montototal + Liquido
                }
                cargarFacturas.innerHTML += `
             <div class="card mb-3" style="width: 100%;">
             
                 <div class="card-body">
                     <h4 class="card-title">Factura N°${factura["N°_Factura"]}</h4>
                     <img src="${factura["IMG"].substr(3)}" class="card-img-top my-4" alt="IMG_FACTURA">
                     <p class="card-text">Fecha de emision: ${formato_fecha(factura["Fecha_Factura"])}</p>
                 </div>
                 <ul class="list-group list-group-flush">
                     <li class="list-group-item">Obra: ${factura["Nombre_Obra"]}</li>
                     <li class="list-group-item">Comprador: ${factura["Nombre_Comprador"]}</li>
                     <li class="list-group-item"><b>Monto:</b> ${FormatoNumeros(NETO)}</li>
                     <li class="list-group-item"><b>Monto IVA:</b> ${FormatoNumeros(IVA)}</li>
                     <li class="list-group-item"><b>Monto Total:</b> ${FormatoNumeros(Liquido)}</li>
                     <button id="btnEliminar" class="btn btn-sm btn-danger mt-2" 
                            onclick="EliminarFactura(${factura["N°_Factura"]})">
                                <i class="fas fa-trash-alt"></i>
                        </button>
                     
                 </ul>
             </div>
             `




            })
        })





}
function OrdenarFacturasFechas(e) {
    e.preventDefault();
    cargarFacturas.innerHTML = ""

    let inputDate1 = document.getElementById("fecha1").value
    let inputDate2 = document.getElementById("fecha2").value
    let datos = new FormData()
    datos.append("tipoOperacion", "OrdenarFacturasFechas")
    datos.append(inputDate1)
    datos.append(inputDate2)

    fetch(ruta_2, {
        method: "POST",
        body: datos
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(factura => {
                cargarFacturas.innerHTML += `
                <div class="card mb-3" style="width: 16rem;">
                    <div class="card-body">
                        <h4 class="card-title">Factura N°${factura["N°_Factura"]}</h4>
                        <img src="${factura["IMG"].substr(3)}" class="card-img-top my-4" alt="IMG_FACTURA">
                    </div>

                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>Fecha de emision:</b> ${formato_fecha(factura["Fecha_Factura"])}</li>
                        <li class="list-group-item"><b>Proveedor:</b> ${factura["Nombre_Proveedor"]}</li>
                        <li class="list-group-item"><b>Comprador:</b> ${factura["Nombre_Comprador"]}</li>
                        <li class="list-group-item"><b>Monto:</b> ${FormatoNumeros(factura["Monto"])}</li>
                        <button id="btnEliminar" class="btn btn-sm btn-danger mt-2" 
                            onclick="EliminarFactura(${factura["N°_Factura"]})">
                                <i class="fas fa-trash-alt"></i>
                        </button>
                    </ul>
                </div>
                `


            })
        })

}
function FormatoNumeros(numero) {
    return new Intl.NumberFormat("ES-CL", {
        style: "currency",
        currency: "CLP"

    }).format(numero)
}

function IVAFuncion(numero) {
    resultado = numero * (19 / 100)
    return resultado
}
function CalcularIVA() {
    try {
        let montoinput = document.getElementById("montoFactura")
        b = parseInt(IVAFuncion(montoinput.value)) || 0;

        document.getElementById("montoIVA").value = b;
    }
    catch (e) {
    }
}
function calcularTotal() {
    try {
        let montoinput = document.getElementById("montoFactura")
        var a = parseInt(montoinput.value) || 0,
            b = parseInt(IVAFuncion(montoinput.value)) || 0;
        document.getElementById("montoTotal").value = a + b;
    }
    catch (e) {
    }
}