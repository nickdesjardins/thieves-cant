"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "en" | "fr";

// All translations for the app
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.translator": "Translator",
    "nav.dictionary": "Dictionary",
    "nav.symbols": "Symbols",
    "nav.title": "Thieves' Cant",
    "nav.subtitle": "D&D 5e Rogue Companion",

    // Landing Page
    "home.hero.badge": "Beginner's Guide",
    "home.hero.title": "Speak the Language of Rogues",
    "home.hero.subtitle": "Thieves' Cant is the secret language used by rogues, scoundrels, and members of the Thieves' Guild across Faerûn. Learn to speak, translate, and understand this hidden tongue — and never be caught off guard again.",
    "home.hero.cta.translate": "Start Translating",
    "home.hero.cta.learn": "Explore the Dictionary",

    "home.what.title": "What is Thieves' Cant?",
    "home.what.body": "Thieves' Cant is a secret argot — a coded language — developed over centuries by criminal guilds, traveling vagabonds, and shadowy underworld organizations. In D&D 5e, every Rogue begins with the ability to understand it. It blends everyday words with hidden meanings, allowing guild members to speak openly in front of unsuspecting bystanders.",
    "home.what.quote": "\"The night air smells of blunt and darkmans — the prig has done well.\" ",
    "home.what.quoteTranslation": "Translation: \"The night air smells of money and darkness — the thief has done well.\"",

    "home.concepts.title": "Core Concepts",
    "home.concepts.words.title": "The Words",
    "home.concepts.words.desc": "Hundreds of coded words replace everyday terms. A \"prig\" is a thief, \"blunt\" is money, a \"ken\" is a house. Combine them naturally in conversation.",
    "home.concepts.words.example": "\"The rum prig nabbed blunt from the ken.\" → The skilled thief stole money from the house.",
    "home.concepts.phrases.title": "Everyday Phrases",
    "home.concepts.phrases.desc": "Words are combined into phrases that sound innocent to outsiders but carry secret meaning to those who know Cant.",
    "home.concepts.phrases.example": "\"Bene darkmans, cove\" → Good night, friend.",
    "home.concepts.symbols.title": "The Symbols",
    "home.concepts.symbols.desc": "Beyond spoken words, guild members scratch secret symbols onto walls, doors, and posts — invisible messages in plain sight.",
    "home.concepts.symbols.example": "A circle with a cross = Safe house nearby. A crossed-out door = Danger, avoid this place.",

    "home.examples.title": "Cant in Everyday Conversation",
    "home.examples.subtitle": "Here's how rogues communicate in plain sight:",
    "home.examples.scene": "At a tavern, a fence approaches a thief...",
    "home.examples.line1.cant": "\"Bene morrow, cove. Any rum lour from the swell's ken last darkmans?\"",
    "home.examples.line1.english": "\"Good morning, friend. Any good loot from the rich man's house last night?\"",
    "home.examples.line2.cant": "\"Aye, the rum diver cracked the pad and prigged the blunt — no harman-beck in sight.\"",
    "home.examples.line2.english": "\"Yes, the skilled pickpocket broke in and stole the money — no constable in sight.\"",
    "home.examples.line3.cant": "\"Flash! Stow your whids, a queer cull approaches.\"",
    "home.examples.line3.english": "\"Excellent! Quiet now, a suspicious person approaches.\"",

    "home.cta.translator.title": "Translator",
    "home.cta.translator.desc": "Translate English words and full phrases into authentic Thieves' Cant — or decode Cant back to common tongue.",
    "home.cta.translator.btn": "Open Translator",
    "home.cta.dictionary.title": "Dictionary",
    "home.cta.dictionary.desc": "Browse hundreds of Cant terms organized by category. From people and places to actions and objects.",
    "home.cta.dictionary.btn": "Browse Dictionary",
    "home.cta.symbols.title": "Secret Symbols",
    "home.cta.symbols.desc": "Discover the hidden marks left by thieves' guilds and vagabonds — and what each one means.",
    "home.cta.symbols.btn": "View Symbols",

    "home.dnd.title": "For D&D 5e Players & DMs",
    "home.dnd.rogue": "Rogues automatically know Thieves' Cant at level 1 — it's their class feature. Use the Translator to give your character an authentic voice.",
    "home.dnd.dm": "As a DM, pepper your world with Cant-speaking NPCs, guild signs, and coded messages using our Symbol reference.",
    "home.dnd.ingame": "Looking for in-game flavor? Use the Phrase Translator to generate real Cant sentences your character would actually say.",
    "home.dnd.cta": "Try the Phrase Translator",

    "home.rules.title": "Basic Rules of Thieves' Cant",
    "home.rules.subtitle": "As defined in the D&D 5e Player's Handbook (Rogue class feature)",
    "home.rules.time.title": "4× Speaking Time",
    "home.rules.time.desc": "Conveying a message in Thieves' Cant takes four times as long as saying the same thing in a common language. Plan accordingly during tense negotiations.",
    "home.rules.secret.title": "Secret by Design",
    "home.rules.secret.desc": "Non-initiates cannot understand Cant. Even if overheard, the conversation appears to be about something mundane to untrained ears.",
    "home.rules.rogue.title": "Rogue Class Feature",
    "home.rules.rogue.desc": "At 1st level, all Rogues know Thieves' Cant. It is not a language that can be learned through the Linguist feat — it must be taught by the guild.",
    "home.rules.written.title": "Written Code",
    "home.rules.written.desc": "Thieves' Cant can also be written in a system of marks and symbols, allowing messages to be left in public without arousing suspicion.",
    
    // Translator Page
    "translator.title": "Thieves' Cant Translator",
    "translator.subtitle": "Master the secret language of rogues and scoundrels",
    "translator.placeholder": "Enter words to translate...",
    "translator.englishToCant": "English to Cant",
    "translator.cantToEnglish": "Cant to English",
    "translator.frenchToCant": "Français to Cant",
    "translator.cantToFrench": "Cant to Français",
    "translator.noResults": "No matches found. Try a different word or phrase.",
    "translator.quickRef": "Quick Reference",
    "translator.commonTerms": "Common Terms",
    "translator.searchHint": "Type to search...",
    "translator.term": "Term",
    "translator.translation": "Translation",
    "translator.results": "results",
    
    // Dictionary Page
    "dictionary.title": "The Complete Dictionary",
    "dictionary.subtitle": "A comprehensive collection of Thieves' Cant terminology",
    "dictionary.searchPlaceholder": "Search terms or definitions...",
    "dictionary.allCategories": "All Categories",
    "dictionary.showing": "Showing",
    "dictionary.of": "of",
    "dictionary.entries": "entries",
    "dictionary.noResults": "No entries found matching your search criteria.",
    "dictionary.backToTop": "Back to Top",
    
    // Symbols Page
    "symbols.title": "Secret Symbols",
    "symbols.subtitle": "Hidden marks and signs used by rogues, vagabonds, and thieves' guilds to communicate in plain sight.",
    "symbols.guildMarks": "Thieves' Guild Marks",
    "symbols.hoboSigns": "Hobo Signs",
    "symbols.all": "All",
    "symbols.guildTitle": "Guild Marks",
    "symbols.guildDesc": "Thieves' guilds throughout the realms use secret symbols to mark territory, identify safe houses, warn of danger, and communicate with fellow guild members. These marks are often scratched into walls, drawn in chalk, or carved into wooden posts.",
    "symbols.guildTip": "For D&D 5e: A Rogue with proficiency in Thieves' Cant can read and leave these marks. An Intelligence (Investigation) check DC 15 may be required to find hidden marks.",
    "symbols.hoboTitle": "Hobo Signs",
    "symbols.hoboDesc": "Historical symbols used by wandering travelers and vagabonds to leave messages for others. These simple marks convey important information about food, shelter, danger, and opportunities.",
    "symbols.hoboTip": "For D&D 5e: These can represent marks left by traveling merchants, wandering folk, or urban poor. Perfect for adding world detail to your campaign.",
    "symbols.categoryLegend": "Category Legend",
    "symbols.dmTips": "DM Tips",
    "symbols.dmTip1": "Place guild marks near the entrances of taverns, alleyways, or under bridges",
    "symbols.dmTip2": "Have NPCs reference \"the marks\" when giving directions to rogues",
    "symbols.dmTip3": "Create plot hooks by having players discover contradictory or unusual marks",
    "symbols.dmTip4": "Allow Rogues to leave their own marks to aid the party later",
    "symbols.dmTip5": "Use these symbols as puzzle elements in heist or urban adventures",
    
    // Categories
    "category.Warning": "Warning",
    "category.Resource": "Resource",
    "category.Direction": "Direction",
    "category.Info": "Info",
    "category.Safe": "Safe",
    "category.Identity": "Identity",
    "category.Commerce": "Commerce",
    "category.Contact": "Contact",
    "category.Territory": "Territory",
    "category.Target": "Target",
    "category.Route": "Route",
    "category.Escape": "Escape",
    "category.People": "People",
    "category.Actions": "Actions",
    "category.Places": "Places",
    "category.Objects": "Objects",
    "category.Money": "Money",
    "category.Law": "Law",
    "category.Body": "Body",
    "category.Food & Drink": "Food & Drink",
    "category.Clothing": "Clothing",
    "category.Animals": "Animals",
    "category.Descriptive": "Descriptive",
    "category.General": "General",
    
    // Category descriptions
    "categoryDesc.Warning": "Danger ahead",
    "categoryDesc.Resource": "Helpful locations",
    "categoryDesc.Direction": "Travel guidance",
    "categoryDesc.Info": "General information",
    "categoryDesc.Safe": "Safe locations",
    "categoryDesc.Identity": "Guild membership",
    "categoryDesc.Commerce": "Trade opportunities",
    "categoryDesc.Contact": "People to meet",
    "categoryDesc.Territory": "Guild boundaries",
    "categoryDesc.Target": "Valuable marks",
    "categoryDesc.Route": "Travel paths",
    "categoryDesc.Escape": "Quick exits",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.translator": "Traducteur",
    "nav.dictionary": "Dictionnaire",
    "nav.symbols": "Symboles",
    "nav.title": "Jargon des Voleurs",
    "nav.subtitle": "Compagnon du Roublard D&D 5e",

    // Landing Page
    "home.hero.badge": "Guide du Débutant",
    "home.hero.title": "Parlez la Langue des Roublards",
    "home.hero.subtitle": "Le Jargon des Voleurs est le langage secret utilisé par les roublards, les scélérats et les membres des guildes de voleurs à travers Faerûn. Apprenez à parler, traduire et comprendre cette langue cachée — et ne soyez plus jamais pris au dépourvu.",
    "home.hero.cta.translate": "Commencer à Traduire",
    "home.hero.cta.learn": "Explorer le Dictionnaire",

    "home.what.title": "Qu'est-ce que le Jargon des Voleurs?",
    "home.what.body": "Le Jargon des Voleurs est un argot secret — un langage codé — développé au fil des siècles par les guildes criminelles, les vagabonds itinérants et les organisations souterraines. Dans D&D 5e, chaque Roublard commence avec la capacité de le comprendre. Il mélange des mots ordinaires avec des significations cachées, permettant aux membres de la guilde de parler ouvertement devant des passants sans méfiance.",
    "home.what.quote": "\"L'air de la nuit sent le pognon et la sorgue — la pègre a bien travaillé.\"",
    "home.what.quoteTranslation": "Traduction: \"L'air de la nuit sent l'argent et la nuit — le voleur a bien travaillé.\"",

    "home.concepts.title": "Concepts Fondamentaux",
    "home.concepts.words.title": "Les Mots",
    "home.concepts.words.desc": "Des centaines de mots codés remplacent les termes du quotidien. \"Pègre\" désigne un voleur, \"pognon\" désigne de l'argent, une \"cambuse\" est une maison. Combinez-les naturellement dans vos conversations.",
    "home.concepts.words.example": "\"La pègre a pris le pognon de la cambuse.\" → Le voleur habile a volé l'argent de la maison.",
    "home.concepts.phrases.title": "Expressions Quotidiennes",
    "home.concepts.phrases.desc": "Les mots sont combinés en expressions qui semblent innocentes aux outsiders, mais qui portent une signification secrète pour ceux qui connaissent l'argot.",
    "home.concepts.phrases.example": "\"Bonsoir, compagnon\" → Bonne nuit, ami (en argot des voleurs).",
    "home.concepts.symbols.title": "Les Symboles",
    "home.concepts.symbols.desc": "Au-delà des mots, les membres de la guilde griffonnent des symboles secrets sur les murs, portes et poteaux — des messages invisibles en plein air.",
    "home.concepts.symbols.example": "Un cercle avec une croix = Maison sûre à proximité. Une porte barrée = Danger, évitez cet endroit.",

    "home.examples.title": "Le Jargon dans la Conversation",
    "home.examples.subtitle": "Voici comment les roublards communiquent en toute discrétion:",
    "home.examples.scene": "Dans une taverne, un receleur s'approche d'un voleur...",
    "home.examples.line1.cant": "\"Bene morrow, cove. Any rum lour from the swell's ken last darkmans?\"",
    "home.examples.line1.english": "\"Bonjour, ami. Du bon butin dans la demeure du riche la nuit dernière?\"",
    "home.examples.line2.cant": "\"Aye, the rum diver cracked the pad and prigged the blunt — no harman-beck in sight.\"",
    "home.examples.line2.english": "\"Oui, le pickpocket habile a forcé l'entrée et volé l'argent — aucune garde en vue.\"",
    "home.examples.line3.cant": "\"Flash! Stow your whids, a queer cull approaches.\"",
    "home.examples.line3.english": "\"Excellent! Silence maintenant, un individu suspect s'approche.\"",

    "home.cta.translator.title": "Traducteur",
    "home.cta.translator.desc": "Traduisez des mots et phrases en Jargon des Voleurs authentique — ou décodez le Jargon en langue commune.",
    "home.cta.translator.btn": "Ouvrir le Traducteur",
    "home.cta.dictionary.title": "Dictionnaire",
    "home.cta.dictionary.desc": "Parcourez des centaines de termes de Jargon organisés par catégorie. Des personnes et lieux aux actions et objets.",
    "home.cta.dictionary.btn": "Parcourir le Dictionnaire",
    "home.cta.symbols.title": "Symboles Secrets",
    "home.cta.symbols.desc": "Découvrez les marques cachées laissées par les guildes de voleurs et les vagabonds — et ce que chacune signifie.",
    "home.cta.symbols.btn": "Voir les Symboles",

    "home.dnd.title": "Pour les Joueurs & MJs de D&D 5e",
    "home.dnd.rogue": "Les Roublards connaissent automatiquement le Jargon des Voleurs au niveau 1 — c'est leur trait de classe. Utilisez le Traducteur pour donner à votre personnage une voix authentique.",
    "home.dnd.dm": "En tant que MJ, parsemez votre monde de PNJ parlant le Jargon, de signes de guilde et de messages codés grâce à nos Symboles.",
    "home.dnd.ingame": "Vous cherchez des éléments de jeu? Utilisez le Traducteur de Phrases pour générer de vraies phrases en Jargon que votre personnage dirait.",
    "home.dnd.cta": "Essayer le Traducteur de Phrases",

    "home.rules.title": "Règles de Base du Jargon des Voleurs",
    "home.rules.subtitle": "Telles que définies dans le Manuel du Joueur D&D 5e (trait de classe Roublard)",
    "home.rules.time.title": "4× le Temps de Parole",
    "home.rules.time.desc": "Transmettre un message en Jargon des Voleurs prend quatre fois plus de temps qu'en langue commune. Planifiez en conséquence lors de négociations tendues.",
    "home.rules.secret.title": "Secret par Conception",
    "home.rules.secret.desc": "Les non-initiés ne peuvent pas comprendre le Jargon. Même si la conversation est entendue, elle semble porter sur quelque chose de banal pour des oreilles non averties.",
    "home.rules.rogue.title": "Trait de Classe du Roublard",
    "home.rules.rogue.desc": "Au niveau 1, tous les Roublards connaissent le Jargon des Voleurs. Ce n'est pas une langue qui peut être apprise via le don Linguiste — elle doit être enseignée par la guilde.",
    "home.rules.written.title": "Code Écrit",
    "home.rules.written.desc": "Le Jargon peut aussi être écrit sous forme de marques et de symboles, permettant de laisser des messages en public sans éveiller les soupçons.",
    
    // Translator Page
    "translator.title": "Traducteur du Jargon des Voleurs",
    "translator.subtitle": "Maîtrisez le langage secret des roublards et des scélérats",
    "translator.placeholder": "Entrez les mots à traduire...",
    "translator.englishToCant": "Anglais vers Jargon",
    "translator.cantToEnglish": "Jargon vers Anglais",
    "translator.frenchToCant": "Français vers Jargon",
    "translator.cantToFrench": "Jargon vers Français",
    "translator.noResults": "Aucun résultat trouvé. Essayez un autre mot ou une autre phrase.",
    "translator.quickRef": "Référence Rapide",
    "translator.commonTerms": "Termes Courants",
    "translator.searchHint": "Tapez pour rechercher...",
    "translator.term": "Terme",
    "translator.translation": "Traduction",
    "translator.results": "résultats",
    
    // Dictionary Page
    "dictionary.title": "Le Dictionnaire Complet",
    "dictionary.subtitle": "Une collection complète de la terminologie du Jargon des Voleurs",
    "dictionary.searchPlaceholder": "Rechercher des termes ou des définitions...",
    "dictionary.allCategories": "Toutes les Catégories",
    "dictionary.showing": "Affichage de",
    "dictionary.of": "sur",
    "dictionary.entries": "entrées",
    "dictionary.noResults": "Aucune entrée trouvée correspondant à vos critères de recherche.",
    "dictionary.backToTop": "Retour en Haut",
    
    // Symbols Page
    "symbols.title": "Symboles Secrets",
    "symbols.subtitle": "Marques et signes cachés utilisés par les roublards, vagabonds et guildes de voleurs pour communiquer en toute discrétion.",
    "symbols.guildMarks": "Marques de Guilde des Voleurs",
    "symbols.hoboSigns": "Signes des Vagabonds",
    "symbols.all": "Tous",
    "symbols.guildTitle": "Marques de Guilde",
    "symbols.guildDesc": "Les guildes de voleurs à travers les royaumes utilisent des symboles secrets pour marquer leur territoire, identifier les refuges sûrs, avertir du danger et communiquer avec leurs confrères. Ces marques sont souvent gravées dans les murs, dessinées à la craie ou sculptées dans des poteaux en bois.",
    "symbols.guildTip": "Pour D&D 5e: Un Roublard maîtrisant le Jargon des Voleurs peut lire et laisser ces marques. Un test d'Intelligence (Investigation) DD 15 peut être nécessaire pour trouver les marques cachées.",
    "symbols.hoboTitle": "Signes des Vagabonds",
    "symbols.hoboDesc": "Symboles historiques utilisés par les voyageurs errants et les vagabonds pour laisser des messages aux autres. Ces marques simples transmettent des informations importantes sur la nourriture, le refuge, le danger et les opportunités.",
    "symbols.hoboTip": "Pour D&D 5e: Ces marques peuvent représenter les signes laissés par les marchands itinérants, les gens du voyage ou les pauvres des villes. Parfait pour ajouter du détail au monde de votre campagne.",
    "symbols.categoryLegend": "Légende des Catégories",
    "symbols.dmTips": "Conseils pour le MJ",
    "symbols.dmTip1": "Placez les marques de guilde près des entrées de tavernes, dans les ruelles ou sous les ponts",
    "symbols.dmTip2": "Faites référencer \"les marques\" par les PNJ lorsqu'ils donnent des directions aux roublards",
    "symbols.dmTip3": "Créez des accroches scénaristiques en faisant découvrir aux joueurs des marques contradictoires ou inhabituelles",
    "symbols.dmTip4": "Permettez aux Roublards de laisser leurs propres marques pour aider le groupe plus tard",
    "symbols.dmTip5": "Utilisez ces symboles comme éléments de puzzle dans des aventures de cambriolage ou urbaines",
    
    // Categories
    "category.Warning": "Avertissement",
    "category.Resource": "Ressource",
    "category.Direction": "Direction",
    "category.Info": "Info",
    "category.Safe": "Sûr",
    "category.Identity": "Identité",
    "category.Commerce": "Commerce",
    "category.Contact": "Contact",
    "category.Territory": "Territoire",
    "category.Target": "Cible",
    "category.Route": "Route",
    "category.Escape": "Évasion",
    "category.People": "Personnes",
    "category.Actions": "Actions",
    "category.Places": "Lieux",
    "category.Objects": "Objets",
    "category.Money": "Argent",
    "category.Law": "Loi",
    "category.Body": "Corps",
    "category.Food & Drink": "Nourriture et Boisson",
    "category.Clothing": "Vêtements",
    "category.Animals": "Animaux",
    "category.Descriptive": "Descriptif",
    "category.General": "Général",
    
    // Category descriptions
    "categoryDesc.Warning": "Danger devant",
    "categoryDesc.Resource": "Lieux utiles",
    "categoryDesc.Direction": "Guide de voyage",
    "categoryDesc.Info": "Informations générales",
    "categoryDesc.Safe": "Lieux sûrs",
    "categoryDesc.Identity": "Appartenance à la guilde",
    "categoryDesc.Commerce": "Opportunités commerciales",
    "categoryDesc.Contact": "Personnes à rencontrer",
    "categoryDesc.Territory": "Limites de la guilde",
    "categoryDesc.Target": "Cibles de valeur",
    "categoryDesc.Route": "Chemins de voyage",
    "categoryDesc.Escape": "Sorties rapides",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || translations.en[key] || key;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}
