const api_login = "http://localhost:3000/login"
const api_incidentes = "http://localhost:3000/incidentes";
const api_headers = {
    "Content-type": "application/json"
}

let admin = false;

/*  */
let alert_error = `
    <div class="alert alert-danger" role="alert">
        Hubo un error al llamar a la API.
    </div>
`;
let spinner = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
`;

async function adminLogin(e)
{
    e.preventDefault();

    const boton = document.getElementById('botonlogin');
    const mensaje = document.getElementById('mensaje');

    boton.classList.add('disabled');
    mensaje.innerHTML = spinner;

    const usuario = document.getElementById('usuario').value.trim();
    const contra = document.getElementById('contra').value;

    let pedido = fetch(
        api_login,
        {
            method: 'POST',
            headers: api_headers,
            body: JSON.stringify({
                "nombreusuario": usuario,
                "contra": contra
            })
        }
    );

    pedido.then(json => {
        console.log(json);
        mensaje.innerHTML = json;
        boton.classList.remove('disabled');
    });

    pedido.catch(e => {
        mensaje.innerHTML = alert_error;
        boton.classList.remove('disabled');
    });
}

async function paginaIncidentes()
{
    let tabla = document.getElementById("tablaincidentes");
    let num_reportados = document.getElementById("reportados");
    let num_sinresolver = document.getElementById("sinresolver");
    let num_resueltos = document.getElementById("resueltos");

    //Resetear todos los datos
    tabla.innerHTML = `
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    num_reportados.innerHTML = spinner;
    num_sinresolver.innerHTML = spinner;
    num_resueltos.innerHTML = spinner;

    //Llamar a la API
    let pedido = fetch(api_incidentes, { headers: api_headers }).then(response => response.json());

    //Mostrar los datos recibidos
    pedido.then(json => {
        //console.log(json);

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>N.º</th>
                    <th>Ubicación</th>
                    <th>Asunto</th>
                    <th>Fecha y hora</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        let reportados = 0;
        let sinresolver = 0;
        let resueltos = 0;

        //Iterar por cada incidente en la tabla
        for (let incidente of json) {

            let estado = '<span class="badge rounded-pill text-bg-danger">No resuelto</span>';
            if (incidente.resuelto == 1) estado = '<span class="badge rounded-pill text-bg-success">Resuelto</span>';

            tabla.tBodies[0].innerHTML += `
                <td><a href="detalles.html?id=${incidente.id}">${incidente.id}</a></td>
                <td>${incidente.ubicacion}</td>
                <td>${incidente.asunto}</td>
                <td>${incidente.fecha}</td>
                <td>${estado}</td>
            `;

            reportados += 1;
            if (incidente.resuelto == 0) sinresolver += 1;
            if (incidente.resuelto == 1) resueltos += 1;
        }

        num_reportados.innerHTML = reportados;
        num_sinresolver.innerHTML = sinresolver;
        num_resueltos.innerHTML = resueltos;
    });

    //Mostrar si hubo un error
    pedido.catch(() => {
        tabla.outerHTML = alert_error;
        num_reportados.innerHTML = "?";
        num_sinresolver.innerHTML = "?";
        num_resueltos.innerHTML = "?";
    });
}

function obtenerParametro(key)
{
    let address = window.location.search
    let parameterList = new URLSearchParams(address)
    return parameterList.get(key)
}

async function paginaDetalles()
{
    let id = obtenerParametro("id");

    let detalles = document.getElementById("detalles");
    detalles.innerHTML = `
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    
    let pedido = fetch(api_incidentes + `/${id}`, { headers: api_headers }).then(response => response.json());

    pedido.then(incidente => {
        let estado = '<span class="badge rounded-pill text-bg-danger">No resuelto</span>';
        if (incidente.resuelto == 1) estado = '<span class="badge rounded-pill text-bg-success">Resuelto</span>';

        let contenido = `
        <div class="bg-secondary text-light p-5">
            <a href="incidentes.html" class="link-light"><i class="bi bi-arrow-left me-1"></i>Volver</a>
            <h1 class="mt-2">Incidente n.º ${incidente.id}</h1>
            <h5>${estado}</h5>
        </div>
        <div class="m-5">
            <h3>Fecha y hora del reporte</h3>
            <p>${incidente.fecha}</p>
            <h3>Asunto</h3>
            <p>${incidente.asunto}</p>
            <h3>Ubicación</h3>
            <p>${incidente.ubicacion}</p>
            <h3>Detalles</h3>
            <p>${incidente.descripcion}</p>
        </div>
        `;

        detalles.outerHTML = contenido;
    });

    pedido.catch(e => {
        detalles.innerHTML = alert_error;
    });
}