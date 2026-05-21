# Booking App

Aplicación Angular para consultar clases disponibles y reservar cupos. Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli).

## Requisitos

| Herramienta   | Versión utilizada |
|---------------|-------------------|
| Node.js       | 22.x (probado con v22.22.0) |
| Angular CLI   | 18.2.x (dependencia del proyecto: `^18.2.11`) |
| Angular       | 18.2.x |

## Instalación y ejecución

```bash
npm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200/`. Los cambios en el código recargan automáticamente el navegador.

También podés usar el script definido en `package.json`:

```bash
npm start
```

## Arquitectura de componentes

El código se organiza en tres capas principales bajo `src/app/`:

- **`core/`** — Modelos (`BookingModel`, tipos de alerta) y servicios de dominio (`BookingService`), registrados con `providedIn: 'root'`.
- **`shared/ui/`** — Componentes de presentación reutilizables (`LoadingComponent`, `AlertComponent` y variantes de éxito/error).
- **`features/booking/`** — Módulo funcional de reservas:
  - **`booking.component`** — Contenedor de la lista; consume el servicio y muestra estado de carga/error.
  - **`components/booking-item/`** — Ítem de la lista; recibe datos por `input()` y navega al detalle con `RouterLink`.
  - **`pages/booking-detail/`** — Detalle de una clase y acción de reserva.

Las rutas usan **componentes standalone** y **carga diferida** (`loadComponent` / `loadChildren`) para el feature `booking` y sus subrutas (`''` lista, `:id` detalle).

## Estrategia de comunicación

- **Servicio inyectable** — Los contenedores (`BookingComponent`, `BookingDetailComponent`) obtienen datos y ejecutan reservas mediante `inject(BookingService)`. No hay `HttpClient` ni estado global (NgRx, signals store compartido, etc.).
- **RxJS + signals** — El servicio expone `Observable`s; en los componentes se convierten a signals con `toSignal()` para el template. Estados locales (`isLoading`, `showError`, `successReserved`) se manejan con `signal()`.
- **Padre → hijo** — `BookingItemComponent` recibe cada reserva con `input.required<BookingModel>()`; no emite eventos al padre.
- **Routing** — El detalle lee el `id` desde `ActivatedRoute` y encadena la petición al servicio con `switchMap`.

## Simulación de la API

No se usa **json-server** ni un **interceptor HTTP**. La API se simula con un **mock en memoria** dentro de `BookingService`:

- Array privado de reservas en el servicio.
- Métodos `getBookings()` y `getBookingById()` devuelven `Observable`s con `of(...)` y `delay()` para imitar latencia de red (1 s y 500 ms).
- `reserveSpot()` actualiza el array en memoria (decrementa `availableSpots`).

Para integrar un backend real bastaría con reemplazar esas implementaciones por llamadas `HttpClient` sin cambiar la firma pública del servicio ni el uso de `toSignal` en los componentes.

## Otros comandos

| Comando      | Descripción                          |
|-------------|--------------------------------------|
| `ng build`  | Compila el proyecto en `dist/`       |
| `ng test`   | Ejecuta tests unitarios con Karma    |

## Ayuda

Documentación de Angular CLI: `ng help` o [referencia de comandos](https://angular.dev/tools/cli).
