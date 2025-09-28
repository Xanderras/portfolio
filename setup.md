# Portfolio Setup Guide

Welkom bij je nieuwe portfolio website! Volg deze stappen om je site volledig in te richten.

## 📋 Checklist voor Setup

### 1. Persoonlijke Informatie Aanpassen

**In `index.html`, verander de volgende placeholders:**

- [ ] `Jouw Naam` → Je echte naam (regels 69, 70)
- [ ] `jouw.email@example.com` → Je echte email adres
- [ ] `+31 6 12345678` → Je telefoonnummer
- [ ] `https://linkedin.com/in/yourprofile` → Je LinkedIn URL
- [ ] `https://github.com/yourusername` → Je GitHub URL
- [ ] `https://twitter.com/yourhandle` → Je Twitter URL (optioneel)

### 2. CV Bestand Toevoegen

- [ ] Voeg je CV toe aan `assets/documents/` als PDF
- [ ] Hernoem het bestand naar `CV_VoorNaam_AchterNaam.pdf`
- [ ] Update de download link in `index.html` (regel 509) als de bestandsnaam anders is

### 3. Afbeeldingen Toevoegen

**Voeg de volgende afbeeldingen toe aan `assets/images/`:**

- [ ] `profile.jpg` - Je professionele profielfoto (400x400px aanbevolen)
- [ ] `project1.jpg` - Screenshot Smart Home Dashboard project
- [ ] `project2.jpg` - Screenshot E-commerce Platform project
- [ ] `project3.jpg` - Screenshot Weather Monitoring System project

### 4. Project Informatie Aanpassen

**Voor elk project in de projecten sectie, update:**

- [ ] Project titels en beschrijvingen
- [ ] Technologie tags
- [ ] Links naar live demo's en GitHub repositories
- [ ] Vervang placeholder projecten met je eigen projecten

### 5. Over Mij Sectie Personaliseren

- [ ] Update je achtergrondverhaal
- [ ] Pas statistieken aan (jaren ervaring, aantal projecten, etc.)
- [ ] Voeg je eigen ervaring en specialisaties toe

### 6. Vaardigheden Aanpassen

**In de skills sectie:**

- [ ] Update skill percentages naar je werkelijke niveau
- [ ] Voeg of verwijder technologieën toe/uit
- [ ] Pas categorieën aan naar je expertisegebieden

### 7. Ervaring/Timeline Bijwerken

- [ ] Vervang placeholder ervaring met je echte werkervaring
- [ ] Voeg je opleiding toe
- [ ] Update data en bedrijfsnamen

## 🚀 Website Testen

### Lokaal Testen

1. **Basis Test:**

   ```bash
   # Open gewoon index.html in je browser
   start index.html  # Windows
   open index.html   # macOS
   xdg-open index.html  # Linux
   ```

2. **Met Lokale Server (aanbevolen):**

   ```bash
   # Met Python
   python -m http.server 8000

   # Met Node.js (als je npx hebt)
   npx http-server

   # Dan ga naar http://localhost:8000
   ```

### Test Checklist

- [ ] Website laadt correct
- [ ] Nederlandse/Engelse taalwisseling werkt
- [ ] Dark/Light mode toggle werkt
- [ ] Navigatie menu werkt (zowel desktop als mobiel)
- [ ] Animaties lopen soepel
- [ ] Contact formulier werkt (toont success/error berichten)
- [ ] CV download werkt
- [ ] Alle links werken
- [ ] Website is responsive op verschillende schermgroottes
- [ ] Alle afbeeldingen laden correct

## 🌐 Website Online Zetten

### Gratis Hosting Opties:

1. **GitHub Pages** (Aanbevolen)
   - Maak een GitHub repository
   - Upload alle bestanden
   - Ga naar Settings > Pages
   - Selecteer main branch als source

2. **Netlify**
   - Sleep je portfolio map naar netlify.com/drop
   - Je krijgt direct een live URL

3. **Vercel**
   - Verbind je GitHub repository
   - Automatische deployments bij elke update

4. **Firebase Hosting**
   - Voor meer geavanceerde features

## 🔧 Troubleshooting

### Veelvoorkomende Problemen:

**Afbeeldingen laden niet:**

- Controleer of de bestandsnamen exact kloppen (hoofdlettergevoelig)
- Zorg dat afbeeldingen in de juiste map staan (`assets/images/`)

**Animaties werken niet:**

- Open Developer Tools (F12) en check voor JavaScript errors
- Zorg dat alle JS bestanden correct laden

**Taalwisseling werkt niet:**

- Check of alle elementen `data-nl` en `data-en` attributen hebben
- Controleer browser console voor JavaScript errors

**Styling ziet er verkeerd uit:**

- Controleer of alle CSS bestanden correct laden
- Test in verschillende browsers

**Contact formulier werkt niet:**

- Het formulier toont momenteel alleen een demo bericht
- Voor een werkend formulier heb je een backend service nodig

## 📈 Volgende Stappen

### Website Verbeteren:

- [ ] Voeg Google Analytics toe voor visitor tracking
- [ ] Implementeer een werkend contact formulier (bijv. met Formspree)
- [ ] Voeg meer projecten toe naarmate je ze maakt
- [ ] Overweeg een blog sectie toe te voegen
- [ ] Optimaliseer voor SEO (meta tags, structured data)

### Portfolio Uitbreiden:

- [ ] Voeg testimonials toe van collega's of docenten
- [ ] Maak video showcases van je projecten
- [ ] Voeg certificaten toe die je behaalt
- [ ] Documenteer je leerproces in blog posts

## 💡 Tips

- **Update regelmatig**: Houd je portfolio actueel met nieuwe projecten en skills
- **Test op echte devices**: Test je website op verschillende telefoons en tablets
- **Vraag feedback**: Laat anderen je website bekijken voor verbeterpunten
- **Monitor performance**: Gebruik tools zoals Google PageSpeed Insights
- **Backup je werk**: Gebruik Git version control voor je code

## 🆘 Hulp Nodig?

Als je problemen ondervindt:

1. Check de browser console (F12) voor error berichten
2. Controleer of alle bestanden in de juiste mappen staan
3. Test in een andere browser
4. Gebruik de Developer Tools om layout problemen te debuggen

Veel succes met je nieuwe portfolio website! 🎉
