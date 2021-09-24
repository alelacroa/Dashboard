// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "xxxxx",
    authDomain: "xxxxx",
    projectId: "xxxxx"
    });

    
    var db = firebase.firestore();

  //Deslogueo
const logout = document.querySelector('#logout');

logout.addEventListener('click', (e) =>{
    e.preventDefault();
    firebase.auth().signOut().then(()=>{
        window.location.href = 'index.html';

    })
});

const checkUsuario = document.querySelector('body')

const loginCheck = user =>{
    if(user){
        checkUsuario.style.display = 'block';
    }else
        checkUsuario.style.display = 'none';
}

firebase.auth()
    .onAuthStateChanged(user =>{
    if(user){
        console.log('loguedo')
        loginCheck(user);
    }else {
        loginCheck(user);
        console.log('deslogueado')
    }
});

//lista de datos

window.onload = function(){
    db.collection("Inventario").onSnapshot(res =>{
        nuevoListado(res)
    })
}
    function nuevoListado(res){
        let miTabla = '<table class="table">'
        miTabla += '<thead class="thead-dark">';
        miTabla += '<tr>';
        //miTabla += '<th scope="col">CODIGO</th>';
        miTabla += '<th scope="col">PRODUCTO</th>';
        miTabla += '<th scope="col">CANTIDAD</th>';
        miTabla += '<th scope="col">PRECIO</th>';
        miTabla += '<th scope="col" style="text-align: center;">Modificar</th>';
        miTabla += '<th scope="col"style="text-align: center;">Eliminar</th>';
        miTabla += '</tr>';
        miTabla += '</thead>';

        res.forEach(callBack => {
            let miFila = callBack.data();
            miTabla += '</tr>';
            //miTabla += '<td>' + callBack.id + '</td>'
            miTabla += '<td>' + miFila.descripcion + '</td>';
            miTabla += '<td>' + miFila.cantidad + '</td>';
            miTabla += '<td>' + miFila.precio + '</td>';
            miTabla += '<td align="center">' + '<button class="btn" onclick="abrirModal(\''+callBack.id+'\')" data-toggle="modal" data-target="#cargarModal" ><i class="fas fa-edit btnEditar"></i></button>' + '</td>';
            miTabla += '<td align="center">' + '<button class="btn"onclick="eliminar(\''+callBack.id+'\')"><i class="far fa-trash-alt btnEliminar"></i></button>' + '</td>';
            miTabla += '</tr>';
        });

        miTabla += '</table>';    


        document.getElementById('listadoProductos').innerHTML = miTabla;

    }

    function abrirModal(id){
        limpiarFormulario();

        if (id == 0){
            document.getElementById('keyModalLabel').innerHTML = "Cargar productos"
        } else {
            document.getElementById('keyModalLabel').innerHTML = "Modificar productos"

            //cargar datos desde el modal
            db.collection("Inventario").doc(id).get().then(res =>{

                document.getElementById('id').value = id;
                document.getElementById('descripcion').value = res.data().descripcion;
                document.getElementById('unidad').value = res.data().cantidad;
                document.getElementById('precio').value = res.data().precio;
            });
        }

    }

    function eliminar(id){
        Swal.fire({
            title: 'Eliminar Producto',
            text: "¿Estás seguro de eliminar el producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            }).then((result) => {
            if (result.isConfirmed) {
                db.collection("Inventario").doc(id).delete().then(() =>{
                    Swal.fire(
                        'Borrado',
                        'Se ha eliminado el producto.',
                        'success'
                        )
                });
                
            }
        })
    }

    function limpiarFormulario (){
        document.getElementById('id').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('unidad').value = '';
        document.getElementById('precio').value = '';

    }

/*
db.collection("Inventario").onSnapshot((querySnapshot) => {
    lista.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().descripcion}`);
        lista.innerHTML += `
        <tr>
            <th scope="row">${doc.id}</th>
            <td>${doc.data().descripcion}</td>
            <td>${doc.data().cantidad}</td>
            <td>${doc.data().precio}</td>
            <td align="center"><button class="btn" data-toggle="modal" data-target="#modificarModal" ><i class="fas fa-edit btnEditar"></i></button></td>
            <td align="center"><button class="btn"><i class="far fa-trash-alt btnEliminar"></i></button></td>
        </tr> `;
    });
});
*/

//cargar datos

function Grabar(){
    let fId = document.getElementById('id').value;
    let fDescripcion = document.getElementById('descripcion').value;
    let fCantidad = document.getElementById('unidad').value;
    let fPrecio = document.getElementById('precio').value;

    if (fDescripcion == ''){
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'El campo Producto no puede estar vacío',
        })
        return;
    }
    if (fCantidad == ''){
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'El campo Cantidad no puede estar vacío',
        })
        return;

    }
    if (fPrecio == ''){
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'El campo Precio no puede estar vacío',
        })
        return;

    }

    if(fId == ''){
        db.collection("Inventario").add({
            id:fId,
            descripcion: fDescripcion,
            cantidad: fCantidad,
            precio: fPrecio
        })
        .then(() => {
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cargado correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch((error) => {
            console.error("Error : ", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al cargar los datos',
    
            })
        });

    }else {
        db.collection("Inventario").doc(fId).update({
            id:fId,
            descripcion: fDescripcion,
            cantidad: fCantidad,
            precio: fPrecio
        })
        .then((docRef) => {
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Modificado correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch((error) => {
            console.error("Error : ", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al cargar los datos',
    
            })
        });


    }

    
}





// api clima
const API_KEY = 'b4f3c4e20653e7a634a9f00a209642a2';

const datosClima = posicion =>{
    const {latitude, longitude } = posicion.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => InfoDatosClima(data))
    
}

const InfoDatosClima = data => {
    console.log(data);
    const infoClima = {
        localidad: data.name,
        temperatura: data.main.temp,
        humedad: data.main.humidity,
        dia: getDate(),
    }
    Object.keys(infoClima).forEach (key =>{
        document.getElementById(key).textContent = infoClima[key];
    });
}

const getDate = ()=> {
    let date = new Date();
    return `${date.getDate()}-${ ('0'+ (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
}
const ubicacion = () => {
    navigator.geolocation.getCurrentPosition(datosClima);
}
