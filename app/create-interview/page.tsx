"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  resume: z.instanceof(File).optional(),
  mode: z.enum(["hr", "technical"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  skills: z.string().min(1, "Please add at least one skill"),
  topic: z.string().min(1, "Please provide a topic/focus"),
  questions: z.enum(["5", "10", "15"]),
})

type FormState = z.infer<typeof formSchema>

const steps = ["Resume", "Details", "Skills & Topic", "Questions"]

export default function CreateInterviewPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<FormState>({
    resume: undefined,
    mode: "technical",
    difficulty: "medium",
    skills: "",
    topic: "",
    questions: "10",
  })

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  function validatePartial(forStep: number) {
    try {
      const partial =
        forStep === 0
          ? {}
          : forStep === 1
            ? { mode: form.mode, difficulty: form.difficulty }
            : forStep === 2
              ? { skills: form.skills || "x", topic: form.topic || "x" }
              : { questions: form.questions }
      formSchema.partial().parse(partial)
      setErrors({})
      return true
    } catch (e: any) {
      const formatted: Record<string, string> = {}
      for (const issue of e?.issues || []) {
        formatted[issue.path[0]] = issue.message
      }
      setErrors(formatted)
      return false
    }
  }

  function submit() {
    try {
      formSchema.parse(form)
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.round(Math.random() * 1e6)}`
      router.push(`/interview/${id}`)
    } catch (e: any) {
      const formatted: Record<string, string> = {}
      for (const issue of e?.issues || []) {
        formatted[issue.path[0]] = issue.message
      }
      setErrors(formatted)
    }
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Create Interview</h1>
        <p className="text-muted-foreground">A quick, guided setup.</p>
      </header>

      <Card className="mx-auto max-w-3xl p-6">
        <ol className="mb-6 grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`rounded-md border px-3 py-2 text-center text-sm ${
                i === step ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {s}
            </li>
          ))}
        </ol>

        <div className="relative min-h-64">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="resume" className="text-sm font-medium">
                    Upload Resume (optional)
                  </label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setForm((f) => ({ ...f, resume: e.target.files?.[0] }))}
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid gap-4 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <span className="text-sm font-medium">Interview Mode</span>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as FormState["mode"] }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="hr">HR</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Difficulty</span>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as FormState["difficulty"] }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid gap-4"
              >
                <div className="space-y-2">
                  <label htmlFor="skills" className="text-sm font-medium">
                    Skills
                  </label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, SQL"
                    value={form.skills}
                    onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                  />
                  {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="topic" className="text-sm font-medium">
                    What should the interview be based on?
                  </label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., System design for an e-commerce platform"
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  />
                  {errors.topic && <p className="text-sm text-destructive">{errors.topic}</p>}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid gap-4 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <span className="text-sm font-medium">Number of Questions</span>
                  <select
                    value={form.questions}
                    onChange={(e) => setForm((f) => ({ ...f, questions: e.target.value as FormState["questions"] }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>

                <div className="rounded-md border p-3 text-sm text-muted-foreground">
                  Tip: You can change answer mode (voice/text) during the interview anytime.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => {
                if (validatePartial(step + 1)) next()
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              Create Interview
            </button>
          )}
        </div>
      </Card>
    </main>
  )
}
