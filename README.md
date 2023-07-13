<h1 align="center">TFT Francisco Javier Domínguez Suárez 🌏📷</h1>

En este repositorio se encuentra gran parte del código desarrollado por el estudiante Francisco Javier Domínguez Suárez durante su Trabajo Fin de Grado. En este trabajo se desarrollaron un conjunto de funcionalidades en un sistema de monitorización de cámaras PTZ desplegado por la empresa QUALITAS ARTIFICIAL INTELLIGENCE AND SCIENCE(QAISC). 

## Funcionalidades ✔

- Grabación de eventos en el ámbito costero, haciendo uso de rutinas predefinidas que enfocan a distintas posiciones.
- Visualización de los eventos grabados por el usuario.
- Galerías de imágenes y videos asociadas a cada evento con filtros de búsqueda.
- Carrusel de imágenes de eventos.
- Nuevo control manual de las cámaras PTZ.
- Nuevo movimiento de cámara que permite desplazarse a un sector de la imagen y hacer el zoom correspondiente a partir de un recorte sobre el streaming del control manual.

## Tecnologías 💻
- Angular
- Angular Material
- Node JS
- Typescript

## Estructura 🏢
Este código pertenece al módulo creado durante el trabajo, denominado "Events". Dicho módulo contiene una carpeta de componentes, modelos(interfaces de Typescript), y servicios. Los elementos contenidos en estas carpetas fueron desarrollados durante el proyecto con el objetivo de realizar las funcionalidades previamente mencionadas. Algunos de los componentes más destacables de este proyecto son el componente [events](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/tree/main/components/events) que muestra la lista de eventos del usuario, el componente [scene-view](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/tree/main/components/scene-view) que muestra los archivos referentes a una posición incluida en un evento, el componente [event-form](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/tree/main/components/scene-form) que permite crear eventos desde la interfaz del sistema y por último los componentes [camara-control-v2](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/tree/main/components/camera-control-v2) y [cropper](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/tree/main/components/cropper) que se integran para realizar el nuevo tipo de movimiento de las cámaras. En cuanto a los servicios se han realizado aportes especialmente en el servicio [task](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/blob/main/services/task.service.ts) y [camera-control](https://github.com/javierdominguezsuarez/TFT-Francisco-Javier-Dominguez-Suarez/blob/main/services/camera-control.service.ts).

## Autor 👨‍🎓

**Francisco Javier Dominguez Suarez**

* Github: [@javidominguezsuarez](https://github.com/javidominguezsuarez)
* LinkedIn: [@Francisco Javier Domínguez Suárez](https://www.linkedin.com/in/francisco-javier-dom%C3%ADnguez-su%C3%A1rez-b309ba199/)

## Colaboradores 💪
**QAISC**
* Web: [Qualitas Artificial Intelligence and Science](http://qaisc.com/)
* LinkedIn: [@Qualitas Artificial Intelligence and Science](https://www.linkedin.com/company/qualitas-artificial-intelligence-science/)

**ULPGC**
* Web: [Universidad de las Palmas de Gran Canaria](https://www.ulpgc.es/)
* LinkedIn: [Universidad de las Palmas de Gran Canaria](https://www.linkedin.com/school/universidad-de-las-palmas-de-gran-canaria/?originalSubdomain=es)

## Licencia de uso 📋
Este código se ha realizado en un ámbito empresarial, por lo que aun formando parte de un Trabajo Fin de Grado, se ruega no compartir bajo ningún concepto y no hacer ningún uso de el mismo, salvo los que se comprendan en el ámbito de las actividades de evaluación relacionadas con su defensa ante un tribunal de TFT.
