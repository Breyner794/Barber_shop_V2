<div align="left" style="position: relative;">
<img src="https://img.icons8.com/?size=512&id=55494&format=png" align="right" width="30%" style="margin: -20px 0 0 20px;">
<h1>BARBER_SHOP_V2 - Estructura <code>src/</code></h1>
</div>
<br clear="right">

## Índice Rápido

- [Descripción General](#descripción-general)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
  - [Índice de Carpetas y Archivos](#índice-de-carpetas-y-archivos)
- [Flujo de Reserva](#flujo-de-reserva)
- [Módulos Destacados](#módulos-destacados)
- [Otros Archivos](#otros-archivos)

---

## Descripción General

Este documento describe la estructura y los módulos principales de la carpeta `src/` del proyecto **Barber_shop_V2**. Aquí se encuentran todos los componentes, páginas, hooks, contextos y utilidades que conforman la lógica y la interfaz del frontend.

---

## Características

- Arquitectura modular y escalable.
- Componentes reutilizables para UI y lógica de negocio.
- Contextos globales para autenticación y reservas.
- Hooks personalizados.
- Flujo completo de reserva de turnos.
- Panel de administración (Dashboard) para usuarios, servicios, sedes y reservas.
- Skeletons para mejorar la experiencia de carga.
- Separación clara entre vistas, componentes y lógica de negocio.

---

## Estructura del Proyecto

```sh
src/
├── App.jsx
├── index.css
├── main.jsx
│
├── api/
│   └── services.js
│
├── assets/
│   └── ... (imágenes y recursos estáticos)
│
├── components/
│   ├── Alert.jsx
│   ├── Contact.jsx
│   ├── ErrorComponent.jsx
│   ├── Footer.jsx
│   ├── Gallery.jsx
│   ├── Header.jsx
│   ├── InlineError.jsx
│   ├── ProgressBar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RedirectNotice.jsx
│   ├── Services.jsx
│   ├── SocialMedia.jsx
│   ├── Spinner.jsx
│   ├── Team.jsx
│   ├── Dashboard/
│   │   ├── BookingCard.jsx
│   │   ├── BookingForm.jsx
│   │   ├── BookingsModule.jsx
│   │   ├── DashboardOverview.jsx
│   │   ├── ProfileModal.jsx
│   │   ├── ServiceForm.jsx
│   │   ├── ServicesModule.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SiteForm.jsx
│   │   ├── SiteModule.jsx
│   │   ├── UserFormModal.jsx
│   │   ├── UsersModule.jsx
│   │   ├── WalkinForm.jsx
│   │   └── Availability/
│   │       ├── BarberSelector.jsx
│   │       ├── CalendarAndExceptionsView.jsx
│   │       └── WeeklyTemplateView.jsx
│   │   └── ChangesPassword/
│   │       └── ChangePasswordModal.jsx
│   └── Skeleton/
│       ├── BarbersScreenSkeleton.jsx
│       ├── ConfirmationScreenSkeleton.jsx
│       ├── DateTimeScreenSkeleton.jsx
│       ├── ServiceScreenSkeleton.jsx
│       ├── SiteScreenSkeleton.jsx
│       ├── SkeletonButtonGroup.jsx
│       ├── SkeletonButtons.jsx
│       ├── SkeletonCard.jsx
│       ├── SkeletonDateButton.jsx
│       ├── SkeletonForm.jsx
│       ├── SkeletonHorizontalCard.jsx
│       ├── SkeletonSummary.jsx
│       ├── SkeletonTimeSlot.jsx
│       └── TimeSlotsGridSkeleton.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── BookingContext.jsx
│
├── data/
│   └── mockData.js
│
├── hook/
│   └── useOnClickOutside.js
│
├── pages/
│   ├── CheckReservationPage.jsx
│   ├── Dashboard.jsx
│   ├── Faq.jsx
│   ├── home.jsx
│   ├── LoginPage.jsx
│   ├── Not_Fount.jsx
│   └── Dashboard/
│       └── AvailabilityModule.jsx
│
└── screens/
    ├── BarberScreen.jsx
    ├── BookingSuccess.jsx
    ├── ConfirmationScreen.jsx
    ├── DateTimeScreen.jsx
    ├── ServiceScreen.jsx
    └── SiteScreen.jsx
```

---

### Índice de Carpetas y Archivos

#### `api/`
- **services.js**: Lógica centralizada para llamadas a la API (servicios, usuarios, reservas, sedes, etc).

#### `assets/`
- Imágenes y recursos estáticos (SVG, PNG, etc).

#### `components/`
- **Componentes reutilizables** para la UI y lógica de negocio.
- **Dashboard/**: Módulos para la administración (usuarios, servicios, sedes, reservas, disponibilidad, etc).
  - **Availability/**: Gestión de disponibilidad de barberos.
  - **ChangesPassword/**: Modal para cambio de contraseña.
- **Skeleton/**: Componentes de "loading skeleton" para mejorar la experiencia de carga.

#### `context/`
- **AuthContext.jsx**: Contexto global de autenticación.
- **BookingContext.jsx**: Contexto global para el flujo de reservas.

#### `data/`
- **mockData.js**: Datos de ejemplo/mock para desarrollo o pruebas.

#### `hook/`
- **useOnClickOutside.js**: Hook personalizado para detectar clics fuera de un elemento.

#### `pages/`
- **Vistas principales** de la aplicación (Home, Login, Dashboard, FAQ, etc).
- **Dashboard/**: Módulos de página específicos para el dashboard (ej: disponibilidad).

#### `screens/`
- **Pantallas del flujo de reserva**: Selección de servicio, sede, barbero, fecha/hora, confirmación, etc.

---

## Flujo de Reserva

1. **Seleccionar Servicio**  
   `screens/ServiceScreen.jsx`
2. **Seleccionar Sede**  
   `screens/SiteScreen.jsx`
3. **Seleccionar Barbero**  
   `screens/BarberScreen.jsx`
4. **Seleccionar Fecha y Hora**  
   `screens/DateTimeScreen.jsx`
5. **Confirmación**  
   `screens/ConfirmationScreen.jsx`
6. **Reserva Exitosa**  
   `screens/BookingSuccess.jsx`

---

## Módulos Destacados

- **Gestión de Usuarios**: `components/Dashboard/UsersModule.jsx`
- **Gestión de Servicios**: `components/Dashboard/ServicesModule.jsx`
- **Gestión de Sedes**: `components/Dashboard/SiteModule.jsx`
- **Gestión de Reservas**: `components/Dashboard/BookingsModule.jsx`
- **Panel de Control**: `components/Dashboard/DashboardOverview.jsx`

---

## Otros Archivos

- **Estilos globales**: `index.css`
- **Punto de entrada**: `main.jsx`, `App.jsx`

---