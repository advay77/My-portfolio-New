"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, Code, Github, Linkedin, Mail, Send, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const sections = ["home", "about", "skills", "projects", "contact"]

  // Add a meta viewport tag to ensure proper mobile rendering
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    document.getElementsByTagName("head")[0].appendChild(meta)

    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta)
    }
  }, [])

  // Matrix background effect
  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * canvas.height) / fontSize)
    }

    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%"

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)

    const handleResize = () => {
      resizeCanvas()
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor((Math.random() * canvas.height) / fontSize)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Intersection Observer for section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) observer.unobserve(element)
      })
    }
  }, [sections])

  // Fade-in animations for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Matrix Background */}
      <canvas
        ref={matrixCanvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-30"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      />

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 h-1 bg-green-500 z-50" style={{ width: `${(activeSection === "home" ? 0 : sections.indexOf(activeSection) / (sections.length - 1)) * 100}%` }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-green-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-green-500">Advay Anand</div>
          <div className="hidden md:flex space-x-6">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`capitalize transition-colors ${
                  activeSection === section ? "text-green-500" : "text-gray-400 hover:text-white"
                }`}
              >
                {section}
              </a>
            ))}
          </div>
          <div className="flex md:hidden">
            <div className="relative group">
              <Button variant="ghost" size="sm" className="border border-green-500/30">
                Menu
              </Button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 border border-green-500/30 rounded-md hidden group-hover:block z-50">
                {sections.map((section) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    className={`block px-4 py-2 capitalize hover:bg-green-500/10 ${
                      activeSection === section ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {section}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <motion.section
        id="home"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center">
          <div className="mb-6 md:mb-8 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-500 overflow-hidden">
              <Image
                src="P1.jpg?height=160&width=160"
                alt="Advay Anand"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-black p-2 rounded-full border border-green-500">
              <Code className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
            <span className="text-white">I'm </span>
            <span className="text-green-500">Advay Anand</span>
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 text-gray-300">Full Stack Web Developer</h2>
          <p className="max-w-2xl text-gray-400 mb-6 md:mb-10 text-sm md:text-base">
            Building modern web applications with cutting-edge technologies. Passionate about creating seamless user
            experiences and robust backend systems.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Button asChild size="sm" className="bg-green-500 hover:bg-green-600">
              <a href="#projects">View My Work</a>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10"
            >
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
          <div className="flex gap-4 mt-6 md:mt-10">
            <Link
              href="https://github.com/advay77"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/advay-anand-a89024277/"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="advayanand87@gmail.com" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          <a
            href="#about"
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white transition-colors animate-bounce"
          >
            <ArrowDown className="w-6 h-6" />
            <span className="sr-only">Scroll Down</span>
          </a>
        </div>
      </motion.section>

      {/* About Me Section */}
      <motion.section
        id="about"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            About <span className="text-green-500">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold mb-4">Who am I?</h3>
              <p className="text-gray-300 mb-4">
                I'm Advay Anand, a passionate Full Stack Web Developer with expertise in building modern web
                applications. With a strong foundation in both frontend and backend technologies, I create seamless
                digital experiences that solve real-world problems.
              </p>
              <p className="text-gray-300 mb-6">
                I have experience working with JavaScript, React, Node.js, and various database
                technologies. My approach combines technical excellence with creative problem-solving to deliver
                solutions that exceed expectations.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Name:</p>
                  <p className="font-medium">Advay Anand</p>
                </div>
                <div>
                  <p className="text-gray-400">Email:</p>
                  <p className="font-medium">advayanand87@gmail.com</p>
                </div>
                <div>
                  <p className="text-gray-400">From:</p>
                  <p className="font-medium">Prayagraj, India</p>
                </div>
                <div>
                  <p className="text-gray-400">Freelance:</p>
                  <p className="font-medium text-green-500">Available</p>
                </div>
              </div>
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <a href="https://drive.google.com/file/d/1O-J8BBNPlorNZbNd3mt4f7iT2KJrI-Ru/view?usp=drivesdk" download>
                  Download Resume
                </a>
              </Button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-4 border-green-500/50">
                  <Image
                    src="/P2.jpg?height=320&width=320"
                    alt="Advay Anand"
                    width={320}
                    height={320}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black p-3 rounded-lg border border-green-500">
                  <User className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        id="skills"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            My <span className="text-green-500">Skills</span>
          </h2>
          <div className="grid grid-cols-1 gap-10">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Technical Skills</h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  { name: "JavaScript/TypeScript", percentage: 90 },
                  { name: "React/Next.js", percentage: 85 },
                  { name: "Node.js/Express", percentage: 80 },
                  { name: "HTML/CSS", percentage: 95 },
                  { name: "MongoDB/SQL", percentage: 75 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-400">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${skill.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Professional Skills</h3>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {[
                  { name: "Communication", percentage: 85 },
                  { name: "Teamwork", percentage: 90 },
                  { name: "Problem Solving", percentage: 95 },
                  { name: "Creativity", percentage: 80 },
                  { name: "Project Management", percentage: 75 },
                  { name: "Adaptability", percentage: 85 },
                ].map((skill) => (
                  <div key={skill.name} className="relative">
                    <svg className="w-full h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="8"
                        strokeDasharray={`${(2 * Math.PI * 40 * skill.percentage) / 100} ${2 * Math.PI * 40 * (1 - skill.percentage / 100)}`}
                        strokeDashoffset={2 * Math.PI * 40 * 0.25}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-xl font-bold">{skill.percentage}%</div>
                      <div className="text-sm text-gray-400">{skill.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 md:mt-16">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Technologies I Work With</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Express",
                "MongoDB",
                "PostgreSQL",
                "GraphQL",
                "Redux",
                "Tailwind CSS",
                "Git",
              ].map((tech) => (
                <div
                  key={tech}
                  className="bg-black/50 border border-green-500/30 rounded-lg p-4 text-center hover:border-green-500 transition-colors"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            My <span className="text-green-500">Projects</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                title: "Health Website (Instant-Care 👨🏻‍⚕️)",
                description:
                  "A website consisting of medical treatment with ayurved features like- bed booking,blood bank, chatbot,etc.",
                tech: ["React", "Flask", "MongoDB", "JavaScript"],
                image: "/photo1.png?height=200&width=300",
              },
              {
                title: "Capture The Flag (CTF🚩)",
                description: "Made this because of organising a hackathon used various technologies in it.",
                tech: ["HTML", "CSS", "Java-Script", "Flask"],
                image: "/photo5.png?height=200&width=300",
              },
              {
                title: "Coffee Website (Brew-Heaven☕)",
                description: "Coffee Website with uniques features and great UI with maps feature avialable.",
                tech: ["React", "Java-Script","Node.js/Express", "Tailwind-Css", "MongoDB"],
                image: "/photo2.png?height=200&width=300",
              },
              {
                title: "Portfolio Website Ø",
                description: "Custom portfolio website with animations and responsive design.",
                tech: ["Typescript", "Taillwind-css", "JavaScript", "React.js", "ShadcnUI", "MongoDb"],
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                title: "Restaurant Website (RESTORAN 🍴🥗)",
                description: "A restaurant website made for fun and to get your watery mouth",
                tech: ["React", "Javascript","TypeScript", "Tailwind CSS", "Flask/Python"],
                image: "/photo3.png?height=200&width=300",
              },
              {
                title: "Jal-Saaf-Tech 💧",
                description: "Website made for water security with an IOT Device embedded and maps feature",
                tech: ["React.js", "Tailwaind CSS", "Flask/Python", "MongoDB",],
                image: "/photo4.png?height=200&width=300",
              },
            ].map((project, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-500/30 overflow-hidden hover:border-green-500 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image || "/placeholder-logo.svg"}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                    >
                      View Demo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                    >
                      Source Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Contact <span className="text-green-500">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <p className="text-gray-300 mb-8">
                Feel free to reach out if you're looking for a developer, have a question, or just want to connect.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-400">advayanand87@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Github className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <p className="text-gray-400">https://github.com/advay77/advayanand</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Linkedin className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">LinkedIn</h4>
                    <p className="text-gray-400">https://www.linkedin.com/in/advay-anand-a89024277/advayanand</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
              <form className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your Email"
                      className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="Subject"
                      className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base"
                    />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your Message"
                    rows={4}
                    className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base"
                  />
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-sm md:text-base">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-green-500/20 bg-black/80">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold text-green-500 mb-4 md:mb-0">Advay Anand</div>
            <div className="flex gap-4">
              <Link
                href="https://github.com/advay77"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/advay-anand-a89024277/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="mailto:advayanand87@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Advay Anand. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
