## Resumen de funciones:
1. `getUserParticipation({ userCode })`: Verifica si el userCode ya tiene una participación registrada en la experiencia actual. Si existe, retorna los detalles; si no, retorna null.

2. `saveUserParticipation({ userCode, checkIn, points })`: Guarda o actualiza una participación. Si no existe una participación previa, crea un nuevo registro; si ya existe, actualiza los detalles.

3. `getAttendeeByUserCode({ userCode })`: Verifica si el userCode está registrado como un Attendee. Si el userCode no está registrado, retorna null.

4. `getAllExperience()`: Obtiene todas las experiencias disponibles para el evento.

5. `getExperienceById({ experienceId })`: Retorna la experiencia asociada a un experienceId específico.

## Explicación detallada

### 1. `getUserParticipation({ userCode })`: 

Parámetros:
- userCode: Obligatorio

Función:
- Obtener la participación de un usuario en una experiencia.

Resultado:
- Objeto de Participación si la encuentra, de lo contrario devuelve `null`.



### 2. `saveUserParticipation({ userCode, checkInAt = new Date().toUTCString(), points = 0 }: SaveParticipationOfUser)`: 

Parámetros:
- userCode: Obligatorio
- checkInAt: Opcional. Si no lo envía, toma la fecha actual.
  - Este valor solo sera asignado cuando es la primera participación, para futuras actualizaciones no sera tomada en cuenta.
- points: Opcional. 
  - Sera tomado en cuenta tanto para la primera participación como para futuras.
  - El valor no suma al anterior, solo reemplaza el valor anterior por el nuevo.

Función:
- Guarda o actualiza una participación. Si no existe una participación previa, crea un nuevo registro; si ya existe, actualiza los detalles.

Resultado:
- Devuelve el id del registro creado o actualizado.


### 3. `getAttendeeByUserCode({ userCode })`

Parámetros:
- userCode: Obligatorio


Función:
- Validar que el código sea de un usuario registrado

Resultado:
- Devuelve el objeto del asistente del evento de evius si lo encuentra, de lo contrario devuelve `null`