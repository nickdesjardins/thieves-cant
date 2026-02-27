"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  BookOpen,
  Languages,
  Shapes,
  Shield,
  ScrollText,
  MessageCircle,
  Sword,
  Eye,
} from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-10">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="text-center mb-16">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Eye className="h-3.5 w-3.5" />
            {t("home.hero.badge")}
          </span>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-primary text-glow mb-6 leading-tight">
            {t("home.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto aged-text mb-10 leading-relaxed">
            {t("home.hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/translator"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              <Languages className="h-5 w-5" />
              {t("home.hero.cta.translate")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dictionary"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-border hover:border-primary/50 bg-card text-foreground font-semibold text-base transition-all hover:scale-105 active:scale-95"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              {t("home.hero.cta.learn")}
            </Link>
          </div>
        </section>

        {/* ── WHAT IS THIEVES' CANT ─────────────────────────── */}
        <section className="mb-14">
          <div className="parchment ornate-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <ScrollText className="h-6 w-6 text-primary shrink-0" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-primary text-glow">
                {t("home.what.title")}
              </h2>
            </div>

            <p className="text-foreground/85 text-base leading-relaxed mb-6 aged-text">
              {t("home.what.body")}
            </p>

            {/* Quote block */}
            <blockquote className="border-l-4 border-primary/50 pl-5 py-3 bg-background/40 rounded-r-lg">
              <p className="text-primary font-semibold italic text-lg mb-1">
                {t("home.what.quote")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("home.what.quoteTranslation")}
              </p>
            </blockquote>
          </div>
        </section>

        {/* ── BASIC RULES ──────────────────────────────────── */}
        <section className="mb-14">
          <div className="parchment ornate-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="h-6 w-6 text-primary shrink-0" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-primary text-glow">
                {t("home.rules.title")}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              {t("home.rules.subtitle")}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* 4x Speaking Time */}
              <div className="bg-background/50 rounded-lg border border-primary/30 p-5 flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/20 border border-primary/40 text-xl font-bold text-primary font-[family-name:var(--font-display)]">
                  4×
                </div>
                <div>
                  <h3 className="text-primary font-semibold mb-1">{t("home.rules.time.title")}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{t("home.rules.time.desc")}</p>
                </div>
              </div>

              {/* Secret by Design */}
              <div className="bg-background/50 rounded-lg border border-border p-5 flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/60 border border-border text-xl">
                  🤫
                </div>
                <div>
                  <h3 className="text-primary font-semibold mb-1">{t("home.rules.secret.title")}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{t("home.rules.secret.desc")}</p>
                </div>
              </div>

              {/* Rogue Class Feature */}
              <div className="bg-background/50 rounded-lg border border-border p-5 flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/60 border border-border text-xl">
                  🗡️
                </div>
                <div>
                  <h3 className="text-primary font-semibold mb-1">{t("home.rules.rogue.title")}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{t("home.rules.rogue.desc")}</p>
                </div>
              </div>

              {/* Written Code */}
              <div className="bg-background/50 rounded-lg border border-border p-5 flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/60 border border-border text-xl">
                  ✍️
                </div>
                <div>
                  <h3 className="text-primary font-semibold mb-1">{t("home.rules.written.title")}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{t("home.rules.written.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CORE CONCEPTS ────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-primary text-glow text-center mb-8">
            {t("home.concepts.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Words */}
            <div className="parchment ornate-border rounded-lg p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-primary font-semibold text-lg mb-2">
                {t("home.concepts.words.title")}
              </h3>
              <p className="text-foreground/75 text-sm leading-relaxed mb-4 flex-1">
                {t("home.concepts.words.desc")}
              </p>
              <div className="bg-background/60 rounded border border-border p-3">
                <p className="text-xs text-muted-foreground italic">
                  {t("home.concepts.words.example")}
                </p>
              </div>
              <Link
                href="/translator"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t("home.cta.translator.btn")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Phrases */}
            <div className="parchment ornate-border rounded-lg p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 mb-4">
                <Languages className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-primary font-semibold text-lg mb-2">
                {t("home.concepts.phrases.title")}
              </h3>
              <p className="text-foreground/75 text-sm leading-relaxed mb-4 flex-1">
                {t("home.concepts.phrases.desc")}
              </p>
              <div className="bg-background/60 rounded border border-border p-3">
                <p className="text-xs text-muted-foreground italic">
                  {t("home.concepts.phrases.example")}
                </p>
              </div>
              <Link
                href="/dictionary"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t("home.cta.dictionary.btn")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Symbols */}
            <div className="parchment ornate-border rounded-lg p-6 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 mb-4">
                <Shapes className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-primary font-semibold text-lg mb-2">
                {t("home.concepts.symbols.title")}
              </h3>
              <p className="text-foreground/75 text-sm leading-relaxed mb-4 flex-1">
                {t("home.concepts.symbols.desc")}
              </p>
              <div className="bg-background/60 rounded border border-border p-3">
                <p className="text-xs text-muted-foreground italic">
                  {t("home.concepts.symbols.example")}
                </p>
              </div>
              <Link
                href="/symbols"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t("home.cta.symbols.btn")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── EXAMPLE CONVERSATION ─────────────────────────── */}
        <section className="mb-14">
          <div className="parchment ornate-border rounded-lg p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-primary text-glow mb-2">
              {t("home.examples.title")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t("home.examples.subtitle")}
            </p>

            {/* Scene setter */}
            <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground italic">
              <span className="flex-1 h-px bg-border" />
              <span>⚔ {t("home.examples.scene")} ⚔</span>
              <span className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-5">
              {/* Line 1 */}
              <div className="bg-background/50 rounded-lg border border-border p-5">
                <p className="text-primary font-semibold text-base mb-2">
                  {t("home.examples.line1.cant")}
                </p>
                <p className="text-muted-foreground text-sm italic">
                  {t("home.examples.line1.english")}
                </p>
              </div>

              {/* Line 2 */}
              <div className="bg-background/50 rounded-lg border border-border p-5">
                <p className="text-primary font-semibold text-base mb-2">
                  {t("home.examples.line2.cant")}
                </p>
                <p className="text-muted-foreground text-sm italic">
                  {t("home.examples.line2.english")}
                </p>
              </div>

              {/* Line 3 */}
              <div className="bg-background/50 rounded-lg border border-border p-5">
                <p className="text-primary font-semibold text-base mb-2">
                  {t("home.examples.line3.cant")}
                </p>
                <p className="text-muted-foreground text-sm italic">
                  {t("home.examples.line3.english")}
                </p>
              </div>
            </div>

            {/* CTA below example */}
            <div className="mt-6 text-center">
              <Link
                href="/translator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                <Languages className="h-4 w-4" />
                {t("home.hero.cta.translate")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA CARDS ────────────────────────────────────── */}
        <section className="mb-14">
          <div className="grid md:grid-cols-3 gap-5">
            {/* Translator */}
            <div className="parchment rounded-lg border-2 border-border hover:border-primary/50 transition-all p-6 flex flex-col gap-4 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-2xl group-hover:bg-primary/20 transition-colors">
                ⚔️
              </div>
              <div className="flex-1">
                <h3 className="text-primary font-semibold text-lg mb-2">
                  {t("home.cta.translator.title")}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {t("home.cta.translator.desc")}
                </p>
              </div>
              <Link
                href="/translator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all self-start"
              >
                {t("home.cta.translator.btn")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Dictionary */}
            <div className="parchment rounded-lg border-2 border-border hover:border-primary/50 transition-all p-6 flex flex-col gap-4 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-2xl group-hover:bg-primary/20 transition-colors">
                📖
              </div>
              <div className="flex-1">
                <h3 className="text-primary font-semibold text-lg mb-2">
                  {t("home.cta.dictionary.title")}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {t("home.cta.dictionary.desc")}
                </p>
              </div>
              <Link
                href="/dictionary"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all self-start"
              >
                {t("home.cta.dictionary.btn")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Symbols */}
            <div className="parchment rounded-lg border-2 border-border hover:border-primary/50 transition-all p-6 flex flex-col gap-4 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-2xl group-hover:bg-primary/20 transition-colors">
                🔱
              </div>
              <div className="flex-1">
                <h3 className="text-primary font-semibold text-lg mb-2">
                  {t("home.cta.symbols.title")}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {t("home.cta.symbols.desc")}
                </p>
              </div>
              <Link
                href="/symbols"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all self-start"
              >
                {t("home.cta.symbols.btn")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── D&D 5e TIPS ──────────────────────────────────── */}
        <section className="mb-10">
          <div className="parchment ornate-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sword className="h-6 w-6 text-primary shrink-0" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-primary text-glow">
                {t("home.dnd.title")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-6">
              <div className="bg-background/50 rounded border border-border p-4">
                <div className="text-2xl mb-2">🎲</div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t("home.dnd.rogue")}
                </p>
              </div>
              <div className="bg-background/50 rounded border border-border p-4">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t("home.dnd.dm")}
                </p>
              </div>
              <div className="bg-background/50 rounded border border-border p-4">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t("home.dnd.ingame")}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/translator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
              >
                <Shield className="h-4 w-4" />
                {t("home.dnd.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER NOTE ──────────────────────────────────── */}
        <p className="text-center text-xs text-muted-foreground">
          Based on the &quot;Dictionary of the Vulgar Tongue&quot; (1811) by Captain Francis Grose
          &amp; &quot;Le nouveau dictionnaire complet du jargon de l&apos;argot&quot; (1849) by Arthur Halbert d&apos;Angers
        </p>
      </main>
    </div>
  );
}
