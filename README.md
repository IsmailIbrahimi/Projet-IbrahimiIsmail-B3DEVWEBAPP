# Portfolio — Projet n°1 (Conception & Développement Front-end)

> Réalisé par **Ibrahimi Ismail**  
> Projet noté de mes cours en **Conception & Développement Front-end**  
> 🧑‍🏫 Aide ponctuelle : **ChatGPT** (sémantique HTML, styles CSS, effets/animations)

---

## 🎯 Objectif

Mettre en place un **portfolio** moderne et responsive affichant une liste de projets récupérés via une API publique (lecture seule), avec recherche, filtres, tri et fiche détaillée.  
Le tout en **HTML/CSS (Bootstrap autorisé)** et **JavaScript natif**.

---

## ✨ Fonctionnalités

- **Liste de projets** depuis l’API (GET) + **gestion d’erreurs** et **loader**
- **Recherche** texte (titre/client/techno) + **filtres** (catégorie, techno, année) + **réinitialisation**
- **Tri par année** (ASC/DESC)
- **Cartes responsive** + **modale de détails** (native / Bootstrap selon implémentation)
- **Mode clair/sombre** avec **logo auto** (`WeblioL.png` / `WeblioD.png`)
- **Effets d’interface** :
  - Effet **machine à écrire** (typing) sur le titre + sous-titre des pages
  - **Mots aléatoires en dégradé brillant** (palette changée à chaque chargement)
  - **Scramble** (brouillage) au survol, préservant les couleurs et annulable instantanément
  - **Navbar “glass”** (flou + transparence) et sticky
- **Accessibilité** : labels, `aria-live` sur les en-têtes animés, focus visible, clavier OK
- **Responsive** : mobile → desktop (Grid/Flex/Bootstrap)

---

## 🧩 Pile

- **HTML5** (sémantique)
- **CSS3 / Bootstrap 5**
- **JavaScript natif** (modules)
- Effets maison : `typing.js`, `effects.js`


> ⚙️ **Configuration API**  
> Si le projet utilise `JS/api.js`, ajuster la constante `API_URL`/`ENDPOINT` si besoin.  
> En cas d’indisponibilité de l’API, prévoir un fallback local (JSON).

---

## 🚀 Démarrage

1. Cloner ou dézipper le projet
2. Ouvrir `index.html` dans un navigateur récent  
   *(Optionnel)* lancer un serveur local (VS Code — Live Server)

---

## 🧪 Tests rapides

- Changer le thème (clair/sombre) → vérifier le **logo** et les **contrastes**
- Tester **recherche** + **filtres** + **tri année**
- Ouvrir **modale** d’un projet → navigation clavier / focus OK
- Titre & sous-titre : vérifier **typing**, **mots en gradient**, **scramble** au survol
- Vérifier l’affichage mobile (≤ 375px), tablette, desktop

---

## 🙏 Sources

- **ChatGPT** m’a aidé pour la **sémantique HTML**, la **mise en forme CSS**, le **README** et les **effets/animations**
- **Bootstrap 5** pour la base UI

---
