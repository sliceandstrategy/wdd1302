"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Dna,
  WormIcon as Virus,
  FlaskRoundIcon as Flask,
  Users,
  Microscope,
  Globe2,
  GanttChartSquare,
  Beaker,
  Share2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const [activeTab, setActiveTab] = useState("ai")

  return (
    <div ref={containerRef} className="relative bg-white">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-primary">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dna className="w-[800px] h-[800px] text-secondary opacity-20 animate-dna-spin" />
          </div>
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virevo-kJYQZpBFHSZVoeQml8ALLJionwIJUu.webp"
            alt="Virevo Logo"
            className="w-32 h-32 mx-auto mb-8"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Revolutionizing
              <span className="text-secondary block mt-2">Pharmaceutical Science</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
              Pioneering breakthrough treatments through innovative research and cutting-edge technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
                Explore Research
              </Button>
              <Button size="lg" className="bg-white hover:bg-white/90 text-primary font-semibold">
                View Publications
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            animate={{
              x: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
              y: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Virus className="w-8 h-8 text-accent opacity-30" />
          </motion.div>
        ))}
      </div>

      {/* Our Process Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From discovery to development, our comprehensive approach ensures excellence at every stage
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-secondary/20" />
            {[
              {
                title: "Discovery",
                description: "Identifying novel compounds and therapeutic targets through advanced screening",
                icon: Microscope,
                side: "left",
              },
              {
                title: "Pre-clinical Research",
                description: "Rigorous testing and validation of potential drug candidates",
                icon: Flask,
                side: "right",
              },
              {
                title: "Clinical Trials",
                description: "Comprehensive testing through multiple trial phases",
                icon: Users,
                side: "left",
              },
              {
                title: "Development",
                description: "Scaling up production while maintaining highest quality standards",
                icon: Beaker,
                side: "right",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: step.side === "left" ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`relative flex items-center mb-12 ${step.side === "left" ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-1/2 ${step.side === "left" ? "pr-12 text-right" : "pl-12"}`}>
                  <div className={`flex items-center gap-4 ${step.side === "left" ? "justify-end" : ""}`}>
                    <step.icon className="w-8 h-8 text-secondary" />
                    <h3 className="text-2xl font-bold text-primary">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-secondary rounded-full" />
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Innovation */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Technology & Innovation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging cutting-edge technology to advance pharmaceutical research
            </p>
          </motion.div>

          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
              <TabsTrigger value="ai" className="text-lg py-4">
                AI & Machine Learning
              </TabsTrigger>
              <TabsTrigger value="biotech" className="text-lg py-4">
                Biotechnology
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-lg py-4">
                Advanced Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="mt-8">
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">AI-Powered Drug Discovery</h3>
                    <p className="text-gray-600 mb-4">
                      Our AI algorithms analyze vast datasets to identify promising drug candidates and predict their
                      effectiveness, significantly accelerating the discovery process.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Molecular structure prediction",
                        "Drug-target interaction analysis",
                        "Automated screening processes",
                        "Pattern recognition in clinical data",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg" />
                    <div className="relative p-6">
                      <Dna className="w-full h-full text-secondary opacity-50" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="biotech" className="mt-8">
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Advanced Biotechnology</h3>
                    <p className="text-gray-600 mb-4">
                      State-of-the-art biotech facilities enabling breakthrough discoveries in gene therapy, protein
                      engineering, and cellular biology.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "CRISPR gene editing",
                        "Protein crystallography",
                        "High-throughput screening",
                        "Cellular imaging",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg" />
                    <div className="relative p-6">
                      <Microscope className="w-full h-full text-secondary opacity-50" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="mt-8">
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Data Analytics Platform</h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive data analysis tools providing deep insights into drug performance, patient
                      responses, and research outcomes.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Real-time data processing",
                        "Predictive modeling",
                        "Clinical trial analytics",
                        "Research visualization",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg" />
                    <div className="relative p-6">
                      <GanttChartSquare className="w-full h-full text-secondary opacity-50" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-24 px-4 bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Global Impact</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Making a difference in healthcare across the globe
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                region: "North America",
                stats: "40+ Research Partners",
                impact: "Leading clinical trials and research initiatives",
              },
              {
                region: "Europe",
                stats: "25+ Countries",
                impact: "Extensive distribution network and research collaboration",
              },
              {
                region: "Asia Pacific",
                stats: "15+ Manufacturing Sites",
                impact: "State-of-the-art production facilities",
              },
            ].map((region, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 p-6 rounded-lg backdrop-blur-sm"
              >
                <Globe2 className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{region.region}</h3>
                <p className="text-white/80 font-bold mb-2">{region.stats}</p>
                <p className="text-white/60">{region.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">News & Updates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about our latest developments and achievements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Breakthrough in Cancer Research",
                date: "February 2024",
                category: "Research",
                excerpt: "New findings show promising results in targeted therapy development.",
              },
              {
                title: "Global Partnership Announcement",
                date: "January 2024",
                category: "Partnership",
                excerpt: "Strategic collaboration with leading research institutions worldwide.",
              },
              {
                title: "Innovation Award 2024",
                date: "January 2024",
                category: "Achievement",
                excerpt: "Recognition for outstanding contributions to pharmaceutical science.",
              },
            ].map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <Badge className="mb-4" variant="secondary">
                    {news.category}
                  </Badge>
                  <h3 className="text-xl font-semibold text-primary mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4">{news.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{news.date}</span>
                    <Button variant="link" className="text-secondary">
                      Read More
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Collaborators */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Partners & Collaborators</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Working together with leading institutions to advance pharmaceutical research
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center p-8 bg-gray-50 rounded-lg"
              >
                <img
                  src={`/placeholder.svg?height=80&width=160`}
                  alt={`Partner ${i + 1}`}
                  className="max-h-20 opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virevo-kJYQZpBFHSZVoeQml8ALLJionwIJUu.webp"
                  alt="Virevo Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold">Virevo</span>
              </div>
              <p className="text-white/60 mb-4">Advancing pharmaceutical science through innovation and research</p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-secondary">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    About Us
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Research
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Publications
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Careers
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Research Areas</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Drug Development
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Clinical Trials
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Biotechnology
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-white/60 hover:text-white p-0">
                    Research Pipeline
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-white/60">
                <li>1234 Research Park Drive</li>
                <li>Cambridge, MA 02142</li>
                <li>contact@virevo.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} Virevo Pharmaceuticals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

