"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, Code, Github, Linkedin, Mail, Send, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const sections = ["home", "about", "skills", "projects", "contact"]
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [typingComplete, setTypingComplete] = useState(false)

  // Add a meta viewport tag to ensure proper mobile rendering
  useEffect(() => {
    // Ensure proper viewport meta tag for mobile devices
    const meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    document.getElementsByTagName("head")[0].appendChild(meta)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta)
      clearTimeout(timer)
    }
  }, [])

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track mouse position for hover effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Matrix background effect with enhanced animation
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
      drops[i] = Math.floor((Math.random() * canvas.height) / fontSize) * -1
    }

    // Enhanced matrix characters with more variety
    const matrix =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()*&^%"

    function draw() {
      // Darker fade for more contrast
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Base color
      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]

        // Only draw if y position is positive
        if (drops[i] * fontSize > 0) {
          // Random bright characters for glow effect
          if (Math.random() > 0.98) {
            ctx.fillStyle = "#8FFF8F" // Brighter green
            ctx.shadowColor = "#0F0"
            ctx.shadowBlur = 10
            ctx.fillText(text, i * fontSize, drops[i] * fontSize)
            ctx.shadowBlur = 0
            ctx.fillStyle = "#0F0" // Reset to normal color
          } else {
            ctx.fillText(text, i * fontSize, drops[i] * fontSize)
          }
        }

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Randomly reset some drops for varied effect
        if (Math.random() > 0.995) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 33) // ~30fps for smoother animation

    const handleResize = () => {
      resizeCanvas()
      // Reset drops when resizing
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

  // Intersection Observer for section detection with animation triggers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            entry.target.classList.add("section-visible")
          }
        })
      },
      { threshold: 0.3 },
    )

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    // Animate elements when they come into view
    const animateObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
            animateObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    )

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      animateObserver.observe(el)
    })

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) observer.unobserve(element)
      })
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        animateObserver.unobserve(el)
      })
    }
  }, [sections])

  // Typewriter effect for the job title
  useEffect(() => {
    if (isLoading) return

    const text = "Full Stack Web Developer"
    const element = document.getElementById("job-title")
    if (!element) return

    let i = 0
    element.textContent = ""

    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      } else {
        setTypingComplete(true)
      }
    }

    typeWriter()
  }, [isLoading])

  // 3D tilt effect for cards
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleTiltExit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-500 mb-4 glitch-text" data-text="Advay Anand">
            Advay Anand
          </div>
          <div className="matrix-loader">
            <div className="matrix-line"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Matrix Background */}
      <canvas
        ref={matrixCanvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-30"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-green-500/20 nav-animation">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-green-500 logo-animation">Advay Anand</div>
          <div className="hidden md:flex space-x-6">
            {sections.map((section, index) => (
              <a
                key={section}
                href={`#${section}`}
                className={`capitalize transition-colors nav-link ${
                  activeSection === section ? "text-green-500" : "text-gray-400 hover:text-white"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {section}
              </a>
            ))}
          </div>
          <div className="flex md:hidden">
            <div className="relative group">
              <Button variant="ghost" size="sm" className="border border-green-500/30 pulse-animation">
                Menu
              </Button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 border border-green-500/30 rounded-md hidden group-hover:block z-50 menu-animation">
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
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4 section-animation"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center">
          <div className="mb-6 md:mb-8 relative avatar-animation">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-500 overflow-hidden glow-animation">
              <Image
                src="P1.jpg?height=160&width=160"
                alt="Advay Anand"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-black p-2 rounded-full border border-green-500 icon-float">
              <Code className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4 name-animation">
            <span className="text-white">I'm </span>
            <span className="text-green-500 glitch-text" data-text="Advay Anand">
              Advay Anand
            </span>
          </h1>
          <h2 id="job-title" className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 text-gray-300"></h2>
          <p
            className={`max-w-2xl text-gray-400 mb-6 md:mb-10 text-sm md:text-base fade-in-animation ${typingComplete ? "visible" : "hidden"}`}
          >
            Building modern web applications with cutting-edge technologies. Passionate about creating seamless user
            experiences and robust backend systems.
          </p>
          <div
            className={`flex flex-wrap gap-3 md:gap-4 justify-center buttons-animation ${typingComplete ? "visible" : "hidden"}`}
          >
            <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 button-glow">
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
          <div className={`flex gap-4 mt-6 md:mt-10 social-icons-animation ${typingComplete ? "visible" : "hidden"}`}>
            <Link
              href="https://github.com/advay77"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors social-icon"
            >
              <Github className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/advay-anand-a89024277/"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors social-icon"
              style={{ animationDelay: "100ms" }}
            >
              <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:advayanand87@gmail.com"
              className="text-gray-400 hover:text-white transition-colors social-icon"
              style={{ animationDelay: "200ms" }}
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          <a
            href="#about"
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white transition-colors scroll-indicator"
          >
            <ArrowDown className="w-6 h-6" />
            <span className="sr-only">Scroll Down</span>
          </a>
        </div>
      </section>

      {/* About Me Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4 section-animation"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center section-title animate-on-scroll">
            About <span className="text-green-500">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 animate-on-scroll" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-bold mb-4 glitch-text" data-text="Who am I?">
                Who am I?
              </h3>
              <p className="text-gray-300 mb-4 fade-in-text">
                I'm Advay Anand, a passionate Full Stack Web Developer with expertise in building modern web
                applications. With a strong foundation in both frontend and backend technologies, I create seamless
                digital experiences that solve real-world problems.
              </p>
              <p className="text-gray-300 mb-6 fade-in-text" style={{ animationDelay: "200ms" }}>
                I have experience working with JavaScript, React, Node.js, and various database technologies. My
                approach combines technical excellence with creative problem-solving to deliver solutions that exceed
                expectations.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6 animate-on-scroll" style={{ animationDelay: "400ms" }}>
                <div className="info-item">
                  <p className="text-gray-400">Name:</p>
                  <p className="font-medium">Advay Anand</p>
                </div>
                <div className="info-item" style={{ animationDelay: "100ms" }}>
                  <p className="text-gray-400">Email:</p>
                  <p className="font-medium">advayanand87gmail.com</p>
                </div>
                <div className="info-item" style={{ animationDelay: "200ms" }}>
                  <p className="text-gray-400">From:</p>
                  <p className="font-medium">Prayagraj, India</p>
                </div>
                <div className="info-item" style={{ animationDelay: "300ms" }}>
                  <p className="text-gray-400">Freelance:</p>
                  <p className="font-medium text-green-500">Available</p>
                </div>
              </div>
              <Button
                asChild
                className="bg-green-500 hover:bg-green-600 button-glow animate-on-scroll"
                style={{ animationDelay: "600ms" }}
              >
                <a href="https://drive.google.com/file/d/1O-J8BBNPlorNZbNd3mt4f7iT2KJrI-Ru/view?usp=drivesdk" download>
                  Download Resume
                </a>
              </Button>
            </div>
            <div className="order-1 md:order-2 flex justify-center animate-on-scroll">
              <div className="relative tilt-element" onMouseMove={handleTilt} onMouseLeave={handleTiltExit}>
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-4 border-green-500/50 image-glow">
                  <Image
                    src="/P2.jpg?height=320&width=320"
                    alt="Advay Anand"
                    width={320}
                    height={320}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black p-3 rounded-lg border border-green-500 icon-float">
                  <User className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4 section-animation"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center section-title animate-on-scroll">
            My <span className="text-green-500">Skills</span>
          </h2>
          <div className="grid grid-cols-1 gap-10">
            <div className="animate-on-scroll">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 glitch-text" data-text="Technical Skills">
                Technical Skills
              </h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  { name: "JavaScript/TypeScript", percentage: 90 },
                  { name: "React/Next.js", percentage: 85 },
                  { name: "Node.js/Express", percentage: 80 },
                  { name: "HTML/CSS", percentage: 95 },
                  { name: "MongoDB/SQL", percentage: 75 },
                ].map((skill, index) => (
                  <div
                    key={skill.name}
                    className="skill-bar-container animate-on-scroll"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-400 counter-animation" data-target={skill.percentage}>
                        0%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full progress-bar"
                        style={{ width: "0%" }}
                        data-width={`${skill.percentage}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 glitch-text" data-text="Professional Skills">
                Professional Skills
              </h3>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {[
                  { name: "Communication", percentage: 85 },
                  { name: "Teamwork", percentage: 90 },
                  { name: "Problem Solving", percentage: 95 },
                  { name: "Creativity", percentage: 80 },
                  { name: "Project Management", percentage: 75 },
                  { name: "Adaptability", percentage: 85 },
                ].map((skill, index) => (
                  <div
                    key={skill.name}
                    className="relative animate-on-scroll"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <svg
                      className="w-full h-32 circle-animation"
                      viewBox="0 0 100 100"
                      data-percentage={skill.percentage}
                    >
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        className="skill-circle"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                        strokeDashoffset={2 * Math.PI * 40}
                        data-offset={2 * Math.PI * 40 * (1 - skill.percentage / 100)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-xl font-bold percentage-counter" data-target={skill.percentage}>
                        0%
                      </div>
                      <div className="text-sm text-gray-400">{skill.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 md:mt-16 animate-on-scroll" style={{ animationDelay: "600ms" }}>
            <h3
              className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center glitch-text"
              data-text="Technologies I Work With"
            >
              Technologies I Work With
            </h3>
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
              ].map((tech, index) => (
                <div
                  key={tech}
                  className="bg-black/50 border border-green-500/30 rounded-lg p-4 text-center hover:border-green-500 transition-colors tech-card animate-on-scroll"
                  style={{ animationDelay: `${700 + index * 50}ms` }}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltExit}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4 section-animation"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center section-title animate-on-scroll">
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
                tech: ["React", "Java-Script", "Node.js/Express", "Tailwind-Css", "MongoDB"],
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
                tech: ["React", "Javascript", "TypeScript", "Tailwind CSS", "Flask/Python"],
                image: "/photo3.png?height=200&width=300",
              },
              {
                title: "Jal-Saaf-Tech 💧",
                description: "Website made for water security with an IOT Device embedded and maps feature",
                tech: ["React.js", "Tailwaind CSS", "Flask/Python", "MongoDB"],
                image: "/photo4.png?height=200&width=300",
              },
            ].map((project, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-500/30 overflow-hidden hover:border-green-500 transition-all group project-card animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltExit}
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
                  <h3 className="text-xl font-bold mb-2 project-title">{project.title}</h3>
                  <p className="text-gray-400 mb-4 project-description">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded tech-tag"
                        style={{ animationDelay: `${techIndex * 50}ms` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 project-buttons">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-500 hover:bg-green-500/10 button-glow"
                    >
                      View Demo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                      style={{ animationDelay: "100ms" }}
                    >
                      Source Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center relative z-10 pt-16 px-2 sm:px-4 section-animation"
      >
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center section-title animate-on-scroll">
            Contact <span className="text-green-500">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold mb-6 glitch-text" data-text="Get In Touch">
                Get In Touch
              </h3>
              <p className="text-gray-300 mb-8 fade-in-text">
                Feel free to reach out if you're looking for a developer, have a question, or just want to connect.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4 contact-item animate-on-scroll">
                  <div className="bg-green-500/20 p-3 rounded-lg icon-pulse">
                    <Mail className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-400">advayanand87@gmail.com</p>
                  </div>
                </div>
                <div
                  className="flex items-start gap-4 contact-item animate-on-scroll"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="bg-green-500/20 p-3 rounded-lg icon-pulse">
                    <Github className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <p className="text-gray-400">https://github.com/advay77/advayanand</p>
                  </div>
                </div>
                <div
                  className="flex items-start gap-4 contact-item animate-on-scroll"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="bg-green-500/20 p-3 rounded-lg icon-pulse">
                    <Linkedin className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">LinkedIn</h4>
                    <p className="text-gray-400">https://www.linkedin.com/in/advay-anand-a89024277/advayanand</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <h3 className="text-2xl font-bold mb-6 glitch-text" data-text="Send Me a Message">
                Send Me a Message
              </h3>
              <form className="space-y-3 md:space-y-4 form-animation">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="form-field-animation">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base input-glow"
                    />
                  </div>
                  <div className="form-field-animation" style={{ animationDelay: "100ms" }}>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your Email"
                      className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base input-glow"
                    />
                  </div>
                </div>
                <div className="form-field-animation" style={{ animationDelay: "200ms" }}>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Subject"
                    className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base input-glow"
                  />
                </div>
                <div className="form-field-animation" style={{ animationDelay: "300ms" }}>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your Message"
                    rows={4}
                    className="bg-black/50 border-green-500/30 focus:border-green-500 text-sm md:text-base input-glow"
                  />
                </div>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-sm md:text-base button-glow form-field-animation"
                  style={{ animationDelay: "400ms" }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-green-500/20 bg-black/80 footer-animation">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold text-green-500 mb-4 md:mb-0 logo-animation">Advay Anand</div>
            <div className="flex gap-4 social-icons-animation">
              <Link
                href="https://github.com/advay77"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors social-icon"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/advay-anand-a89024277/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors social-icon"
                style={{ animationDelay: "100ms" }}
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:advayanand87@gmail.com"
                className="text-gray-400 hover:text-white transition-colors social-icon"
                style={{ animationDelay: "200ms" }}
              >
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-400 text-sm fade-in-animation">
            &copy; {new Date().getFullYear()} Advay Anand. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

