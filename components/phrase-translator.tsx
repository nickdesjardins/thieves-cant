"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { englishToCant, frenchToArgot, cantToEnglish, argotToFrench } from "@/lib/thieves-cant-data";
import { useI18n } from "@/lib/i18n";
import { Mic, Square, Volume2, Copy, Check, RefreshCw } from "lucide-react";

interface TranslatedWord {
  original: string;
  translated: string;
  isTranslated: boolean;
  alternatives?: string[];
}

export function PhraseTranslator() {
  const { language } = useI18n();
  const [phrase, setPhrase] = useState("");
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

  // Build lookup maps for faster translation
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

  // Translate the phrase
  const translatedWords = useMemo((): TranslatedWord[] => {
    if (!phrase.trim()) return [];
    
    // Split by whitespace while keeping punctuation attached to words
    const words = phrase.split(/(\s+)/);
    
    return words.map((word) => {
      // Skip whitespace
      if (/^\s+$/.test(word)) {
        return { original: word, translated: word, isTranslated: false };
      }
      
      // Extract punctuation
      const punctMatch = word.match(/^([^\w]*)(\w+)([^\w]*)$/);
      if (!punctMatch) {
        return { original: word, translated: word, isTranslated: false };
      }
      
      const [, leadingPunct, cleanWord, trailingPunct] = punctMatch;
      const lowerWord = cleanWord.toLowerCase();
      
      // Skip stop words entirely
      if (stopWords.has(lowerWord)) {
        return { original: word, translated: word, isTranslated: false };
      }
      
      // Check for exact match
      if (translationMap.has(lowerWord)) {
        const translations = translationMap.get(lowerWord)!;
        const firstTranslation = translations[0];
        
        // Preserve original capitalization style
        let translatedWord = firstTranslation;
        if (cleanWord[0] === cleanWord[0].toUpperCase()) {
          translatedWord = firstTranslation.charAt(0).toUpperCase() + firstTranslation.slice(1);
        }
        
        return {
          original: word,
          translated: leadingPunct + translatedWord + trailingPunct,
          isTranslated: true,
          alternatives: translations.length > 1 ? translations.slice(1) : undefined,
        };
      }
      
      // Check for partial matches (for compound words or phrases)
      for (const [key, translations] of translationMap.entries()) {
        if (lowerWord.includes(key) && key.length > 3) {
          const firstTranslation = translations[0];
          return {
            original: word,
            translated: leadingPunct + firstTranslation + trailingPunct,
            isTranslated: true,
            alternatives: translations.length > 1 ? translations.slice(1) : undefined,
          };
        }
      }
      
      return { original: word, translated: word, isTranslated: false };
    });
  }, [phrase, translationMap]);

  // Get the full translated phrase as string
  const translatedPhrase = useMemo(() => {
    return translatedWords.map(w => w.translated).join("");
  }, [translatedWords]);

  // Count translated words
  const translatedCount = useMemo(() => {
    return translatedWords.filter(w => w.isTranslated).length;
  }, [translatedWords]);

  // Voice recognition handler
  const toggleListening = useCallback(() => {
    if (typeof window === "undefined") return;

    if (isListening && activeRecognition.current) {
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
      recognition.continuous = true; // Still request continuous mode for desktop
      recognition.interimResults = true;
      
      let finalTranscript = phraseRef.current ? phraseRef.current + " " : "";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setPhrase(finalTranscript + interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        if (event.error === "no-speech") {
          // Ignore no-speech, let it restart onend
          return;
        }
        
        console.error("Speech recognition error", event.error);
        manualStopRef.current = true; // Prevent restart on hard errors
        
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
        // Mobile browsers often fire onend on silence. If not manually stopped, restart it.
        if (!manualStopRef.current) {
          startRecognition();
        } else {
          setIsListening(false);
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
    
  }, [language, isListening]);

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

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {language === "en" ? "Enter your phrase" : "Entrez votre phrase"}
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
            language === "en"
              ? "Type or speak a phrase... (e.g., 'The thief stole money at night')"
              : "Tapez ou parlez une phrase... (ex: 'Le voleur a pris l'argent la nuit')"
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
              <span>= {language === "en" ? "Translated to Cant" : "Traduit en Argot"}</span>
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
