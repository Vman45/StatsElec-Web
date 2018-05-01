# StatsElec
[![pipeline status](https://git.ahh.si/themimitoof/StatsElec/badges/master/pipeline.svg)](https://git.ahh.si/themimitoof/StatsElec/commits/master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/ad05641f1cf44b2eb3a550b450a70c32)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Themimitoof/StatsElec-Web&amp;utm_campaign=Badge_Grade) [![Documentation Status](https://readthedocs.org/projects/statselec/badge/?version=latest)](http://statselec.readthedocs.io/fr/latest/?badge=latest) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web?ref=badge_shield)

StatsElec est une interface web permettant de suivre la consommation électrique d'un ou plusieurs compteurs électriques _Enedis_.

Lien d'accès à la documentation : [https://statselec.readthedocs.io/fr/latest/](https://statselec.readthedocs.io/fr/latest/)

Pour suivre l'évolution du projet et de la milestone en cours (GitLab) : [https://git.ahh.si/themimitoof/StatsElec/boards](https://git.ahh.si/themimitoof/StatsElec/boards)

## Fonctionnalités
 * Simple d'utilisation
 * Compatible avec les compteurs _Linky (mode historique uniquement)_ et les compteurs _électroniques_ (_CBEMM_, _CBEMM-ICC_ et _CBETM_)
 * Compatible avec les installations _monophasés_ et _triphasés_
 * Compatible avec les tarifications _base_, _heures creuses/heures pleines_, _EJP_ et _Tempo_
 * Déploiement facile grâce à _Docker_ et _Docker compose_ !


## Incompatibilitées
StatsElec est aujourd'hui incompatible avec les compteurs suivant :
 * Linky _en mode standard (nouveau contrat créé lors de la pose du compteur)_
 * EMERAUDE
 * SAPHIR
 * PME-PMI

_Si vous possédez un de ses compteurs, envoyez-nous plusieurs trames afin d'intégrer le compteur à StatsElec !_


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
 * PostgreSQL
 * Broker MQTT (nous recommandons _Mosquitto_ car il est simple à configurer)
 * StatsElec-probe (_bientôt disponible_) ou bien du [simulateur](https://git.ahh.si/themimitoof/StatsElec-simulateur).


## Installation
Nous vous invitons à suivre le guide dans notre documentation : [https://statselec.readthedocs.io/fr/latest/installation/](https://statselec.readthedocs.io/fr/latest/installation/)

**Note :** Nous recommandons de déployer StatsElec dans Docker. Notre guide expliquera la démarche pour déployer sur Docker et non le déploiement manuel.

Une fois que vous avez télécherger le dépôt, naviguez dans le dossier ```config``` et créez une copie du fichier ```config.sample.js```  et renommez-le en ```config.js```. La configuration pour Docker est déjà toute prête ! Si toutefois, vous souhaitez modifier des informations, pensez à bien changer les informations dans le fichier ```docker-compose.yml```.

Dans le dossier racine de StatsElec, lancez la commande ```docker-compose build```. Elle va créer l'image du conteneur ```StatsElec_Web```. Une fois terminé, lancez la commande ```docker-compose up -d``` pour lancer l'ensemble des services.

Vous pouvez désormais entrer l'adresse ```http://localhost:8055``` dans votre navigateur pour accéder à StatsElec.


## Tests
Si vous souhaitez lancer les tests unitaires, tapez la commande ```docker-compose run --rm web npm run test``` (docker) ou ```npm run test``` (déploiement manuel).


## Contributions
Si vous souhaitez contribuer à l'amélioration de StatsElec, nous vous invitons à _fork_ le projet et de _merge request_ vos travaux. 

Si vous avez détecter un problème ou si vous souhaitez apporter une suggestion, ouvrez un ticket.

## Licences
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web?ref=badge_large)