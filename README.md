# Portfolio

Base de portfolio immersive, faite main en **HTML / CSS / JavaScript natif** (aucun framework),
construite avec [Vite](https://vite.dev). Tout le contenu est piloté par des fichiers de données :
tu n'as jamais besoin de toucher à la structure pour remplacer les placeholders.

```bash
npm install
npm run dev      # serveur de développement
npm run build    # version de production dans dist/
npm run preview  # prévisualiser la version de production
```

## Modifier le contenu → `src/data/`

| Fichier | Contenu |
| --- | --- |
| `profile.js` | Nom, initiales, métier, phrase du Hero, mots qui défilent, ville, disponibilité, e-mail, CV, réseaux, section « À propos » (texte, photo, repères, centres d'intérêt) |
| `projects.js` | Liste des projets : titre, catégorie, année, résumé, image, tags, infos de la fiche, sections de texte, galerie, liens |
| `skills.js` | Domaines de compétences, niveaux (1 à 5) et projets liés à chaque compétence |
| `journey.js` | Frise du parcours (formation / expérience / projet) |
| `sections.js` | Ordre, libellés de navigation et titres des sections (`*texte*` = italique serif) |
| `quests.js` | Gamification : points, niveaux, défis, secrets, récompense |

Les textes entre crochets (`[PROJET 01]`, `[MA PRÉSENTATION]`…) sont automatiquement soulignés en pointillés
pour être repérés facilement. Les images vont dans `public/` (ex. `public/projects/mon-projet.jpg` →
`cover: '/projects/mon-projet.jpg'`). Sans image, un visuel génératif est affiché (teinte réglable avec `hue`).

Les **filtres**, la **palette de commandes**, le **carnet d'exploration** et les **liens compétences → projets**
se mettent à jour tout seuls quand tu ajoutes ou retires un projet.

Pour l'identité visuelle (couleurs, polices, rythme, vitesses d'animation) : `src/styles/tokens.css`.

## Expérience

- **Hero** : nom en très grand + « lentille » qui suit le curseur et révèle la face *blueprint* (plan/code) du titre.
  Sur mobile, la lentille dérive seule et se pilote au doigt.
- **Navigation** : barre qui se compacte au scroll, indicateur glissant, section active, barre de progression.
  Sur mobile : dock inférieur accessible au pouce + menu plein écran.
- **Palette de commandes** (`Ctrl/⌘ + K` ou `/`) : aller à une section, ouvrir un projet, changer de thème…
- **Projets** : filtres animés, vue Grille (cartes 3D + reflet) ou Index (aperçu flottant), carrousel sur mobile,
  fiche détaillée avec URL partageable (`#projet/slug`), navigation ← → et Échap.
- **Compétences** : onglets par domaine, jauges, radar des moyennes, liens directs vers les projets concernés.
- **Thème clair / sombre** avec révélation circulaire.

### Gamification — « Carnet d'exploration »

Chaque zone visitée, projet ouvert, défi relevé (filtrer, parcourir les compétences, utiliser la palette,
copier l'e-mail) et secret trouvé rapporte de l'XP. La progression s'affiche dans l'anneau de la barre de navigation,
dans le Hero et dans le pied de page. Le carnet liste ce qu'il reste à découvrir (avec liens directs), les niveaux
(Visiteur → Archiviste) et les indices des secrets. À 100 %, le **mode Blueprint** se débloque (touche `B`) :
le site révèle sa structure. La progression est enregistrée localement dans le navigateur.

<details>
<summary>Secrets (spoilers)</summary>

- cliquer 5 fois sur le logo ;
- le glyphe ✳ caché dans les repères « À propos » ;
- le Konami code (↑ ↑ ↓ ↓ ← → ← → B A) ;
- le message dans la console du navigateur → taper `sudo hire` dans la palette.
</details>

## Architecture

```
src/
├── data/         contenu (le seul dossier à modifier au quotidien)
├── core/         moteur : rendu HTML sécurisé, gamification, thème, stockage, mouvement, accessibilité
├── components/   une section ou un calque par fichier (render + mount)
└── styles/       tokens, base, puis un fichier par zone
```

Chaque composant exporte une fonction `render…()` (HTML) et `mount…()` (comportements). Les actions globales
passent par `data-action="…"` (registre dans `core/actions.js`), ce qui garde les composants découplés.

## Performance & accessibilité

- ~20 ko de JS gzip, zéro dépendance d'exécution, polices auto-hébergées.
- Animations sur `transform` / `opacity` uniquement, boucles `requestAnimationFrame` qui s'arrêtent au repos,
  observateurs d'intersection plutôt que des écouteurs de scroll coûteux.
- View Transitions API (avec repli) pour l'ouverture des projets, les filtres et le thème.
- `prefers-reduced-motion` respecté partout ; curseur personnalisé uniquement sur pointeur fin.
- Navigation clavier complète, pièges de focus dans les calques, rôles ARIA, lien d'évitement.
