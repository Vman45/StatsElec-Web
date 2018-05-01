# Pré-requis
_StatsElec_ peut tourner sur n'importe quel type de machine du moment qu'elle possède un accès réseau et la possibilité d'installer ```Docker``` ou les serveurs applicatifs nécessaires.

Nous recommandons l'installation de _StatsElec_ sur un serveur _Linux_ avec _Docker_. L'installation avec Docker est dite *clé en main*, aucune configuration de votre part sera nécessaire.

Notez que _StatsElec_ est très léger et peux être installé sur une petite machine telle qu'une [Raspberry Pi](https://www.raspberrypi.org/) ou des cartes alternatives (_Orange Pi, Odroid, Asus Tinker, etc..._).


## Pré-requis en général
Quelque soit le type de l'installation, assurez-vous d'avoir une _sonde StatsElec_ (prochainement disponible) ou bien de vous munir du [simulateur](https://git.ahh.si/themimitoof/StatsElec-simulateur).

**[Destiné aux utilisateurs avancés]** Si possible, prévoyez la création d'un réseau _Wi-Fi_ et d'un _sous-réseau (ou VLAN)_ séparé afin d'isoler les sondes du réseau principal et de réduire une possible interception des données.

## Pré-requis pour une installation avec Docker
Il est nécessaire d'installer sur la machine :

 * Git
 * [Docker](https://www.docker.com)
 * [Docker-compose](https://docs.docker.com/compose/)


## Pré-requis pour une installation manuelle
Il est nécessaire d'installer sur la machine :

 * Git
 * NodeJS
 * PostgreSQL
 * Broker MQTT (nous recommandons _Mosquitto_ car il est simple à configurer)
