-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-09-2026 a las 03:48:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `galloalerta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `nombreusuario` varchar(25) NOT NULL,
  `contra` varchar(50) NOT NULL,
  `suspendido` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id`, `nombre`, `email`, `nombreusuario`, `contra`, `suspendido`) VALUES
(1, 'Admin Principal', 'admin@galloalerta.com', 'admin1234', 'admin12345', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidentes`
--

CREATE TABLE `incidentes` (
  `id` int(11) NOT NULL,
  `asunto` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(50) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `resuelto` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `incidentes`
--

INSERT INTO `incidentes` (`id`, `asunto`, `descripcion`, `ubicacion`, `fecha`, `latitud`, `longitud`, `resuelto`) VALUES
(1, 'Se prendió fuego un arbol', NULL, 'Arana y Tierra del Fuego', '2026-09-22 20:28:55', -34.68701, -58.638295, 1),
(3, 'Bache pronunciado en la calle', 'Hay un bache en la calle, los autos tienen dificultad para pasar.', 'Eva Perón, Chavarría', '2026-09-22 20:30:39', NULL, NULL, 1),
(5, 'Cables de alta tension caídos', 'Hay cables de alta tensión caídos en la vereda tras la tormenta con chispas. Peligro para los peatones.', 'Av. Colón y Catamarca', '2026-09-23 02:11:05', -34.7076, -58.427523, 1),
(12, 'Semáforo intermitente', 'Un semáforo está en mal funcionamiento. Hay peligro de choque en hora pico.', 'Av. Rivadavia y Belgrano', '2026-09-23 19:18:51', -34.649186, -58.62109, 1),
(21, 'hay un arbol caido', NULL, 'Int. Agüero y Lanús', '2026-09-24 16:38:20', -34.666836, -58.615692, 0),
(24, 'Se rompió una ventana', NULL, 'Av. San Martín y Belgrano', '2026-09-24 16:45:13', -34.577909, -58.537629, 0),
(25, 'Corte de luz', NULL, 'Almirante Brown y Uruguay', '2026-09-24 19:37:47', -34.650588, -58.617346, 1),
(26, 'Luminaria rota sobre la vereda', NULL, 'Juan José Paso & Julián Pérez', '2026-09-24 21:47:23', -34.651623, -58.607171, 0),
(27, 'Prenden fuego ramas', 'Están prendiendo fuego unas ramas, los cables de alumbrado generan chispazos.', 'Clinica Modelo de Morón', '2026-09-24 22:36:48', -34.6507461, -58.6170846, 1),
(28, 'Cables electricos al aire', NULL, 'Almirante Brown y San Martín', '2026-09-24 22:41:23', -34.650407, -58.622688, 0),
(29, 'Se quemó una luminaria', NULL, '9 de Julio y Santa Fé', '2026-09-24 22:46:09', -34.655827, -58.618595, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`nombreusuario`);

--
-- Indices de la tabla `incidentes`
--
ALTER TABLE `incidentes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `incidentes`
--
ALTER TABLE `incidentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
