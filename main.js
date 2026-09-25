const api_login = "http://localhost:3000/login"
const api_incidentes = "http://localhost:3000/incidentes";
const api_headers = {
    "Content-type": "application/json"
}
let admin = JSON.parse(sessionStorage.getItem("galloalerta_admin"));

let alert_error = `
    <div class="alert alert-danger" role="alert">
        Hubo un error al llamar a la API de Gallo Alerta. Inténtelo de nuevo más tarde.
     </div>
`;
let spinner = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
`;

// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-24, License - CC BY-SA 4.0
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function reportarIncidente(e)
{
    e.preventDefault();

    const boton = document.getElementById("boton");
    const mensaje = document.getElementById('mensaje');
    const formulario = document.getElementsByTagName('form')[0];

    boton.classList.add('disabled');
    mensaje.innerHTML = spinner;

    const asunto = document.getElementById('asunto').value;
    const descripcion = document.getElementById('detalles').value;
    const ubicacion = document.getElementById('lugar').value;

    let pedido = fetch(
        api_incidentes,
        {
            method: 'POST',
            headers: api_headers,
            body: JSON.stringify({
                "asunto": asunto,
                "descripcion": descripcion,
                "ubicacion": ubicacion
            })
        }
    );

    pedido.then(async json => {
        document.body.removeAttribute(mensaje);
        formulario.outerHTML = `
        <div class="alert alert-success" role="alert">
            Su incidente fue registrado exitosamente. En instantes será redirigido a la página de incidentes.
        </div>
        `;
        await sleep(1500);
        window.location.replace("incidentes.html");
    });

    pedido.catch(e => {
        mensaje.innerHTML = alert_error;
        boton.classList.remove('disabled');
    });
}

async function adminLogin(e)
{
    e.preventDefault();

    const boton = document.getElementById('botonlogin');
    const mensaje = document.getElementById('mensaje');
    const formulario = document.getElementsByTagName('form')[0];

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

    pedido.then(data => data.json().then(async json => {
        if (json.token != null)
        {
            mensaje.outerHTML = ``;
            formulario.outerHTML = `
            <div class="alert alert-success" role="alert">
                Sesión iniciada con éxito. En instantes será redirigido a la página de incidentes.
            </div>
            `;
            admin = json;
            sessionStorage.setItem("galloalerta_admin", JSON.stringify(admin));

            await sleep(1500);
            window.location.replace("incidentes.html");
        }
        else
        {
            mensaje.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${json.message}
                </div>
            `;
            boton.classList.remove('disabled');
        }
    }));

    pedido.catch(e => {
        mensaje.innerHTML = alert_error;
        boton.classList.remove('disabled');
    });
}

function cerrarSesion()
{
    sessionStorage.removeItem('galloalerta_admin');
    window.location.reload();
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
        let columnas = `
            <th>N.º</th>
            <th>Ubicación</th>
            <th>Asunto</th>
            <th>Fecha y hora</th>
            <th>Estado</th>
        `;
        if (admin != null) columnas += `<th>Acciones</th>`

        tabla.innerHTML = `
            <thead>
                <tr>
                    ${columnas}
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
            if (incidente.resuelto) estado = '<span class="badge rounded-pill text-bg-success">Resuelto</span>';

            let filas = `
                <td><a href="detalles.html?id=${incidente.id}">${incidente.id}</a></td>
                <td>${incidente.ubicacion}</td>
                <td>${incidente.asunto}</td>
                <td>${incidente.fecha}</td>
                <td>${estado}</td>
            `;

            if (admin != null)
            {
                let boton_resolver = `
                    <button class="btn btn-success">
                        <i class="bi bi-clipboard2-check-fill"></i>
                    </button>
                `;
                if (incidente.resuelto) boton_resolver = `
                    <button class="btn btn-outline-secondary" disabled>
                        <i class="bi bi-clipboard2-check-fill"></i>
                    </button>
                `;
                filas += `
                    <td>
                        <div class="d-flex gap-1 flex-wrap">
                            <button class="btn btn-danger">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                            ${boton_resolver}
                        </div>
                    </td>
                `;
            }

            tabla.tBodies[0].innerHTML += filas;

            if (incidente.latitud != null && incidente.longitud != null)
            {
                let color = '#c00000';
                if (incidente.resuelto) color = '#00a000';

                L.circleMarker([incidente.latitud, incidente.longitud], {
                    color: 'white',
                    fillColor: color,
                    fillOpacity: 1,
                    radius: 7.5
                }).addTo(map).bindPopup(`
                    <span class="d-flex align-content-center gap-1"><b>Incidente n.° ${incidente.id}</b>${estado}</span>
                    ${incidente.asunto}
                    <br>
                    <span class="text-secondary">${incidente.ubicacion}</span>
                    `);
            }

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
    detalles.innerHTML = spinner;
    
    let pedido = fetch(api_incidentes + `/${id}`, { headers: api_headers }).then(response => response.json());

    pedido.then(incidente => {
        if (incidente.message)
        {
            detalles.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${incidente.message}
                </div>
            `;
                return;
        }

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