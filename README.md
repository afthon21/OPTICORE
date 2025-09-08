# OPTICORE1

## INSTALACIÓN
  
 1. Instala node.js:
    ### https://nodejs.org/es
     
 2. instala npm:
````
 npm install -g npm
````
 4. Clona el repositorio:
```sh
https://github.com/afthon21/OPTICFLOW1.git
````         
## INICIALIZACIÓN

1. Instala las dependencias:
    ```sh
    npm install vite
    npm install nodemon
    npm install net-snmp
    
3. crear archivos .env
  #### ruta 1: OPTICFLOW1/OPTICFLOW
  
      VITE_API_BASE=http://localhost:3000/api
      VITE_GOOGLE_MAP=AIzaSyAC2fSELr6Sd0xL1A2BN_y8wInwOe59gLo
      VITE_MAP_ID=92b1a70fec4902b3
     
  ### ruta2: OPTICFLOW1/OPTICFLOWAPI

       MONGO_URI=mongodb+srv://alexisym1:N814Jd36kEbP6nFx@cluster0.1vwbcbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      PORT=3000
      HOST=http://localhost
      JWT_SECRET=10912214
      RECOVERY_EMAIL=alexis_ym1@tesch.edu.mx
      APPLICATION_PASSWORD=hwad dvem rfvj wuae
   
Por ultimo debes de inicar el servidor:

Antes de ejecutar el servidor, abre una terminal separada para cada proyecto:
(antes tambien debemos de entrar a la carpeta tanto del protecto como de las carpetas optifiber y optifiberAPI)

    cd OPTICFLOW1

  Carpeta optifiber(terminal dentro del proyecto) nos permitira entrar a la carpeta de optifiver
  
    cd OPTICFLOW
  ```sh  este nos permite correr el servicio
    npm run dev
  ```

 Carpeta optifiberAPI(terminal dentro del proyecto) igualmente la carpeta pero siendo el API
 igualmente entramos a la carpeta en el caso de no estarlo repetiremos el cd fibertrack1 y hacemos los siguientes pasos  
    
    cd OPTICFLOW1
 ```sh  
   cd OPTICFLOWAPI
 ```
 Iniciamos el siguiente servicio
 ````sh
   npm run dev 

