# Installation
Assurez-vous d'avoir les droits **root** sur la machine afin de suivre ce guide.

## Installation avec Docker
Il est nécessaire dans un premier temps d'installer Docker. Pour cela, nous vous invitons à lire la documentation de Docker et la page dédiée à la distribution que vous utilisez.

 * Debian/Ubuntu et dérivées : [https://docs.docker.com/install/linux/docker-ce/debian/](https://docs.docker.com/install/linux/docker-ce/debian/)
 * Centos : [https://docs.docker.com/install/linux/docker-ce/centos/](https://docs.docker.com/install/linux/docker-ce/centos/)
 * Fedora : [https://docs.docker.com/install/linux/docker-ce/fedora/](https://docs.docker.com/install/linux/docker-ce/fedora/)
 * ArchLinux : lancez simplement la commande ```pacman -S docker```
 * Windows (nécessite **Windows édition Pro, Entreprise ou Education !**) : [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)

Ensuite, il est nécessaire d'installer Docker-compose : [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

La dernière dépendance à installer est Git. Pour cela, utilisez une des commandes suivante :

 * Debian/Ubuntu et dérivées : ```apt install git```
 * Centos, Fedora : ```dnf install git```
 * ArchLinux : ```pacman -S git```
 * Windows : _nécessite l'installation d'un paquet disponible sur_ [https://git-scm.com/download/win](https://git-scm.com/download/win)


Attaquons nous désormais à _StatsElec_ ! Nous allons d'un un premier télécharger les sources, pour cela entrez la commande :
```bash
git clone -b tags/0.2.0 https://github.com/themimitoof/statselec.git 
```

_Note :_ nous vous déconseillons d'utiliser la branche _master_. Il s'agit de la branche de développement qui peut contenir des bugs bloquant (contrairement aux tags qui sont des versions stables).

Entrez dans le dossier nouvelle créé et copiez-coller le fichier ```config.js.sample``` se situant dans le dossier ```config``` en ```config.js``` :
```
cp config/config.js.sample config/config.js

ou

cd config/
cp config.js.sample config.js
cd ..
```

Modifiez le nouveau fichier et changez la valeur de ```houseName```. Assurez-vous qu'aucun espace, caractères spéciaux ne soit utilisé et ne dépassez pas les **14 caractères**.

Une fois les modifications apportées, il ne nous reste plus qu'à lancer le serveur en lançant la commande ```docker-compose up -d```.

Attendez que l'ensemble des services soient créés et lancés et entrez le l'adresse [http://localhost:8055](http://localhost:8055) dans votre navigateur pour voir l'interface de StatsElec.

Si l'interface Web ne s'affiche pas, vous pouvez regarder si les services sont bien démarrés avec la commande ```docker ps``` ou ```docker-compose ps``` ou bien de regarder les journaux de l'application avec la commande ```docker-compose logs``` (affichera les journaux de l'ensemble des services) ou ```docker-compose logs web``` (affichera les journaux du serveur Web uniquement).


## Installation manuelle
_Cette partie arrive très bientôt_