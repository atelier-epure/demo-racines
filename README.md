# Site web — Racines (démo portfolio)

Site statique HTML/CSS/JS. Aucune dépendance, aucun framework, aucun build.
**Mood : Gastro · Tier : Premium**

> ⚠️ Site de démonstration — remplacer les photos et les liens TheFork par les vrais avant livraison.

---

## Déploiement (3 minutes)

### Première mise en ligne

1. Crée un repo GitHub privé : `agence-mathis/site-racines`
2. `git init && git add . && git commit -m "init: site Racines"`
3. `git remote add origin git@github.com:agence-mathis/site-racines.git`
4. `git push -u origin main`
5. Sur Hostinger : Sites → Add website → Connect from GitHub → sélectionner le repo
6. Le déploiement est automatique à chaque push sur `main`. Compte ~30 secondes.

### Modifications futures (maintenance)

```bash
cd site-racines
# édite les fichiers
git add .
git commit -m "maj: changement horaires samedi"
git push
```

Hostinger redéploie automatiquement.

---

## Structure

```
demo-racines/
├── index.html              — page principale (FR)
├── en.html                 — version anglaise
├── nl.html                 — version néerlandaise
├── styles.css              — design complet (mood Gastro)
├── script.js               — interactions (nav, galerie, lightbox, compteurs...)
├── sitemap.xml             — plan du site pour Google
├── robots.txt              — directives crawlers
├── client-data.json        — brief client (NE PAS committer publiquement)
├── blog/
│   ├── celeri-rave-hiver-wallon.html              — article 01
│   ├── producteurs-ferme-renard-fernelmont.html   — article 02
│   ├── accord-legumes-vins-naturels-printemps.html — article 03
│   └── _template-article.html — modèle pour les futurs articles
│       (pas de page liste : les articles sont accessibles depuis la section
│        « Journal » en bas de la page d'accueil, qui pointe directement vers eux)
└── assets/
    ├── logo.svg            — logo texte SVG
    ├── favicon.svg         — favicon minimaliste
    └── photos/             — ← AJOUTER LES PHOTOS ICI
```

---

## Photos à fournir

Déposer dans `assets/photos/` avec exactement ces noms de fichier :

| Fichier | Usage | Format recommandé | Dimensions |
|---|---|---|---|
| `hero.jpg` | Image plein écran principale | JPEG optimisé | 1920×1080 min |
| `hero.webp` | Alternative WebP du hero | WebP | même dimensions |
| `equipe-1.jpg` | Chef en cuisine (section À propos) | JPEG | 800×1000 |
| `interieur-1.jpg` | Salle principale (fond réservation + galerie) | JPEG | 1200×800 |
| `interieur-2.jpg` | Cuisine ouverte (galerie) | JPEG | 800×600 |
| `interieur-3.jpg` | Détail salle (galerie) | JPEG | 800×600 |
| `plat-1.jpg` | Betterave & lavande (galerie) | JPEG | 800×600 |
| `plat-2.jpg` | Céleri-rave (galerie) | JPEG | 800×600 |
| `plat-3.jpg` | Risotto d'épeautre (galerie) | JPEG | 800×600 |
| `plat-4.jpg` | Courge butternut (galerie) | JPEG | 800×600 |
| `dessert-1.jpg` | Poire pochée (galerie) | JPEG | 800×600 |
| `producteurs-1.jpg` | Visite ferme partenaire (galerie) | JPEG | 800×600 |
| `equipe-2.jpg` | Équipe en salle (galerie) | JPEG | 800×600 |
| `vedette-celeri.jpg` | Céleri-rave (plat vedette) | JPEG | 600×800 |
| `vedette-betterave.jpg` | Betterave (plat vedette) | JPEG | 600×800 |
| `vedette-risotto.jpg` | Risotto (plat vedette) | JPEG | 600×800 |
| `vedette-chocolat.jpg` | Chocolat (plat vedette) | JPEG | 600×800 |

**Optimisation recommandée avant déploiement :**
```bash
# Avec ImageMagick (si installé)
magick mogrify -resize 1920x1080> -quality 82 assets/photos/hero.jpg
magick mogrify -resize 800x600> -quality 80 assets/photos/*.jpg

# Convertir en WebP
cwebp -q 80 assets/photos/hero.jpg -o assets/photos/hero.webp
```

---

## Maintenance courante

| Action | Où modifier |
|---|---|
| **Horaires** | `index.html` → section `#contact` (dl.horaires) + JSON-LD dans `<head>` |
| **Menu** | `index.html` → section `#menu` (menu-item) |
| **Plats vedettes** | `index.html` → div `.vedettes-grid` |
| **Producteurs marquee** | `index.html` → div `.marquee-track` |
| **Photos** | Remplacer dans `assets/photos/` (garder le même nom) |
| **Lien TheFork** | Rechercher `thefork.be/restaurant/racines-namur-placeholder` dans tous les fichiers |
| **Nouveaux articles blog** | Dupliquer `blog/_template-article.html`, remplir les `{VARIABLES}`, ajouter une carte dans la section `#blog` de `index.html` (pointant vers le nouveau fichier) + une `<url>` dans `sitemap.xml` |

---

## SEO post-déploiement

1. Soumettre le sitemap à Google Search Console : `https://racines-namur.be/sitemap.xml`
2. Tester les données structurées : [Rich Results Test](https://search.google.com/test/rich-results)
3. Vérifier la fiche Google Business Profile (cohérence NAP)
4. Configurer Google Analytics / Plausible (optionnel, pas dans ce livrable)

**Mots-clés cibles intégrés :**
restaurant gastronomique Namur · cuisine végétale Namur · gastronomie wallonne · menu dégustation Namur · restaurant haut de gamme Namur · ferme to table Namur · réserver restaurant Namur

---

## Brisures anti-génériques (rapport skill)

- **Détail signature** : Diagramme terroir radial SVG — Namur au centre, 6 fermes partenaires reliées par des lignes bronze, avec noms, distances et spécialités. Section unique entre "Chiffres" et "Menu".
- **Asymétrie structurelle** : Section "À propos" en grid 1/3 (sidebar sticky avec l'année 2019 en grand) + 2/3 (body texte), photo qui déborde de 12% hors de son conteneur.
- **Bonus** : Numérotation romaine des sections du menu (I. Pour commencer / II. Pour suivre / III. Sélection wallonne / IV. Pour finir).

---

*Site généré par le skill `resto-site-builder` V2 — agence Mathis Leclercq*
