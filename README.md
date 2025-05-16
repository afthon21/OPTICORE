# FIBERTRACK

## INSTALACIÓN
  
 1. Instala node.js:
    ### https://nodejs.org/es
     
 2. instala npm:
````
 npm install -g npm
````
 4. Clona el repositorio:
```sh
https://github.com/EQUIPOFIBERTRACK/FIBERTRACK1.git
````         
## INICIALIZACIÓN

1. Instala las dependencias:
    ```sh
    npm instal vite
    npm install nodemon
    
3. crear archivos .env
  #### ruta 1: FIBERTRAC1/otifiber
  
      VITE_API_BASE=http://localhost:3000/api
      VITE_GOOGLE_MAP=AIzaSyAC2fSELr6Sd0xL1A2BN_y8wInwOe59gLo
      VITE_MAP_ID=92b1a70fec4902b3
     
  ### ruta2: FIBERTRAC1/otifiberAPI (en el apartado de MONGO_URL va tu url de tu usuario de mongo compaz)

      MONGO_URI=mongodb+srv://adrianma:123456adrian@cluster0.wrgxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      PORT=3000
      HOST=http://localhost
      JWT_SECRET=12345678
      RECOVERY_EMAIL=superraikage@gmail.com
      APPLICATION_PASSWORD=srxd vinf mwbw xwhr
   
Por ultimo debes de inicar el servidor:

Antes de ejecutar el servidor, abre una terminal separada para cada proyecto:
(antes tambien debemos de entrar a la carpeta tanto del protecto como de las carpetas optifiber y optifiberAPI)

    cd FIBERTRACK1

  Carpeta optifiber(terminal dentro del proyecto) nos permitira entrar a la carpeta de optifiver
  
    cd optifiber
  ```sh  este nos permite correr el servicio
    npm run dev
  ```

 Carpeta optifiberAPI(terminal dentro del proyecto) igualmente la carpeta pero siendo el API
 igualmente entramos a la carpeta en el caso de no estarlo repetiremos el cd fibertrack1 y hacemos los siguientes pasos  
    
    cd FIBERTRACK1
 ```sh  
   cd optifiberAPI
 ```
 Iniciamos el siguiente servicio
 ````sh
   npm run dev 

