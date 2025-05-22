# optifiberAPI
Api para la construccion del Front les intentare explicar lo mejor que pueda el como usarla.

## Rutas de la api
* /auth
* /client
* /pay
* /tickey
* /document

Para todas las rutas se dividen de la misma forma para cada accion que se quiera realizar a execepcion de la ruta auth donde cambia.

### Ruta auth
* /login
* /register

### Resto de ruta
* /new  --- Crea una nueva coleccion sin nececidad del id
* /all --- Realiza una busqueda de todas las colecciones
* /view/:id --- Muestra una unica coleccion por id
* /new/:id --- Crea una nueva coleccion por id 
* /all/:id --- Muestra todas las colecciones de un solo id
* /edit/:id ---Edita al id mandado

### Ejemplo de una ruta para una peticion
> localhost:4000/api/client/new

### Ejemplo de los casos que piden id.
> Usarlo con el id de un cliente que se selecciono si se quiere añadir un nuevo documento a ese cliente, ver todos los tickets que el cliente tiene o todos los pagos que tiene.

Todas las rutas a excepción de la ruta "/auth" requieren de un token el cual se genera mediante el logueo del administrador. Tener esto en cuenta cunado se esten haciendo las pruebas desde el front

NO USAR LA RUTA DE EDIT AUN ESTOY HACIENDO PRUEBAS PARA VARIOS ESCENARIOS DISTINTOS

## Manejo de las imagenes 

Las imagenes generan una ruta la cual se puede acceder por medio del navegador.
> localhost:4000/api/public/source/"nombre-del-archivo.jpg"

Si se quiere manejar una imagen se debe de usar la ruta que se genera y se guarda en la db no usar el path de la imagen. La ruta no requiere de autenticacion para poder acceder a ella asi que no deberia causar problemas.

Las imagenes se guardan dentro de la carpeta del proyecto en la carpeta llamada storage, de momento solo acepta imagenes, planeo hacer el cambio para aceptar tambien pdf y se guarden en una carpeta distinta.

## Manejo de la ruta 'edit'
Esta ruta se usa para editar campos que sean necesarios hago esta parte para aclarar como deben editar los numero de telefono ya que estos estan definidos como un array dentro de la db
<<<<<<< HEAD
> {"PhoneNumber": 5931015440, "PhoneNumberIndex": 1}

Este es el envio de datos que deben de manejar en caso de quere editar un numero ya existente, tendran que obtener su posicion dentro del array y mandarlo para que asi se pueda editar.

> {"PhoneNumber": 5931015440}

Si solo se desea añadir un nuevo campo basta con mandarlo
=======

> {"PhoneNumber": 5931015440,"PhoneNumberIndex": 1}
Este es el envio de datos que deben de manejar en caso de quere editar un numero ya existente, tendran que obtener su posicion dentro del array y mandarlo para que asi se pueda editar.

> {"PhoneNumber": 5931015440}
Si solo se desea añadir un nuevo campo basta con mandarlo
>>>>>>> 3f070f6836234d117a902d7ad5714c94d71cc7ee
