# StatsElec
StatsElec est une interface web permettant de suivre la consommation électrique d'un ou plusieurs compteurs électriques _Enedis_.

## Fonctionnalités
 * Simple d'utilisation (aucune configuration à faire ni de système de comptes)
 * Compatible avec les compteurs _Linky (mode historique uniquement)_ et les compteurs _électroniques_ (_CBEMM_, _CBEMM-ICC_ et _CBETM_)
 * Compatible avec les tarifications _base_, _heures creuses/heures pleines_, _EJP_ et _Tempo_
 * Déploiement facile (grâce à _Docker_)


## Incompatibilitées
StatsElec est aujourd'hui incompatible avec les compteurs :
 * EMERAUDE
 * SAPHIR
 * PME-PMI
 * Linky _mode standard_

_Si vous possédez un des compteurs ci-dessous, envoyez-nous plusieurs trames afin d'intégrer le compteur à StatsElec !_


## Pré-requis
Nous recommandons fortement d'utiliser une machine _Linux_ mais StatsElec fonctionne tout aussi bien sur les machines _Windows_.

Les pré-requis pour une installation sur Docker :
 * Git
 * [Docker](https://www.docker.com)
 * [Docker-compose](https://docs.docker.com/compose/)
 * StatsElec-probe (_bientôt disponible_) ou bien du [simulateur](https://git.ahh.si/themimitoof/StatsElec-simulateur).

Pour les installations manuelles : 
 * Git
 * NodeJS
 * InfluxDB
 * Broker MQTT (nous recommandons _Mosquitto_ car il est simple à configurer)
 * StatsElec-probe (_bientôt disponible_) ou bien du [simulateur](https://git.ahh.si/themimitoof/StatsElec-simulateur).


## Installation
**Note :** Nous recommandons de déployer StatsElec dans Docker. Notre guide expliquera la démarche pour déployer sur Docker et non le déploiement manuel.

Une fois que vous avez télécherger le dépôt, naviguez dans le dossier ```config``` et créez une copie du fichier ```config.sample.js```  et renommez-le en ```config.js```. La configuration pour Docker est déjà toute prête ! Si toutefois, vous souhaitez modifier des informations, pensez à bien changer les informations dans le fichier ```docker-compose.yml```.

Dans le dossier racine de StatsElec, lancez la commande ```docker-compose build```. Elle va créer l'image du conteneur ```StatsElec_Web```. Une fois terminé, lancez la commande ```docker-compose up -d``` pour lancer l'ensemble des services.

Vous pouvez désormais entrer l'adresse ```http://localhost:8085``` dans votre navigateur pour accéder à StatsElec.


## Tests
Si vous souhaitez lancer les tests unitaires, tapez la commande ```docker-compose run --rm web npm run test``` (docker) ou ```npm run test``` (déploiement manuel).


# Contributions
Si vous souhaitez contribuer à l'amélioration de StatsElec, nous vous invitons à _fork_ le projet et de _merge request_ vos travaux. 

Si vous avez détecter un problème ou si vous souhaitez apporter une suggestion, ouvrez un ticket.