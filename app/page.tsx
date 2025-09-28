"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/hero";
import AnimatedSection from "@/components/animated-section";
import NumberTicker from "@/components/number-ticker";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="h-10" aria-hidden />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <Hero />
        <motion.div
          className="mt-10 flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/create-interview"
              className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Start practicing ↗
            </Link>
            <Link
              href="#models"
              className="rounded-lg border border-border bg-background px-8 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              View interview modes
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <AnimatedSection className="border-t border-border bg-muted/30">
        <section className="container mx-auto px-4 py-16">
          <p className="text-center text-sm text-muted-foreground mb-12">
            Trusted by builders at
          </p>{" "}
          {/* Added trusted by section */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {["Google", "Microsoft", "Apple", "Meta", "Amazon"].map(
              (company) => (
                <div
                  key={company}
                  className="text-lg font-medium text-foreground"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">
                <NumberTicker value={50000} />+
              </div>
              <p className="text-muted-foreground">Interviews practiced</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">
                <NumberTicker value={95} />%
              </div>
              <p className="text-muted-foreground">Success rate improvement</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">
                <NumberTicker value={24} />
                /7
              </div>
              <p className="text-muted-foreground">Available coaching</p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Interview Modes Section */}
      <AnimatedSection className="border-t border-border bg-muted/30">
        <section id="models" className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Interview Modes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful coaching modes for a variety of real-world interview
              scenarios with personalized feedback.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "HR Interview",
                desc: "Smartest mode for behavioral questions",
                features: [
                  "Behavioral questions",
                  "Cultural fit assessment",
                  "Soft skills evaluation",
                ],
              },
              {
                title: "Technical Interview",
                desc: "Affordable mode balancing complexity and intelligence",
                features: [
                  "Coding challenges",
                  "System design",
                  "Problem solving",
                ],
              },
              {
                title: "Executive Interview",
                desc: "Fastest, most comprehensive mode for leadership roles",
                features: [
                  "Strategic thinking",
                  "Leadership scenarios",
                  "Vision alignment",
                ],
              },
            ].map((mode, i) => (
              <motion.div
                key={mode.title}
                className="rounded-xl border border-border bg-card p-8 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {mode.title}
                </h3>
                <p className="text-muted-foreground mb-6">{mode.desc}</p>
                <div className="space-y-2">
                  {mode.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection>
        <section id="how-it-works" className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              From the creators of AI coaching
            </h2>{" "}
            {/* Updated heading to match AI SDK style */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI Interview platform gives you the tools you need to build
              confidence and master any interview.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Unified Interview API",
                desc: "Switch between interview modes by changing a single line of code.",
                icon: "🔗",
              },
              {
                title: "Personalized Coaching",
                desc: "Create dynamic, AI-powered feedback that adapts to your responses.",
                icon: "🎯",
              },
              {
                title: "Multi-Modal Practice",
                desc: "Practice with voice, video, or text. Available across all platforms.",
                icon: "💬",
              },
              {
                title: "Real-Time Feedback",
                desc: "Don't let candidates wait for feedback. Send insights instantly.",
                icon: "⚡",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <div className="text-2xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="border-t border-border">
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview
            skills with AI coaching.
          </p>
          <Link
            href="/create-interview"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            Start your interview practice
            <span>↗</span>
          </Link>
        </section>
      </AnimatedSection>
    </main>
  );
}
