"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { englishToCant, frenchToArgot, cantToEnglish, argotToFrench } from "@/lib/thieves-cant-data";
import { useI18n } from "@/lib/i18n";
import { Mic, Square, Volume2, Copy, Check, RefreshCw, ArrowLeftRight } from "lucide-react";

interface TranslatedWord {
  original: string;
  translated: string;
  isTranslated: boolean;
  alternatives?: string[];
}

export function PhraseTranslator() {
  const { language } = useI18n();
  const [phrase, setPhrase] = useState("");
  const [direction, setDirection] = useState<"to-cant" | "from-cant">("to-cant");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Use a ref to keep track of the recognition instance so we can stop it
  const activeRecognition = useRef<any>(null);
  const manualStopRef = useRef<boolean>(false);
  const phraseRef = useRef<string>("");
  
  // Keep phraseRef in sync with phrase state
  useEffect(() => {
    phraseRef.current = phrase;
  }, [phrase]);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setSpeechSupported(!!SpeechRecognition);
    }
  }, []);

  // Common stop words that should NOT be translated
  const englishStopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "must", "shall", "can", "need", "dare", "ought", "used",
    "it", "its", "he", "she", "they", "them", "their", "his", "her", "him",
    "we", "us", "our", "you", "your", "i", "me", "my", "mine",
    "this", "that", "these", "those", "what", "which", "who", "whom", "whose",
    "where", "when", "why", "how", "all", "each", "every", "both", "few",
    "more", "most", "other", "some", "such", "no", "nor", "not", "only",
    "own", "same", "so", "than", "too", "very", "just", "also", "now",
    "and", "but", "or", "if", "then", "else", "because", "as", "until", "while",
    "of", "at", "by", "for", "with", "about", "against", "between", "into",
    "through", "during", "before", "after", "above", "below", "to", "from",
    "up", "down", "in", "out", "on", "off", "over", "under", "again",
    "further", "once", "here", "there", "any", "let", "get", "got"
  ]);

  const frenchStopWords = new Set([
    "le", "la", "les", "un", "une", "des", "du", "de", "au", "aux",
    "ce", "cet", "cette", "ces", "mon", "ma", "mes", "ton", "ta", "tes",
    "son", "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs",
    "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
    "me", "te", "se", "lui", "eux", "moi", "toi", "soi",
    "qui", "que", "quoi", "dont", "où", "lequel", "laquelle", "lesquels",
    "est", "sont", "était", "été", "être", "avoir", "avait", "ont", "eu",
    "fait", "faire", "dit", "dire", "peut", "pouvoir", "doit", "devoir",
    "et", "ou", "mais", "donc", "car", "ni", "or", "puis", "ensuite",
    "si", "quand", "comme", "pour", "par", "sur", "sous", "dans", "en",
    "avec", "sans", "chez", "vers", "entre", "avant", "après", "pendant",
    "plus", "moins", "très", "bien", "mal", "peu", "trop", "assez",
    "ne", "pas", "point", "jamais", "rien", "personne", "aucun",
    "tout", "tous", "toute", "toutes", "même", "autre", "autres",
    "ici", "là", "ceci", "cela", "oui", "non"
  ]);

  const stopWords = language === "en" ? englishStopWords : frenchStopWords;

  // Build lookup map for forward translation (EN/FR → Cant/Argot)
  const translationMap = useMemo(() => {
    const map = new Map<string, string[]>();
    
    if (language === "en") {
      // First add all explicit englishToCant entries (but skip stop words)
      Object.entries(englishToCant).forEach(([english, cantTerms]) => {
        const key = english.toLowerCase();
        if (!stopWords.has(key)) {
          map.set(key, cantTerms);
        }
      });
      
      // Then add reverse lookups from cantToEnglish definitions
      // This catches single words in definitions like "thief" -> "prig"
      cantToEnglish.forEach((entry) => {
        const defWords = entry.definition.toLowerCase().split(/[\s,;]+/);
        defWords.forEach((word) => {
          const cleanWord = word.replace(/[^a-z]/g, '');
          // Skip stop words and very short words
          if (cleanWord.length >= 3 && !stopWords.has(cleanWord) && !map.has(cleanWord)) {
            map.set(cleanWord, [entry.term]);
          } else if (cleanWord.length >= 3 && !stopWords.has(cleanWord) && map.has(cleanWord)) {
            // Add as alternative if not already present
            const existing = map.get(cleanWord)!;
            if (!existing.includes(entry.term)) {
              existing.push(entry.term);
            }
          }
        });
      });
    } else {
      // French: use frenchToArgot (but skip stop words)
      Object.entries(frenchToArgot).forEach(([french, argotTerms]) => {
        const key = french.toLowerCase();
        if (!stopWords.has(key)) {
          map.set(key, argotTerms.split(", "));
        }
      });
      
      // Also add reverse lookups from argotToFrench definitions
      argotToFrench.forEach((entry) => {
        const defWords = entry.definition.toLowerCase().split(/[\s,;()]+/);
        defWords.forEach((word) => {
          const cleanWord = word.replace(/[^a-zàâäéèêëïîôùûüç]/g, '');
          if (cleanWord.length >= 3 && !stopWords.has(cleanWord) && !map.has(cleanWord)) {
            map.set(cleanWord, [entry.term]);
          } else if (cleanWord.length >= 3 && !stopWords.has(cleanWord) && map.has(cleanWord)) {
            const existing = map.get(cleanWord)!;
            if (!existing.includes(entry.term)) {
              existing.push(entry.term);
            }
          }
        });
      });
    }
    
    return map;
  }, [language, stopWords]);

  // Build reverse lookup map for Cant/Argot → EN/FR
  const reverseTranslationMap = useMemo(() => {
    const map = new Map<string, string[]>();

    if (language === "en") {
      // cantToEnglish: DictionaryEntry[] — term is the Cant word, definition is English
      cantToEnglish.forEach((entry) => {
        const key = entry.term.toLowerCase();
        // Each definition may contain multiple English meanings separated by semicolons
        const meanings = entry.definition.split(/[;]+/).map((s) => s.trim()).filter(Boolean);
        if (!map.has(key)) {
          map.set(key, meanings);
        } else {
          const existing = map.get(key)!;
          meanings.forEach((m) => { if (!existing.includes(m)) existing.push(m); });
        }
      });
    } else {
      // argotToFrench: ArgotEntry[] — term is the Argot word, definition is French
      argotToFrench.forEach((entry) => {
        const key = entry.term.toLowerCase();
        const meanings = entry.definition.split(/[;]+/).map((s) => s.trim()).filter(Boolean);
        if (!map.has(key)) {
          map.set(key, meanings);
        } else {
          const existing = map.get(key)!;
          meanings.forEach((m) => { if (!existing.includes(m)) existing.push(m); });
        }
      });
    }

    return map;
  }, [language]);

  // Toggle direction and clear the phrase
  const toggleDirection = useCallback(() => {
    setDirection((d) => (d === "to-cant" ? "from-cant" : "to-cant"));
    setPhrase("");
    setSpeechError(null);
  }, []);


  // Translate the phrase
  const translatedWords = useMemo((): TranslatedWord[] => {
    if (!phrase.trim()) return [];

    // ── Forward mode (EN/FR → Cant/Argot) ────────────────────────────────
    if (direction === "to-cant") {
      const words = phrase.split(/(\s+)/);
      return words.map((word) => {
        if (/^\s+$/.test(word)) return { original: word, translated: word, isTranslated: false };
        const punctMatch = word.match(/^([^\w]*)(\w+(?:['-]\w+)*)([^\w]*)$/);
        if (!punctMatch) return { original: word, translated: word, isTranslated: false };
        const [, leadingPunct, cleanWord, trailingPunct] = punctMatch;
        const lowerWord = cleanWord.toLowerCase();
        if (stopWords.has(lowerWord)) return { original: word, translated: word, isTranslated: false };
        if (translationMap.has(lowerWord)) {
          const translations = translationMap.get(lowerWord)!;
          let translatedWord = translations[0];
          if (cleanWord[0] === cleanWord[0].toUpperCase())
            translatedWord = translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1);
          return { original: word, translated: leadingPunct + translatedWord + trailingPunct, isTranslated: true, alternatives: translations.slice(1) };
        }
        for (const [key, translations] of translationMap.entries()) {
          if (lowerWord.includes(key) && key.length > 3) {
            return { original: word, translated: leadingPunct + translations[0] + trailingPunct, isTranslated: true, alternatives: translations.slice(1) };
          }
        }
        return { original: word, translated: word, isTranslated: false };
      });
    }

    // ── Reverse mode (Cant/Argot → EN/FR): greedy multi-word scanner ─────
    // tokens alternates between content-words and whitespace: [word, " ", word, " ", …]
    const tokens = phrase.split(/(\s+)/);

    const stripPunct = (t: string) => {
      const m = t.match(/^([^\w]*)(\w+(?:['-]\w+)*)([^\w]*)$/);
      return m ? { lead: m[1], clean: m[2], trail: m[3] } : null;
    };

    const result: TranslatedWord[] = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      // Pass whitespace straight through
      if (/^\s+$/.test(token)) {
        result.push({ original: token, translated: token, isTranslated: false });
        i++;
        continue;
      }

      const p0 = stripPunct(token);
      if (!p0) {
        result.push({ original: token, translated: token, isTranslated: false });
        i++;
        continue;
      }

      // Try longest span first (4 words down to 2), then single-word fallback.
      // Content words are at indices i, i+2, i+4 (odd slots are whitespace).
      const MAX_SPAN = 4;
      let matched = false;

      for (let span = MAX_SPAN; span >= 2; span--) {
        // Collect content-word indices for this span
        const wordIndices: number[] = [];
        for (let k = 0; k < span; k++) {
          const idx = i + k * 2;
          if (idx >= tokens.length || /^\s+$/.test(tokens[idx])) break;
          wordIndices.push(idx);
        }
        if (wordIndices.length < span) continue;

        // Build the candidate key, e.g. "adam tiler"
        const candidateKey = wordIndices
          .map((idx) => (stripPunct(tokens[idx])?.clean ?? tokens[idx]).toLowerCase())
          .join(" ");

        if (reverseTranslationMap.has(candidateKey)) {
          const translations = reverseTranslationMap.get(candidateKey)!;
          const lastIdx = wordIndices[wordIndices.length - 1];
          const originalSpan = tokens.slice(i, lastIdx + 1).join("");
          const pLast = stripPunct(tokens[lastIdx]);
          const firstTranslation = translations[0];
          const display =
            p0.clean[0] === p0.clean[0].toUpperCase()
              ? firstTranslation.charAt(0).toUpperCase() + firstTranslation.slice(1)
              : firstTranslation;
          result.push({
            original: originalSpan,
            translated: p0.lead + display + (pLast?.trail ?? ""),
            isTranslated: true,
            alternatives: translations.length > 1 ? translations.slice(1) : undefined,
          });
          i = lastIdx + 1; // skip past all consumed tokens
          matched = true;
          break;
        }
      }

      if (matched) continue;

      // Single-word fallback
      const lowerWord = p0.clean.toLowerCase();
      if (reverseTranslationMap.has(lowerWord)) {
        const translations = reverseTranslationMap.get(lowerWord)!;
        let translatedWord = translations[0];
        if (p0.clean[0] === p0.clean[0].toUpperCase())
          translatedWord = translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1);
        result.push({
          original: token,
          translated: p0.lead + translatedWord + p0.trail,
          isTranslated: true,
          alternatives: translations.length > 1 ? translations.slice(1) : undefined,
        });
      } else {
        result.push({ original: token, translated: token, isTranslated: false });
      }
      i++;
    }

    return result;
  }, [phrase, direction, translationMap, reverseTranslationMap, stopWords]);


  // Get the full translated phrase as string
  const translatedPhrase = useMemo(() => {
    return translatedWords.map(w => w.translated).join("");
  }, [translatedWords]);

  // Count translated words
  const translatedCount = useMemo(() => {
    return translatedWords.filter(w => w.isTranslated).length;
  }, [translatedWords]);

  // Voice recognition handler
  // Voice recognition handler
  const toggleListening = useCallback(() => {
    if (typeof window === "undefined") return;

    // IF WE ARE ALREADY LISTENING (or trying to start)
    if (activeRecognition.current && !manualStopRef.current) {
      manualStopRef.current = true;
      activeRecognition.current.stop();
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(language === "en" ? "Speech recognition is not supported in this browser." : "La reconnaissance vocale n'est pas prise en charge.");
      return;
    }
    
    setSpeechError(null);
    setIsListening(true); // Optimistic UI update
    manualStopRef.current = false;
    
    const startRecognition = () => {
      if (manualStopRef.current) return;
      
      const recognition = new SpeechRecognition();
      activeRecognition.current = recognition;
      
      recognition.lang = language === "en" ? "en-US" : "fr-FR";
      recognition.continuous = false; // Trust our auto-restart to do continuous listening cleanly
      recognition.interimResults = true;
      
      const sessionBasePhrase = phraseRef.current 
        ? (phraseRef.current.endsWith(" ") ? phraseRef.current : phraseRef.current + " ") 
        : "";

      recognition.onstart = () => {
        if (activeRecognition.current !== recognition) return;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (activeRecognition.current !== recognition) return;
        
        // Accumulate all results for this session
        let sessionTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
          sessionTranscript += event.results[i][0].transcript;
        }
        
        // Smart deduplication for buggy Android browsers that return cumulative history across auto-restarts
        let newPhrase = "";
        const baseTrimmed = sessionBasePhrase.trim().toLowerCase();
        const finalSessionTrimmed = sessionTranscript.trim().toLowerCase();
        
        if (baseTrimmed && (finalSessionTrimmed === baseTrimmed || finalSessionTrimmed.startsWith(baseTrimmed + " "))) {
          // The browser retained the old speech history across restarts, just use its cumulative string
          newPhrase = sessionTranscript;
        } else {
          // Standard browser behavior: prepend our base phrase
          const needsSpace = sessionBasePhrase && !sessionBasePhrase.endsWith(" ") && sessionTranscript && !sessionTranscript.startsWith(" ");
          newPhrase = sessionBasePhrase + (needsSpace ? " " : "") + sessionTranscript;
        }
        
        setPhrase(newPhrase);
      };
      
      recognition.onerror = (event: any) => {
        if (activeRecognition.current !== recognition) return;
        
        if (event.error === "no-speech") {
          return;
        }
        
        console.error("Speech recognition error", event.error);
        manualStopRef.current = true;
        
        if (event.error === "network") {
          setSpeechError(
            language === "en"
              ? "Network error: Browser speech recognition service failed to connect."
              : "Erreur réseau : Le service vocal du navigateur n'a pas pu se connecter."
          );
        } else if (event.error === "not-allowed") {
          setSpeechError(
             language === "en"
              ? "Microphone access denied. Please allow microphone permissions."
              : "Accès au microphone refusé. Veuillez autoriser l'accès."
          );
        } else {
          setSpeechError(
             language === "en"
              ? `Speech recognition error: ${event.error}`
              : `Erreur de reconnaissance vocale: ${event.error}`
          );
        }
        setIsListening(false);
      };
      
      recognition.onend = () => {
        if (activeRecognition.current !== recognition) return;
        
        if (!manualStopRef.current) {
          startRecognition();
        } else {
          setIsListening(false);
          activeRecognition.current = null;
        }
      };
      
      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
        manualStopRef.current = true;
        setSpeechError(
          language === "en"
            ? "Failed to start microphone. Note: Speech Recognition over a local network IP requires a secure HTTPS connection."
            : "Échec du démarrage du microphone. Remarque : La reconnaissance vocale sur un réseau local nécessite une connexion HTTPS."
        );
        setIsListening(false);
      }
    };
    
    // Kick off the first recognition session
    startRecognition();
    
  }, [language]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(translatedPhrase);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [translatedPhrase]);

  // Text-to-speech
  const speakPhrase = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(translatedPhrase);
    utterance.lang = language === "en" ? "en-US" : "fr-FR";
    window.speechSynthesis.speak(utterance);
  }, [translatedPhrase, language]);

  // Clear phrase
  const clearPhrase = useCallback(() => {
    setPhrase("");
    setSpeechError(null);
  }, []);

  // Labels that change with direction
  const fromLabel = language === "en"
    ? (direction === "to-cant" ? "English" : "Thieves\' Cant")
    : (direction === "to-cant" ? "Français" : "Argot");
  const toLabel = language === "en"
    ? (direction === "to-cant" ? "Thieves\' Cant" : "English")
    : (direction === "to-cant" ? "Argot" : "Français");

  return (
    <div className="space-y-6">
      {/* Direction Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-semibold transition-colors ${
          direction === "to-cant" ? "text-primary" : "text-muted-foreground"
        }`}>
          {fromLabel}
        </span>
        <button
          type="button"
          onClick={toggleDirection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/50 hover:border-primary/50 hover:bg-primary/10 text-foreground transition-all text-xs font-medium"
          title={direction === "to-cant"
            ? (language === "en" ? "Switch to Cant → English" : "Passer en Argot → Français")
            : (language === "en" ? "Switch to English → Cant" : "Passer en Français → Argot")}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {language === "en" ? "Switch" : "Inverser"}
        </button>
        <span className={`text-sm font-semibold transition-colors ${
          direction === "from-cant" ? "text-primary" : "text-muted-foreground"
        }`}>
          {toLabel}
        </span>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {language === "en"
              ? (direction === "to-cant" ? "Enter your phrase" : "Enter Cant phrase")
              : (direction === "to-cant" ? "Entrez votre phrase" : "Entrez votre phrase en Argot")}
          </label>
          <div className="flex items-center gap-2">
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-lg border transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-500 border-red-500/50 animate-pulse"
                    : "bg-secondary/50 border-border hover:border-primary/50 text-foreground"
                }`}
                title={isListening 
                  ? (language === "en" ? "Stop listening" : "Arrêter l'écoute") 
                  : (language === "en" ? "Voice input" : "Entrée vocale")}
              >
                {isListening ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={clearPhrase}
              disabled={!phrase}
              className="p-2 rounded-lg border bg-secondary/50 border-border hover:border-primary/50 text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={language === "en" ? "Clear" : "Effacer"}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder={
            direction === "to-cant"
              ? (language === "en"
                  ? "Type or speak a phrase... (e.g., 'The thief stole money at night')"
                  : "Tapez ou parlez une phrase... (ex: 'Le voleur a pris l'argent la nuit')")
              : (language === "en"
                  ? "Type a Cant phrase... (e.g., 'The prig tipped the blunt at darkmans')"
                  : "Tapez une phrase en Argot... (ex: 'L\'Arnaque abloquit la balle')")
          }
          className="w-full h-32 p-4 text-lg rounded-lg bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none"
        />
        
        {speechError && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            {speechError}
          </div>
        )}
        
        {isListening && !speechError && (
          <div className="flex items-center gap-2 text-primary text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {language === "en" ? "Listening..." : "Écoute en cours..."}
          </div>
        )}
      </div>

      {/* Translation Result */}
      {phrase && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {language === "en" ? "Translated phrase" : "Phrase traduite"}
              {` (${toLabel})`}
              {translatedCount > 0 && (
                <span className="ml-2 text-xs text-primary">
                  ({translatedCount} {language === "en" ? "words translated" : "mots traduits"})
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={speakPhrase}
                disabled={!translatedPhrase}
                className="p-2 rounded-lg border bg-secondary/50 border-border hover:border-primary/50 text-foreground disabled:opacity-50 transition-all"
                title={language === "en" ? "Listen" : "Écouter"}
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!translatedPhrase}
                className="p-2 rounded-lg border bg-secondary/50 border-border hover:border-primary/50 text-foreground disabled:opacity-50 transition-all"
                title={language === "en" ? "Copy" : "Copier"}
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-background border-2 border-border min-h-[8rem]">
            <p className="text-lg leading-relaxed">
              {translatedWords.map((word, i) => (
                <span
                  key={i}
                  className={
                    word.isTranslated
                      ? "bg-primary/20 text-primary font-medium px-1 rounded cursor-help"
                      : ""
                  }
                  title={
                    word.isTranslated
                      ? `${language === "en" ? "Original" : "Original"}: "${word.original}"${
                          word.alternatives
                            ? ` | ${language === "en" ? "Alternatives" : "Alternatives"}: ${word.alternatives.join(", ")}`
                            : ""
                        }`
                      : undefined
                  }
                >
                  {word.translated}
                </span>
              ))}
            </p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">
                {language === "en" ? "word" : "mot"}
              </span>
              <span>= {language === "en" ? `Translated to ${toLabel}` : `Traduit en ${toLabel}`}</span>
            </div>
            <span className="hidden sm:inline">
              {language === "en" ? "(hover for original)" : "(survolez pour l'original)"}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      {!phrase && (
        <div className="bg-background/50 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-semibold text-primary mb-2">
            {language === "en" ? "Tips" : "Conseils"}
          </h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {direction === "to-cant" ? (
              <>
                <li>
                  {language === "en"
                    ? "Type or speak a full sentence in English"
                    : "Tapez ou parlez une phrase complète en français"}
                </li>
                <li>
                  {language === "en"
                    ? "Words with Cant translations will be highlighted"
                    : "Les mots avec des traductions en Argot seront surlignés"}
                </li>
                <li>
                  {language === "en"
                    ? "Hover over highlighted words to see the original"
                    : "Survolez les mots surlignés pour voir l'original"}
                </li>
                <li>
                  {language === "en"
                    ? "Some words may have multiple translations - hover to see alternatives"
                    : "Certains mots peuvent avoir plusieurs traductions - survolez pour voir les alternatives"}
                </li>
              </>
            ) : (
              <>
                <li>
                  {language === "en"
                    ? "Type a Cant phrase to translate it back to English"
                    : "Tapez une phrase en Argot pour la traduire en Français"}
                </li>
                <li>
                  {language === "en"
                    ? "Recognised Cant words will be highlighted in the output"
                    : "Les mots d'Argot reconnus seront surlignés dans la traduction"}
                </li>
                <li>
                  {language === "en"
                    ? "Hover over highlighted words to see the Cant original"
                    : "Survolez les mots surlignés pour voir l'Argot original"}
                </li>
                <li>
                  {language === "en"
                    ? "Use the Switch button to go back to English → Cant mode"
                    : "Utilisez le bouton Inverser pour revenir en mode Français → Argot"}
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
