# FIBERTRACK

## INSTALACIÓN
  
 1. Instala node.js:
    ### https://nodejs.org/es
     
 2. instala npm:
     ### npm install -g npm

 3. Clona el repositorio:

<https://github.com/EQUIPOFIBERTRACK/FIBERTRACK1.git>
         
## INICIALIZACIÓN

1. Instala las dependencias:
    ```sh
    npm install
    npm instal vite
    npm install nodemon
    
3. crear archivos .env
  #### ruta 1: FIBERTRAC1/otifiber
      VITE_API_BASE=http://localhost:3000/api
      VITE_GOOGLE_MAP=AIzaSyAC2fSELr6Sd0xL1A2BN_y8wInwOe59gLo
      VITE_MAP_ID=92b1a70fec4902b3
     
  ###ruta2: FIBERTRAC1/otifiberAPI### (en el apartado de MONGO_URL va tu url de tu usuario de mongo compaz)

      MONGO_URI=mongodb+srv://adrianma:123456adrian@cluster0.wrgxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      PORT=3000
      HOST=http://localhost
      JWT_SECRET=12345678
      RECOVERY_EMAIL=superraikage@gmail.com
      APPLICATION_PASSWORD=srxd vinf mwbw xwhr

         
Por ultimo debes de inicar el servidor:

Antes de ejecutar el servidor, abre una terminal separada para cada proyecto:
  Carpeta optifiber(terminal dentro del proyecto)
  
    cd optifiber
    npm run devs

   Carpeta optifiberAPI(segunda terminal dentro del proyecto)
  
    cd optifiberAPI
    npm run dev 

   #### ***Carpete optifiberAPI:***
     cd optifiberAPI
     npm run dev
   

