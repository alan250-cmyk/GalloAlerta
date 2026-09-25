{
    /* Navbar */

    let botones = `
        <a class="btn btn-danger" href="login.html">
            <i class="bi bi-box-arrow-in-right me-1"></i>
            Admin
        </a>
    `;

    if (admin != null) botones = `
        <div class="d-flex align-items-center gap-2">
            <span class="badge rounded-pill text-bg-light">${admin.nombre}</span>
            <a class="btn btn-danger" href="admins.html">
                <i class="bi bi-person-fill-gear me-1"></i>
                Gestionar admins
            </a>
            <button class="btn btn-danger" onclick="cerrarSesion()">
                <i class="bi bi-box-arrow-right me-1"></i>
                Cerrar sesión
            </button>
        </div>
    `;

    let navbar = `
    <nav class="navbar bg-danger sticky-top p-2">
        <div class="container-fluid">
            <a class="navbar-brand text-light" href="inicio.html">
                <img src="img/logo_white.png" alt="Logo" width="30" height="24"
                    class="d-inline-block align-text-top object-fit-contain me-1">
                Gallo Alerta
            </a>
            ${botones}
        </div>
    </nav>
    `;


    let footer = `
    <div class="container">
        <footer class="py-3 my-4">
            <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                <li class="nav-item"><a href="inicio.html" class="nav-link px-2 text-body-secondary">Inicio</a></li>
                <li class="nav-item"><a href="incidentes.html" class="nav-link px-2 text-body-secondary">Incidentes</a>
                </li>
                <li class="nav-item"><a href="reportar.html" class="nav-link px-2 text-body-secondary">Reportar
                        incidente</a></li>
                <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Normas</a></li>
                <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Términos y condiciones</a>
                </li>
                <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Política de privacidad</a>
                </li>
            </ul>

            <div class="d-flex justify-content-between gap-3">
                <p class="text-body-secondary">© 2026 Grupo Salamanca. Todos los derechos reservados.</p>
                <div class="d-flex gap-3">
                    <a href="#"><i class="bi bi-facebook fs-3"></i></a>
                    <a href="#"><i class="bi bi-instagram fs-3"></i></a>
                    <a href="#"><i class="bi bi-twitter-x fs-3"></i></a>
                </div>
            </div>
        </footer>
    </div>
    `;

    document.body.innerHTML = navbar + document.body.innerHTML + footer;
}